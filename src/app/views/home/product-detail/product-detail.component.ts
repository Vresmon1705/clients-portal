import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Product } from '../../../auth/interfaces/product';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import { ProductService } from '../../../auth/services/product.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { SidebarCartComponent } from '../shopping/sidebar-cart/sidebar-cart.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    SidebarCartComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  
  product: Product | undefined;
  similarProducts: Product[] = [];
  cart: Product[] = [];
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: ShoppingCartService
  ) {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      if (productId) {
        const product = this.productService.getProductById(productId);
        if (product) {
          this.product = product;
          this.similarProducts = this.productService.getSimilarProducts(productId) ?? [];
        } else {
          console.error('Producto no encontrado');
        }
      }
    });
  }
  
  loadCart(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  addToCart(product: Product | undefined): void {
    if (product) {
      const productToAdd = { ...product, quantity: this.quantity };
      this.cartService.addToCart(productToAdd);
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
}