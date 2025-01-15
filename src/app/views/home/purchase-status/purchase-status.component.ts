import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HelpComponent } from '../../../shared/help/help.component';
import { OrderService } from '../../../auth/services/order.service';
import { IOrderSummary } from '../../../auth/interfaces/order-summary';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../auth/services/auth.service';
import { ICustomer } from '../../../auth/interfaces/customer';
import { IOrderDetails } from '../../../auth/interfaces/order-details';
import { PaginatedResponse } from '../../../auth/interfaces/PaginatedResponse';

@Component({
  selector: 'app-purchase-status',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    HelpComponent,
    RouterModule,
    MatPaginatorModule
  ],
  templateUrl: './purchase-status.component.html',
  styleUrl: './purchase-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseStatusComponent implements OnInit {
  orders: IOrderSummary[] = [];
  selectedOrder: IOrderSummary | null = null;
  customer: ICustomer | null = null;
  orderDetails: IOrderDetails[] = [];

  pageSize = 5;
  pageIndex = 0;
  hidePageSize = true;
  totalItemLogData = 0;
  showFirstLastButtons = true;
  totalItems = 0;
  showDetails: boolean = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private readonly paginator: MatPaginatorIntl) {
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
    this.loadOrders();
  }

  loadOrders(resetPage: boolean = true): void {
    if (resetPage) {
      this.pageIndex = 0;
    }

    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      console.error('Usuario no autenticado');
      return;
    }

    const taxIdentificationNumber = currentUser.taxIdentificationNumber;
    const offset = this.pageIndex * this.pageSize;
    const limit = this.pageSize;

    this.orderService.getOrdersByAuthor(taxIdentificationNumber, limit, offset).subscribe(
      (response) => {
        this.orders = response.data;
        this.totalItems = response.totalRecords;
        this.cdr.markForCheck();
      },
      (error) => {
        console.error('Error al cargar las órdenes:', error);
      }
    );
  }

  Paginate(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
 
    this.loadOrders(false);
  }
  
  showOrderDetails(order: IOrderSummary, resetPage: boolean = true): void {
    this.selectedOrder = order;
    this.showDetails = true;

    if (resetPage) {
      this.pageIndex = 0;
    }

    const offset = this.pageIndex * this.pageSize;
    const limit = this.pageSize;

    this.orderService.getOrderDetails(order.internalOrderNumber, limit, offset).subscribe(      
      (response: PaginatedResponse<IOrderDetails>) => {
        this.orderDetails = response.data;
        this.totalItems = response.totalRecords;
        this.cdr.markForCheck();
      },
      (error) => {
        console.error('Error al obtener los detalles de la orden:', error);
      }
    );
  }
  showPurchaseOrder(order: IOrderSummary): void {
    this.selectedOrder = order;    
    this.orderDetails = [];
    this.showDetails = false;
    this.cdr.markForCheck();
  }
  
  hideOrderDetails(): void {
    this.selectedOrder = null;
    
    this.cdr.markForCheck();
  }


}
