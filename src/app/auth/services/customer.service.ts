import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { ICustomer } from '../interfaces/customer';
import { AuthStatus } from '../interfaces/auth.status.enum';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.baseUrlCustomers}`;

  private _currentUser = signal<ICustomer | null>(null);
  private _authStatus = signal(AuthStatus.checking);
  private _currentUserRole = signal(null);

  public currentUser = computed(() => this._currentUser());
  public authStatusRead = computed(() => this._authStatus());
  public currentUserRole = computed(() => this._currentUserRole());


  getCustomerByTaxId(taxIdentificationNumber: string): Observable<ICustomer[]> {
    const url = `${this.apiUrl}?taxIdentificationNumber=${taxIdentificationNumber}&fields=name,address,accountNumber,partySiteNumber`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          address: item.address,
          accountNumber: item.accountNumber,
          taxIdentificationNumber: item.taxIdentificationNumber,
          partySiteNumber: item.partySiteNumber
        })) as ICustomer[];
      }),
      catchError(err => {
        console.error('Error:', err);
        return throwError(() => err);
      })
    );
  }

  getAccountNumber(): string | null {
    const currentUser = this._currentUser();
    return currentUser && currentUser.accountNumber ? currentUser.accountNumber : null;
  }


}
