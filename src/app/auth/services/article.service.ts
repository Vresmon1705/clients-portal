import { Injectable } from '@angular/core';
import { IArticle } from '../interfaces/article';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = `${environment.baseUrlArticles}`;

  constructor(private http: HttpClient) { }

  searchArticlesByDescription(description: string, accountNumber: string): Observable<IArticle[]> {
    const params = new HttpParams()
      .set('description', description)
      .set('accountNumber', accountNumber) 
      .set('limit', '7834');
  
    return this.http.get<{ data: IArticle[] }>(`${this.apiUrl}`, { params }).pipe(
      map(response => response.data.filter(article => !article.description.startsWith('QB')))
    );
  }  
  
  getProductById(id: string): Observable<IArticle> {
    return this.http.get<IArticle>(`${this.apiUrl}/${id}`);
  }

  getAllArticles(): Observable<IArticle[]> {
    const params = new HttpParams().set('limit', '7834');
    return this.http.get<{ data: IArticle[] }>(`${this.apiUrl}`, { params }).pipe(
      map(response => response.data)
    );
  }

  getArticlesByCatPrice(catPrice: string): Observable<IArticle[]> {
    const params = new HttpParams().set('catPrice', catPrice);
    return this.http.get<{ data: IArticle[] }>(`${this.apiUrl}`, { params }).pipe(
      map(response => response.data.filter(article => !article.description.startsWith('QB')))
    );
  }


}
