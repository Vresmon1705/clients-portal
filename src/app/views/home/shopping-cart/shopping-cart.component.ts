import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { IArticle } from '../../../auth/interfaces/article';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelpComponent } from '../../../shared/help/help.component';
import { OrderService } from '../../../auth/services/order.service';
import { ICustomer } from '../../../auth/interfaces/customer';
import { CustomerService } from '../../../auth/services/customer.service';
import { IOrder } from '../../../auth/interfaces/order-create';
import { AuthService } from '../../../auth/services/auth.service';
import { PromptPaymentService } from '../../../auth/services/prompt-payment.service';
import { PaginatedResponse } from '../../../auth/interfaces/PaginatedResponse';
import { DiscountPromptPayment } from '../../../auth/interfaces/discount-prompt-payment';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterModule,
    HelpComponent
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cart: IArticle[] = [];
  customer: ICustomer | null = null;
  private cartSubscription: Subscription | undefined;
  private addressSubscription: Subscription | undefined;
  purchaseCompleted: boolean = false;
  selectedPartySiteNumber: string = '';
  isLoading: boolean = false;
  order = {
    deliveryDate: '',
    purchaseOrder: '',
    discountNumberPP: 0,
    notes: '',
    discountPP: ''
  };

  constructor(
    private cartService: ShoppingCartService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private promptPaymentService: PromptPaymentService
  ) {
    const authStatus = this.authService.authStatusRead();
    if (authStatus === 'authenticated') {
      this.loadCart();
    } else {
      this.cartService.clearCart();
    }
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(updatedCart => {
      this.cart = updatedCart;
    });

    this.addressSubscription = this.orderService.partySiteNumber$.subscribe(partySiteNumber => {
      this.selectedPartySiteNumber = partySiteNumber || '';
    });

    this.promptPaymentService.getPromptPayments().subscribe((response: PaginatedResponse<DiscountPromptPayment>) => {
      if (response && response.data && response.data.length > 0) {
        const promptPayment = response.data[0];
        this.order.discountPP = promptPayment.namePP;
        this.order.discountNumberPP = promptPayment.discount;
        console.log(promptPayment)
      }
    });
  }

  loadCart() {
    this.cartService.loadCart();
  }

  loadCustomer(taxIdentificationNumber: string): void {
    this.customerService.getCustomerByTaxId(taxIdentificationNumber).subscribe(
      (data) => {
        this.customer = data[0];
      },
      (error) => {
        Swal.fire('Error', 'No se pudieron cargar los datos del cliente.', 'error');
      }
    );
  }

  createOrder(): void {

    const currentUser = this.authService.currentUser();
    if (!currentUser || !currentUser.taxIdentificationNumber) {
      Swal.fire('Error', 'Los datos del cliente no están disponibles.', 'error');
      return;
    }

    const orderPayload: IOrder = {
      author: currentUser.taxIdentificationNumber,
      partySiteNumber: this.selectedPartySiteNumber,
      deliveryDate: this.order.deliveryDate,
      notes: this.order.notes,
      discountPP: this.order.discountPP,
      discountNumberPP: this.order.discountNumberPP,
      paymentCondition: 'CREDITO A 8 DIAS',
      purchaseOrder: this.order.purchaseOrder,
      articles: this.cart.map((article) => ({
        itemNumber: article.itemNumber,
        description: article.description,
        quantity: article.quantity,
        g_qPackingUnit: Number(article.g_qPackingUnit),
        basePrice: article.basePrice,
        subtotal: article.basePrice * article.g_qPackingUnit,
        taxPercentage: article.taxPercentage,
        iva: (article.taxPercentage / 100) * article.basePrice * article.quantity,
        catPrice: article.catPrice,
        g_class: article.g_class || '',
        currency: article.currency,
      })),
    };
    this.isLoading = true;
    this.orderService.createOrder(orderPayload).subscribe(
      (response) => {
        Swal.fire('Éxito', 'Order processed successfully', 'success');
        this.cartService.clearCart();
        this.purchaseCompleted = true;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log(orderPayload)
      },
      (error) => {
        Swal.fire('Error', 'Hubo un problema al procesar el pedido.', 'error');
        this.isLoading = false;
      }
    );
  }

  updateQuantity(articleId: string, quantity: number) {
    this.cartService.updateQuantity(articleId.toString(), quantity);
  }

  removeFromCart(index: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de eliminar el articulo?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(index);
        this.loadCart();
        this.cdr.detectChanges();
        swalWithBootstrapButtons.fire(
          'Eliminado',
          'El articulo ha sido eliminado del carrito.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El articulo sigue en tu carrito :)',
          'error'
        );
      }
    });
  }

  clearCart(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de vaciar el carrito?',
      text: '¡Todos los articulos serán eliminados!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        this.cdr.detectChanges();
        swalWithBootstrapButtons.fire(
          'Carrito vacío',
          'El carrito ha sido vaciado.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El carrito no fue vaciado :)',
          'error'
        );
      }
    });
  }

  totalTaxes(): number {
    return this.cart.reduce((total, article) => {
      const tax = (article.taxPercentage * article.basePrice * article.g_qPackingUnit) / 100;
      return total + tax;
    }, 0);
  }

  amountWithTaxes(): number {
    return this.cart.reduce((total, article) => total + (article.basePrice * article.g_qPackingUnit) + this.totalTaxes(), 0);
  }

  totalAmount(): number {
    const amount = this.cart.reduce((total, article) => total + (article.basePrice * article.g_qPackingUnit), 0);
    const taxes = this.totalTaxes();
    const amountWithTaxes = amount + taxes;
    const discountAmount = (amountWithTaxes * this.order.discountNumberPP) / 100;
    return amountWithTaxes - discountAmount;
  }
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
