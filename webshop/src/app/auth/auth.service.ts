import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {User} from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

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
  private tokenExpirationTimer: number;

  constructor(private http: HttpClient,
              private router: Router,
              private store: Store<fromApp.AppState>) {
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
      this.store.dispatch(new AuthActions.AuthenticateSuccess({
        email: loadedUser.email,
        userId: loadedUser.id,
        token: loadedUser.token,
        expirationDate
      }));
      const expiresInMillis = new Date(expirationDate).getTime() - new Date().getTime();
      this.autoSignOut(expiresInMillis);
    }
  }

  signOut() {
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

}
