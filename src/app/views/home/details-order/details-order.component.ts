import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { IOrderSummary } from '../../../auth/interfaces/order-summary';
import { IOrderDetails } from '../../../auth/interfaces/order-details';

@Component({
  selector: 'app-details-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule
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

  @Output() backClicked = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  onBackClick(): void {
    this.backClicked.emit();
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}