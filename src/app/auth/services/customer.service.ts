import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ICustomer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.baseUrlCustomers}`;

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


}
