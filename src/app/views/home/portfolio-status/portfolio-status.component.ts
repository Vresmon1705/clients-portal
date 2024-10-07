import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-status',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './portfolio-status.component.html',
  styleUrl: './portfolio-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioStatusComponent { }
