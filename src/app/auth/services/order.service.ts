import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IOrder } from '../interfaces/order-create';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { IOrderSummary } from '../interfaces/order-summary';
import { PaginatedResponse } from '../interfaces/PaginatedResponse';
import { IOrderDetails } from '../interfaces/order-details';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.baseUrlOrders}`;
  private selectedAddressSubject = new BehaviorSubject<string | null>(null);
  selectedAddress$ = this.selectedAddressSubject.asObservable();
  private partySiteNumberSubject = new BehaviorSubject<string | null>(null);
  partySiteNumber$ = this.partySiteNumberSubject.asObservable();

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }

  createOrder(orderPayload: IOrder): Observable<IOrder> {
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

  getOrdersByAuthor(taxIdentificationNumber: string, limit: number, offset: number): Observable<PaginatedResponse<IOrderSummary>> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get<PaginatedResponse<IOrderSummary>>(`${this.apiUrl}/${taxIdentificationNumber}`, { params }).pipe(
      map(response => response),
      catchError((err) => {
        console.error('Error al obtener las órdenes:', err);
        return throwError(() => err);
      })
    );
  }

  getOrderDetails(internalOrderNumber: string, limit: number, offset: number): Observable<any> {
    const params = new HttpParams()
    .set('limit', limit.toString())
    .set('offset', offset.toString());

    return this.http.get<PaginatedResponse<IOrderDetails>>(`${this.apiUrl}/${internalOrderNumber}/details`, { params }).pipe(
      map((resp: PaginatedResponse<IOrderDetails>) => resp),
      catchError(err => {
        console.error("Error al obtener los detalles de la orden:", err);
        return throwError(() => err);
      })
    );
  }
}

