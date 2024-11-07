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

  constructor(private http: HttpClient) {}

  searchArticlesByDescription(description: string): Observable<IArticle[]> {
    const params = new HttpParams().set('description', description);
    return this.http.get<{ data: IArticle[] }>(`${this.apiUrl}`, { params }).pipe(
      map(response => response.data)
    );
  }
}
