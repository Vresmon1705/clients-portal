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
import { IOrder } from '../../../auth/interfaces/order';
import { AuthService } from '../../../auth/services/auth.service';

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
  selectedPartySiteNumber: string = '';
  order = {
    deliveryDate: '',
    purchaseOrder: '',
    discountNumberPP: 0,
    notes: '',
  };

  constructor(
    private cartService: ShoppingCartService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadCart();
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(updatedCart => {
      this.cart = updatedCart;
    });

    this.addressSubscription = this.orderService.partySiteNumber$.subscribe(partySiteNumber => {
      this.selectedPartySiteNumber = partySiteNumber || '';
      console.log('Selected party site number:', this.selectedPartySiteNumber);
    });
  }

  loadCart() {
    this.cart = this.cartService.getCart().map(article => ({
      ...article,
      quantity: article.g_qPackingUnit || 1,
      staticPackingUnit: article.g_qPackingUnit      
    }));
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
      discountPP: '0-4 días',
      discountNumberPP: 5.5,
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

    console.log('Order payload:', orderPayload);

    this.orderService.createOrder(orderPayload).subscribe(
      (response) => {
        Swal.fire('Éxito', 'Order processed successfully', 'success');
        this.cartService.clearCart();
      },
      (error) => {
        Swal.fire('Error', 'Hubo un problema al procesar el pedido.', 'error');
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

  finalAmount(): number {
    return this.cart.reduce((total, article) => total + (article.basePrice * article.g_qPackingUnit) + ((article.taxPercentage * article.basePrice * article.g_qPackingUnit) / 100), 0);
  }
  
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
