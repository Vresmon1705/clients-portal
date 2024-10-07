import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-purchase-status',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './purchase-status.component.html',
  styleUrl: './purchase-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseStatusComponent { }
