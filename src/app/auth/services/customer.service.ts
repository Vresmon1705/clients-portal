import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = `${environment.baseUrlCustomers}`;

  constructor(private http: HttpClient) {}

  getCustomerByTaxId(taxIdentificationNumber: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}?taxIdentificationNumber=${taxIdentificationNumber}&fields=name,address`);
  }

}
