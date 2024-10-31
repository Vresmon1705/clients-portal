import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLinkWithHref, RouterModule } from '@angular/router';
import { HelpComponent } from '../../../shared/help/help.component';

@Component({
  selector: 'app-purchase-status',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    HelpComponent,
    RouterModule
  ],
  templateUrl: './purchase-status.component.html',
  styleUrl: './purchase-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseStatusComponent { 

}
