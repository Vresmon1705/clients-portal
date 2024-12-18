import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { IArticle } from '../../../auth/interfaces/article';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelpComponent } from '../../../shared/help/help.component';

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
export class ShoppingCartComponent implements OnInit {

  cart: IArticle[] = [];
  private cartSubscription: Subscription | undefined;

  loadCart() {
    this.cart = this.cartService.getCart();
  }
  constructor(
    private cartService: ShoppingCartService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadCart();
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(updatedCart => {
      this.cart = updatedCart;
      this.cdr.detectChanges();
    });
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

  updateQuantity(articleId: string, quantity: number) {
    this.cartService.updateQuantity(articleId.toString(), quantity);

  }

  getTotal(): number {
    return this.cart.reduce((total, article) => total + article.basePrice * article.quantity, 0);
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
