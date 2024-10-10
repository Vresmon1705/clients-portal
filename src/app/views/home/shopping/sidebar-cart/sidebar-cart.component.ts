import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../../auth/interfaces/product';
import { AuthService } from '../../../../auth/services/auth.service';
import { ShoppingCartService } from '../../../../auth/services/shopping-cart.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './sidebar-cart.component.html',
  styleUrl: './sidebar-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarCartComponent {

  @Input() cart: Product[] = [];


  constructor(
    private cartService: ShoppingCartService,
    private cdr: ChangeDetectorRef,    
    private router: Router
  ) {  }

  removeFromCart(index: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de eliminar el producto?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(index);
        this.cdr.detectChanges();
        swalWithBootstrapButtons.fire(
          'Eliminado',
          'El producto ha sido eliminado del carrito.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El producto sigue en tu carrito :)',
          'error'
        );
      }
    });
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      console.log(this.cart) 
    }
  }

  getTotal(): number {
    return this.cart.reduce((total, product) => total + product.price * product.quantity, 0);
  }

  goToCart() {
    this.router.navigate(['/home/shopping-cart']);
  }
}
