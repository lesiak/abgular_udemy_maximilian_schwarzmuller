import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService, SignInResponseData, SignUpResponseData} from './auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  private AuthComponentModes = AuthComponentMode;
  private mode = AuthComponentMode.Login;
  isLoading = false;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;


  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) {
  }

  onSwitchMode() {
    this.mode = (this.mode === AuthComponentMode.Login)
      ? AuthComponentMode.SignUp
      : AuthComponentMode.Login;
  }

  ngOnInit(): void {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      if (authState.authError) {
        this.showErrorAlert(authState.authError);
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    let authObs: Observable<SignUpResponseData | SignInResponseData>;
    if (this.mode === AuthComponentMode.SignUp) {
      authObs = this.authService.signUp(email, password);
    } else {
      this.store.dispatch(new AuthActions.LoginStart({email, password}));
    }



    // authObs.subscribe(respData => {
    //     console.log(respData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   errorMessage => {
    //     console.log(errorMessage);
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   });
    form.reset();
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const alertComponentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    alertComponentRef.instance.message = message;
    this.closeSub = alertComponentRef.instance.close.subscribe(
      () => {
        this.closeSub.unsubscribe();
        hostViewContainerRef.clear();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

}

enum AuthComponentMode {
  SignUp,
  Login
}
