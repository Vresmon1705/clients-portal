import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-purchase-status',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    RouterLinkWithHref
  ],
  templateUrl: './purchase-status.component.html',
  styleUrl: './purchase-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseStatusComponent { 

  orders: any[] = [];
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'status-pending';
      case 'enviado':
        return 'status-shipped';
      case 'entregado':
        return 'status-delivered';
      case 'cancelado':
        return 'status-canceled';
      default:
        return '';
    }
  }
  
  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'fas fa-hourglass-half'; // Icono para pendiente
      case 'enviado':
        return 'fas fa-truck'; // Icono para enviado
      case 'entregado':
        return 'fas fa-check-circle'; // Icono para entregado
      case 'cancelado':
        return 'fas fa-times-circle'; // Icono para cancelado
      default:
        return '';
    }
  }
  
  
}
