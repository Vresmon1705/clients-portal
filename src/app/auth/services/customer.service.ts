import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = `${environment.baseUrlCustomers}`;

  constructor(private http: HttpClient) {}

  getCustomerByTaxId(taxIdentificationNumber: string): Observable<Customer[]> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}?taxIdentificationNumber=${taxIdentificationNumber}&fields=name,address`).pipe(
      map(response => response.data.map(item => ({
        id: item.id,
        name: item.name,
        address: item.address,
        city: item.city,
        state: item.state,
        country: item.country
      } as Customer)))
    );
  }

}
