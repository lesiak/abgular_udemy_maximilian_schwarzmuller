import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import * as AuthActions from './auth.actions';
import {Router} from '@angular/router';
import {User} from '../user.model';
import {AuthService} from '../auth.service';

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
        map(respData => this.handleAuthResponse(respData)),
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
          map(respData => this.handleAuthResponse(respData)),
          catchError(errorResp => of(new AuthActions.AuthenticateFail(this.getErrorMessage(errorResp))))
        );
      }
    )
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return {type: 'IgnoreAction'};
      }
      const expirationDate = new Date(userData._tokenExpirationDate);
      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        expirationDate
      );

      if (loadedUser.token) {
        const expiresInMillis = new Date(expirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expiresInMillis);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate,
          redirect: false
        });
      }
      return {type: 'IgnoreAction'};
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }

  private handleAuthResponse(respData: SignInResponseData | SignUpResponseData):
    AuthActions.AuthenticateSuccess {
    const expiresInMillis = parseInt(respData.expiresIn, 10) * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInMillis);
    const user = new User(respData.email, respData.localId, respData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.authService.setLogoutTimer(expiresInMillis);
    return new AuthActions.AuthenticateSuccess({
      email: respData.email,
      userId: respData.localId,
      token: respData.idToken,
      expirationDate,
      redirect: true
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
