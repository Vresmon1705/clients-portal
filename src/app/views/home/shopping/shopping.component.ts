import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import { Product } from '../../../auth/interfaces/product';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { SidebarCartComponent } from "./sidebar-cart/sidebar-cart.component";
import { RouterModule } from '@angular/router';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../../../auth/services/product.service';
import { FormsModule } from '@angular/forms';
import { HelpComponent } from '../../../shared/help/help.component';
import { CustomerService } from '../../../auth/services/customer.service';
import { Customer } from '../../../auth/interfaces/customer';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SidebarCartComponent,
    RouterModule,
    ProductDetailComponent,
    FormsModule,
    HelpComponent
  ],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingComponent implements OnInit {

  cart: Product[] = [];
  customer: Customer | null = null;
  addresses: string[] = [];
  taxId = '901592529-1';
  products: Product[] = [];
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;
  filteredProducts: Product[] = [];

  trackByProductId(index: number, product: Product): number {
    return typeof product.id === 'number' ? product.id : index;
  }

  constructor(
    private cartService: ShoppingCartService,
    private productService: ProductService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
  }

  ngOnInit(): void {
    this.customerService.getCustomerByTaxId(this.taxId).subscribe((data: Customer[]) => {
      if (data.length > 0) {
        this.customer = data[0];
        this.addresses = this.extractAddresses(data);
        this.cdr.detectChanges();
      } else {
        console.warn('No se encontraron datos para este NIT');
      }
    });
  }

  private extractAddresses(customers: Customer[]): string[] {
    return customers
      .map((customer) => customer.address)
      .filter((address, index, self) => address && self.indexOf(address) === index);
  }

  searchProducts(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProductsByDescription(this.searchTerm)
        .subscribe((data: Product[]) => {
          this.products = data;
          this.totalItems = data.length;
          this.currentPage = 1;
          this.updatePaginatedProducts();
          this.cdr.detectChanges();
        });
    } else {
      this.products = [];
      this.filteredProducts = [];
      this.totalItems = 0;
    }
  }

  getPaginatedProducts(products: Product[]): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  updatePaginatedProducts(): void {
    this.filteredProducts = this.getPaginatedProducts(this.products);
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
