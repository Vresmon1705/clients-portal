import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { IOrderSummary } from '../../../auth/interfaces/order-summary';
import { IOrderDetails } from '../../../auth/interfaces/order-details';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-details-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './details-order.component.html',
  styleUrls: ['./details-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsOrdersComponent {
  @Input() orderDetails: IOrderDetails[] = [];
  @Input() selectedOrder!: IOrderSummary;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() showFirstLastButtons = true;
  @Input() hidePageSize = true;
  @Input() totalItems = 0;
  selectedStatus: string = '';
  filteredOrders: any[] = [];
  orders: IOrderSummary[] = [];

  @Output() backClicked = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  constructor(
      private cdr: ChangeDetectorRef) {
    }

  filterOrders() {
    if (this.selectedStatus) {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    } else {
      this.filteredOrders = this.orders;
    }
    this.cdr.markForCheck();
  }

  onBackClick(): void {
    this.backClicked.emit();
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}