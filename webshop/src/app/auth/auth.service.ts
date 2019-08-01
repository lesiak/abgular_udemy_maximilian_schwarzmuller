import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {User} from './user.model';

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
  user = new Subject<User>();

  constructor(private http: HttpClient) {
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

  private handleAuthentication(respData: SignUpResponseData | SignInResponseData) {
    const expirationDate = new Date(new Date().getTime() + parseInt(respData.expiresIn, 10) * 1000);
    const user = new User(
      respData.email,
      respData.localId,
      respData.idToken,
      expirationDate
    );
    this.user.next(user);
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
