import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IOrderSummary } from '../../../auth/interfaces/order-summary';
import { IOrderDetails } from '../../../auth/interfaces/order-details';
import { DetailsOrdersComponent } from '../details-order/details-order.component';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { OrderService } from '../../../auth/services/order.service';
import { PaginatedResponse } from '../../../auth/interfaces/PaginatedResponse';

@Component({
  selector: 'app-purchase-status',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './purchase-status.component.html',
  styleUrls: ['./purchase-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseStatusComponent {
  @Input() selectedOrder!: IOrderSummary;
  @Input() orderDetails: IOrderDetails[] = [];
  @Output() backClicked = new EventEmitter<void>();

  pageSize = 10;
  pageIndex = 0;
  hidePageSize = true;
  showFirstLastButtons = true;
  totalItems = 0;

  constructor(
      private orderService: OrderService,
      private cdr: ChangeDetectorRef,
      private readonly paginator: MatPaginatorIntl
    ) {
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

  onBackClick(): void {
    this.backClicked.emit();
  }
  hideOrderDetails(): void {
    this.orderDetails = [];
    this.cdr.markForCheck();
  }

  onOrderDetailsPageChange(event: PageEvent): void {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
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
}