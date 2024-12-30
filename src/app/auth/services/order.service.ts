import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { IOrder } from '../interfaces/order';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.baseUrlOrders}`;
  private selectedAddressSubject = new BehaviorSubject<string | null>(null);
  selectedAddress$ = this.selectedAddressSubject.asObservable();
  private partySiteNumberSubject = new BehaviorSubject<string | null>(null);
  partySiteNumber$ = this.partySiteNumberSubject.asObservable();

  constructor(private http: HttpClient) { }

  createOrder(orderPayload: IOrder): Observable<IOrder> {
    console.log('Sending order payload to:', `${this.apiUrl}/create`);
    console.log('Order payload:', orderPayload);

    return this.http.post<IOrder>(`${this.apiUrl}/create`, orderPayload).pipe(
      catchError((err) => {
        console.error('Error al crear la orden:', err);
        return throwError(() => err);
      })
    );
  }  

  setSelectedAddress(address: string, partySiteNumber: string): void {
    this.selectedAddressSubject.next(address);
    this.partySiteNumberSubject.next(partySiteNumber);
  }
}

