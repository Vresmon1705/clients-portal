import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import { IArticle } from '../../../auth/interfaces/article';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { SidebarCartComponent } from "./sidebar-cart/sidebar-cart.component";
import { ArticleDetailComponent } from '../article-detail/article-detail.component';
import { ArticleService } from '../../../auth/services/article.service';
import { FormsModule } from '@angular/forms';
import { HelpComponent } from '../../../shared/help/help.component';
import { CustomerService } from '../../../auth/services/customer.service';
import { Customer } from '../../../auth/interfaces/customer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SidebarCartComponent,
    RouterModule,
    ArticleDetailComponent,
    FormsModule,
    HelpComponent
  ],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingComponent implements OnInit {

  cart: IArticle[] = [];
  customer: Customer | null = null;
  addresses: string[] = [];
  taxId = '901592529-1';
  articles: IArticle[] = [];
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;
  filteredArticles: IArticle[] = [];

  constructor(
    private cartService: ShoppingCartService,
    private articleService: ArticleService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
  }

  ngOnInit(): void {
    this.fetchCustomerData();
  }

  private fetchCustomerData(): void {
    this.customerService.getCustomerByTaxId(this.taxId).subscribe(
      (data: Customer[]) => {
        if (data.length > 0) {
          this.customer = data[0];
          this.addresses = this.extractAddresses(data);
          this.cdr.detectChanges();
        } else {
          console.warn('No se encontraron datos para este NIT');
        }
      },
      error => {
        console.error('Error fetching customer data', error);
      }
    );
  }

  private extractAddresses(customers: Customer[]): string[] {
    return customers
      .map((customer) => customer.address)
      .filter((address, index, self) => address && self.indexOf(address) === index);
  }

  searchArticles(): void {
    if (this.searchTerm.trim()) {
      this.articleService.searchArticlesByDescription(this.searchTerm)
        .subscribe((data: IArticle[]) => {
          this.articles = data;
          this.totalItems = data.length;
          this.currentPage = 1;
          this.updatePaginatedArticles();
          this.cdr.detectChanges();
        });
    } else {
      this.articles = [];
      this.filteredArticles = [];
      this.totalItems = 0;
    }
  }

  getPaginatedArticles(articles: IArticle[]): IArticle[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return articles.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePaginatedArticles();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedArticles();
    }
  }

  updatePaginatedArticles(): void {
    this.filteredArticles = this.getPaginatedArticles(this.articles);
  }

  addToCart(article: IArticle) {
    this.cartService.addToCart(article);
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
      title: "Artículo agregado al carrito"
    });
  }
}
