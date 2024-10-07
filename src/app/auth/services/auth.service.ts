import { Injectable, computed, inject, signal, PLATFORM_ID, Inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth.status.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError, of, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
    this.checkAuthStatus().subscribe();
    }
  }
  
  private http = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrlAuth;
  private readonly tokenRol: string = environment.rolForToken;

  private _currentUser = signal(null);
  private _authStatus = signal(AuthStatus.checking);
  private _currentUserRole = signal(null);

  //VARIABLE QUE SE PUEDE LLAMAR EN CUALQUIERO OTRO COMPONENTE
  public currentUser = computed(() => this._currentUser());
  public authStatusRead = computed(() => this._authStatus());
  public currentUserRole = computed(() => this._currentUserRole());

  setAuthentication(email: any, token: any): boolean {

    this._currentUser.set(email);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }


  //PARA MANDARA ROLES EN EL MOMENTO DE HACER CHECK DEL ESTADO DE AUTENTICACION

  checkAuthStatus(): Observable<any> {

    const url = `${this.baseUrl}/testingToken`;
    let token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get(url, { headers })
      .pipe(
        switchMap((resp: any) => {
          this.setAuthentication(resp.user, token);
          return this.decodeAuth(token).pipe(
            map((response: any) => {
              this._currentUserRole.set(response.roles);
              return { response, resp };
            }),
            catchError(() => {
              this.logout();
              localStorage.removeItem('token');
              this._authStatus.set(AuthStatus.notAuthenticated);
              return of(false);
            })
          )
        })
      );
  }


  //PARA MANDAR ROLES DESDE EL MOMENTO DE HACER EL LOGUEO

  login(email: string, password: string, tokenMFA: string) {

    const url = tokenMFA === "000000" ? `${this.baseUrl}/login` : `${this.baseUrl}/loginMFA`;
    const body = tokenMFA === "000000" ? { email, password } : { email, password, tokenMFA };

    return this.http.post(url, body)
      .pipe(
        switchMap((response: any) => {
          this.setAuthentication(response.email, response.token);
          return this.decodeAuth(response.token).pipe(
            map((decodedResponse: any) => {
              this._currentUserRole.set(decodedResponse.roles);
              return { response, decodedResponse };
            }),
            catchError(err => {
              console.error("Error al decodificar el token:", err);
              return throwError(() => err);
            }))
        }),

        catchError(err => throwError(() => {
          return err
        }))
      );
  }

  decodeAuth(data: any) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.tokenRol}`);
    const url = `${this.baseUrl}/decodeAuth`;
    return this.http.post(url, { data }, { headers })
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

}
