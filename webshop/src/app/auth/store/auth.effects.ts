import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {SignInResponseData, SignUpResponseData} from '../auth.service';
import * as AuthActions from './auth.actions';
import {Router} from '@angular/router';

@Injectable()
export class AuthEffects {

  private signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`;
  private signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`;

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<SignInResponseData>(
        this.signInUrl,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }).pipe(
        // using inner pipe to prevent authLogin observable from dying in case of error
        map(respData => this.authResponseToAuthenticateSuccessAction(respData)),
        catchError(errorResp => of(new AuthActions.AuthenticateFail(this.getErrorMessage(errorResp))))
      );
    })
  );

  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignUpStart) => {
        return this.http.post<SignUpResponseData>(
          this.signUpUrl,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }).pipe(
          // using inner pipe to prevent authLogin observable from dying in case of error
          map(respData => this.authResponseToAuthenticateSuccessAction(respData)),
          catchError(errorResp => of(new AuthActions.AuthenticateFail(this.getErrorMessage(errorResp))))
        );
      }
    )
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap(() => this.router.navigate(['/']))
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router) {
  }

  private authResponseToAuthenticateSuccessAction(respData: SignInResponseData | SignUpResponseData):
    AuthActions.AuthenticateSuccess {
    const expiresInMillis = parseInt(respData.expiresIn, 10) * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInMillis);
    return new AuthActions.AuthenticateSuccess({
      email: respData.email,
      userId: respData.localId,
      token: respData.idToken,
      expirationDate
    });
  }

  private getErrorMessage(errorResp: HttpErrorResponse): string {
    let errorMessage = 'An unknown error occurred';
    if (!errorResp.error || !errorResp.error.error) {
      return errorMessage;
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
    return errorMessage;
  }
}
