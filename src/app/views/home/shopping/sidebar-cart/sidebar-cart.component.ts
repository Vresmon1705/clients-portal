import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, input, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IArticle } from '../../../../auth/interfaces/article';
import { ShoppingCartService } from '../../../../auth/services/shopping-cart.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { HelpComponent } from '../../../../shared/help/help.component';

@Component({
  selector: 'app-sidebar-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,

  ],
  templateUrl: './sidebar-cart.component.html',
  styleUrl: './sidebar-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarCartComponent implements OnInit {
  
  @Input()cart: IArticle[] = [];
  private cartSubscription: Subscription | undefined;
  totalItems: number = 0;

  constructor(
    private cartService: ShoppingCartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loadCart();
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(updatedCart => {
      this.cart = updatedCart;
      this.totalItems = this.cartService.getTotalItems();
      this.cdr.markForCheck(); 
    });
  }

  loadCart() {
    this.cart = this.cartService.getCart();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
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
      text: '¡Todos los productos serán eliminados!',
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

  goToCart() {
    this.router.navigate(['/home/shopping-cart']);
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

}