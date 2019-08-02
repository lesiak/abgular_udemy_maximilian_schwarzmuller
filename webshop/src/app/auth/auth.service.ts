import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {User} from './user.model';
import {Router} from '@angular/router';

export interface SignUpResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface SignInResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  private signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`;
  private signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`;
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: number;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  signUp(email: string, password: string): Observable<SignUpResponseData> {
    return this.http.post<SignUpResponseData>(
      this.signUpUrl,
      {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(respData => this.handleAuthentication(respData))
      );
  }

  signIn(email: string, password: string): Observable<SignInResponseData> {
    return this.http.post<SignInResponseData>(
      this.signInUrl,
      {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(respData => this.handleAuthentication(respData))
      );
  }

  autoSignIn() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const expirationDate = new Date(userData._tokenExpirationDate);
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      expirationDate
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expiresInMillis = new Date(expirationDate).getTime() - new Date().getTime();
      this.autoSignOut(expiresInMillis);
    }
  }

  signOut() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  autoSignOut(expirationDurationMillis: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.signOut();
    }, expirationDurationMillis);
  }

  private handleAuthentication(respData: SignUpResponseData | SignInResponseData) {
    const expiresInMillis = parseInt(respData.expiresIn, 10) * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInMillis);
    const user = new User(
      respData.email,
      respData.localId,
      respData.idToken,
      expirationDate
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoSignOut(expiresInMillis);
  }

  private handleError(errorResp: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (!errorResp.error || !errorResp.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResp.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;
      case 'INVALID_EMAIL':
        errorMessage = 'This email is invalid';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email is not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password';
        break;
    }
    return throwError(errorMessage);
  }
}
