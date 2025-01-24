import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PurchaseStatusComponent } from '../purchase-status/purchase-status.component';
import { DetailsOrdersComponent } from '../details-order/details-order.component';
import { HelpComponent } from '../../../shared/help/help.component';
import { IOrderSummary } from '../../../auth/interfaces/order-summary';
import { IOrderDetails } from '../../../auth/interfaces/order-details';
import { OrderService } from '../../../auth/services/order.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PaginatedResponse } from '../../../auth/interfaces/PaginatedResponse';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    PurchaseStatusComponent,
    DetailsOrdersComponent,
    HelpComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit {
  orders: IOrderSummary[] = [];
  selectedOrder: IOrderSummary | null = null;
  orderDetails: IOrderDetails[] = [];
  showDetails = false;

  pageSize = 10;
  pageIndex = 0;
  hidePageSize = true;
  showFirstLastButtons = true;
  totalItems = 0;

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

  Paginate(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadOrders(false);
    this.cdr.markForCheck();
  }
  showOrderDetails(order: IOrderSummary, resetPage: boolean = true): void {
    this.selectedOrder = order;
    this.showDetails = true;

    if (resetPage) {
      this.pageSize = 10;
      this.pageIndex = 0;
      this.cdr.markForCheck();
    }

    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    const offset = this.pageIndex * this.pageSize;
    const limit = this.pageSize;

    if (!this.selectedOrder) {
      console.error('No order selected');
      return;
    }
    this.orderService.getOrderDetails(this.selectedOrder.internalOrderNumber, limit, offset).subscribe(
      (response: PaginatedResponse<IOrderDetails>) => {
        this.orderDetails = response.data;
        this.totalItems = response.totalRecords;
        this.cdr.markForCheck();
        console.log('Detalles de la orden:', this.orderDetails, this.totalItems);
      },
      (error) => {
        console.error('Error al obtener los detalles de la orden:', error);
      }
    );
  }

  PaginateOrderDetails(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrderDetails();
  }

  showPurchaseOrder(order: IOrderSummary): void {
    this.selectedOrder = order;
    this.orderDetails = [];
    this.showDetails = false;
    this.cdr.markForCheck();
  }

  hideOrderDetails(): void {
    this.selectedOrder = null;
    this.orderDetails = [];
    this.showDetails = false;
    this.loadOrders(false);
    this.cdr.markForCheck();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders(false);
  }

  onOrderDetailsPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrderDetails();
  }

  @Output() backClicked = new EventEmitter<void>();
  
    onBackClick(): void {
      this.backClicked.emit();
    }
  
}