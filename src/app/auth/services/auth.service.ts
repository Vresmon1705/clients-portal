import { Injectable, computed, inject, signal, PLATFORM_ID, Inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth.status.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError, of, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { isPlatformBrowser } from '@angular/common';
import { Customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAuthFromStorage();
    }
  }

  private http = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrlAuth;
  private readonly tokenRol: string = environment.rolForToken;

  private _currentUser = signal<Customer | null>(null);
  private _authStatus = signal(AuthStatus.checking);
  private _currentUserRole = signal(null);

  public currentUser = computed(() => this._currentUser());
  public authStatusRead = computed(() => this._authStatus());
  public currentUserRole = computed(() => this._currentUserRole());

  setAuthentication(taxIdentificationNumber: any, token: any, accountNumber: string): boolean {
    const user: Customer = {
      taxIdentificationNumber,
      accountNumber,
      id: '',
      lastSyncTime: 0,
      name: '',
      partySiteNumber: '',
      address: '',
      city: '',
      country: '',
      buyingPartyId: 0,
      billToPartyName: '',
      billToAccountNumber: '',
      billToAddress: '',
      billToCity: '',
      billToCountry: '',
      shipToPartyName: '',
      shipToAddress: '',
      shipToCity: '',
      shipToCountry: ''
    };
  
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }  
  
  private loadAuthFromStorage(): void {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    if (token && storedUser) {
      const parsedUser: Customer = JSON.parse(storedUser);
      this._currentUser.set(parsedUser);
      this._authStatus.set(AuthStatus.authenticated);
    } else {
      this.logout();
    }
  }  

  checkAuthStatus(): Observable<any> {
    const url = `${this.baseUrl}/testingTokenClient`;
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
          this.setAuthentication(resp.user, token, resp.accountNumber);
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

  login(userNit: string, password: string, tokenMFA: string): Observable<any> {
    const url  = tokenMFA === "000000" ? `${this.baseUrl}/loginClient` : `${this.baseUrl}/loginUserClientMFA`;
    const body = tokenMFA === "000000" ? { userNit, password } : { userNit, password, tokenMFA };
  
    return this.http.post(url, body).pipe(
      switchMap((response: any) => {
        this.setAuthentication(response.userNit, response.token, response.accountNumber);
        return this.decodeAuth(response.token).pipe(
          map((decodedResponse: any) => {
            this._currentUserRole.set(decodedResponse.roles);
            return { response, decodedResponse };
          }),
          catchError(err => {
            console.error("Error al decodificar el token:", err);
            return throwError(() => err);
          })
        );
      }),
      catchError(err => throwError(() => err))
    );
  }
  
  decodeAuth(data: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.tokenRol}`);
    const url = `${this.baseUrl}/decodeAuthClient`;
    return this.http.post(url, { data }, { headers });
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
