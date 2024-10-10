import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { Product } from '../../../auth/interfaces/product';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    FormsModule,    
    MatIconModule,    
    RouterModule,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ShoppingCartComponent {

  // cart: Product[] = [];

  // loadCart() {
  //   this.cart = this.cartService.getCart();
  // }

  // constructor(
  //   private cartService: ShoppingCartService,
  //   private cdr: ChangeDetectorRef
  // ) {
  //   this.loadCart();
  // }

  // removeFromCart(index: number) {
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       confirmButton: 'btn btn-success',
  //       cancelButton: 'btn btn-danger'
  //     },
  //     buttonsStyling: false
  //   });

  //   swalWithBootstrapButtons.fire({
  //     title: '¿Estás seguro de eliminar el producto?',
  //     text: '¡No podrás revertir esto!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'No, cancelar',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.cartService.removeFromCart(index);
  //       this.loadCart();
  //       this.cdr.detectChanges();
  //       swalWithBootstrapButtons.fire(
  //         'Eliminado',
  //         'El producto ha sido eliminado del carrito.',
  //         'success'
  //       );
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       swalWithBootstrapButtons.fire(
  //         'Cancelado',
  //         'El producto sigue en tu carrito :)',
  //         'error'
  //       );
  //     }
  //   });
  // }

  // updateQuantity(productId: number, quantity: number) {
  //   if (quantity > 0) {
  //     this.cartService.updateQuantity(productId, quantity);
  //     this.loadCart();
  //   }
  // }
 }
