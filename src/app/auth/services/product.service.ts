import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {  
  private apiUrl = `${environment.baseUrlArticles}`;

  constructor(private http: HttpClient) {}

  searchProductsByDescription(description: string): Observable<Product[]> {
    const params = new HttpParams().set('description', description);
    return this.http.get<Product[]>(`${this.apiUrl}`, { params });
  }
}
