import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DiscountPromptPayment } from '../interfaces/discount-prompt-payment';
import { PaginatedResponse } from '../interfaces/PaginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class PromptPaymentService {

  private apiUrl = `${environment.baseUrlPayment}`;

  constructor(private http: HttpClient) { }

  getPromptPayments(): Observable<PaginatedResponse<DiscountPromptPayment>> {
    return this.http.get<PaginatedResponse<DiscountPromptPayment>>(this.apiUrl).pipe(
      map(response => {
        if (response) {
          return response;
        } else {
          throw new Error('No prompt payment data available');
        }
      })
    );
  }
}
