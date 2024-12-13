import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { HelpComponent } from '../../../shared/help/help.component';
import { Customer } from '../../../auth/interfaces/customer';
import { CustomerService } from '../../../auth/services/customer.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStatus } from '../../../auth/interfaces/auth.status.enum';

@Component({
  selector: 'app-update-data',
  standalone: true,
  imports: [
  ],
  templateUrl: './update-data.component.html',
  styleUrl: './update-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateDataComponent {
  
  customer: Customer | null = null;
  taxId: string | null = null;

  constructor(
    private customerService: CustomerService,    
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {  }

  ngOnInit(): void {
    const authStatus = this.authService.authStatusRead();
  
    if (authStatus === AuthStatus.authenticated) {
      const currentUser = this.authService.currentUser();
      this.taxId = currentUser?.taxIdentificationNumber ?? null;
  
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
          if (this.taxId) {
            this.fetchCustomerData();
          }
        } else {
          console.error('Usuario no autenticado.');
        }
      });
    }
  }  

  private fetchCustomerData(): void {
    if (this.taxId) {
      this.customerService.getCustomerByTaxId(this.taxId).subscribe(
        (data: Customer[]) => {
          if (data.length > 0) {
            this.customer = data[0];
            this.cdr.markForCheck();
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
}
