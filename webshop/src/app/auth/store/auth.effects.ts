import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {SignInResponseData} from '../auth.service';
import * as AuthActions from './auth.actions';

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
        map(respData => {
          const expiresInMillis = parseInt(respData.expiresIn, 10) * 1000;
          const expirationDate = new Date(new Date().getTime() + expiresInMillis);
          return new AuthActions.LoginSuccess({
            email: respData.email,
            userId: respData.localId,
            token: respData.idToken,
            expirationDate
          });
        }),
        catchError(error => of())
      );
    })
  );

  constructor(private actions$: Actions,
              private http: HttpClient) {
  }
}
