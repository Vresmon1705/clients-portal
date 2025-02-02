import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import { IArticle } from '../../../auth/interfaces/article';
import { MatIconModule } from '@angular/material/icon';
import { SidebarCartComponent } from "./sidebar-cart/sidebar-cart.component";
import { ArticleService } from '../../../auth/services/article.service';
import { FormsModule } from '@angular/forms';
import { HelpComponent } from '../../../shared/help/help.component';
import { CustomerService } from '../../../auth/services/customer.service';
import { ICustomer } from '../../../auth/interfaces/customer';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStatus } from '../../../auth/interfaces/auth.status.enum';
import { BehaviorSubject, debounceTime, switchMap, catchError, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { OrderService } from '../../../auth/services/order.service';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SidebarCartComponent,
    FormsModule,
    HelpComponent,
    RouterModule,
    MatPaginatorModule
  ],
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
})
export class ShoppingComponent implements OnInit {
  cart: IArticle[] = [];
  customer: ICustomer | null = null;
  addresses: string[] = [];
  taxId: string | null = null;
  partySiteNumber: string | null = null;
  articles: IArticle[] = [];
  filteredArticles: IArticle[] = [];
  searchTerm: string = '';
  accountNumber: string | null = null;  
  selectedAddress: string = '';
  selectedPartySiteNumber: string = '';
  address: string = '';
  private addressSubscription: Subscription | undefined;

  pageSize = 8;
  pageIndex = 0;
  hidePageSize = true;
  showFirstLastButtons = true;
  filterDataArticlesTotal= 0;

  constructor(
    private cartService: ShoppingCartService,
    private articleService: ArticleService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private readonly paginator: MatPaginatorIntl
  ) {
    this.cartService.cart$.subscribe(cart => this.cart = cart);

    this.paginator.nextPageLabel = 'Siguiente página';
    this.paginator.previousPageLabel = 'Página anterior';
    this.paginator.firstPageLabel = 'Primera página';
    this.paginator.lastPageLabel = 'Ultima página';
 
    this.paginator.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      return `${startIndex + 1} al ${startIndex + pageSize} de ${length} pagina: ${page + 1} `;
    };
  }

  ngOnInit(): void {
    const authStatus = this.authService.authStatusRead();

    if (authStatus === AuthStatus.authenticated) {
      const currentUser = this.authService.currentUser();
      this.taxId = currentUser?.taxIdentificationNumber ?? null;
      this.accountNumber = currentUser?.accountNumber ?? null;
      this.partySiteNumber = currentUser?.partySiteNumber ?? null;

      if (this.taxId) {
        this.fetchCustomerData();
      } else {
        console.error('No se encontró el NIT del usuario');
      }
    } else {
      this.authService.checkAuthStatus().subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          const user = this.authService.currentUser();
          this.taxId = user?.taxIdentificationNumber ?? null;
          this.accountNumber = user?.accountNumber ?? null;
          this.partySiteNumber = user?.partySiteNumber ?? null;
          if (this.taxId) {
            this.fetchCustomerData();
          }
        } else {
          console.error('Usuario no autenticado.');
        }
      });
    }

    this.addressSubscription = this.orderService.selectedAddress$.subscribe(address => {
      this.address = address || '';
    });
  }

  selectAddress(address: string, partySiteNumber: string): void {
    this.selectedAddress = address;
    this.selectedPartySiteNumber = partySiteNumber;
    this.orderService.setSelectedAddress(address, partySiteNumber);
  }

  private fetchCustomerData(): void {
    if (this.taxId) {
      this.customerService.getCustomerByTaxId(this.taxId).subscribe(
        (data: ICustomer[]) => {
          if (data.length > 0) {
            this.customer = data[0];
            this.addresses = this.extractAddresses(data);
            this.accountNumber = this.customer?.accountNumber ?? null;
            this.partySiteNumber = this.customer?.partySiteNumber ?? null;
            this.cdr.markForCheck();
            this.searchArticles();
          } else {
            console.warn('No se encontraron datos para este NIT');
          }
        },
        error => {
          console.error('Error fetching customer data', error);
        }
      );
    }
  }

  private extractAddresses(customers: ICustomer[]): string[] {
    return customers
      .map((customer) => customer.address)
      .filter((address, index, self) => address && self.indexOf(address) === index);
  }

  searchArticles(resetPage: boolean = true): void {
    const description = this.searchTerm.trim();

    if (!description) {
      this.articles = [];
      this.filteredArticles = [];
      return;
    }

    if (resetPage) {
      this.pageIndex = 0;
    }

    const accountNumber = this.customer?.accountNumber ?? '';
    const offset = this.pageIndex * this.pageSize;
    const limit = this.pageSize;

    this.articleService.searchArticlesByDescription(description, accountNumber, limit, offset)
      .subscribe(
        {
          next: (respuesta: any) => {
            if (respuesta.data.length > 0) {
              this.articles = respuesta.data || [];
              this.filteredArticles = respuesta.data;
              this.filterDataArticlesTotal = respuesta.totalRecords;
            } else {
              this.articles = [];
              this.filteredArticles = [];
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al buscar artículos', err);
          }
        }
      );
  }

  Paginate(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
 
    this.searchArticles(false);
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