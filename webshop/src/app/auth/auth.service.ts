import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';

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
      .pipe(catchError(errorResp => {
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
        }
        return throwError(errorMessage);
      }));
  }

  signIn(email: string, password: string): Observable<SignInResponseData> {
    return this.http.post<SignInResponseData>(
      this.signInUrl,
      {
        email,
        password,
        returnSecureToken: true
      });
  }
}
