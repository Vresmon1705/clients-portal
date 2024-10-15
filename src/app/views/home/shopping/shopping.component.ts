import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import { Product } from '../../../auth/interfaces/product';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { SidebarCartComponent } from "./sidebar-cart/sidebar-cart.component";
import { RouterModule } from '@angular/router';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../../../auth/services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SidebarCartComponent,
    RouterModule,
    ProductDetailComponent,
    FormsModule
],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingComponent {
  products: Product[] = [];
  cart: Product[] = [];

  constructor(
    private cartService: ShoppingCartService,
    private productService: ProductService
  ) {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
  }

  ngOnInit(): void {
    this.products = this.productService.getProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Producto agregado al carrito"
    });
  }
}
