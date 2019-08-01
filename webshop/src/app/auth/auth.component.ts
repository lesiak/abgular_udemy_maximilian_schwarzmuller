import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService, SignInResponseData, SignUpResponseData} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private AuthComponentModes = AuthComponentMode;
  private mode = AuthComponentMode.Login;
  private isLoading = false;
  private errorMessage: string;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onSwitchMode() {
    this.mode = (this.mode === AuthComponentMode.Login)
      ? AuthComponentMode.SignUp
      : AuthComponentMode.Login;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    this.errorMessage = null;
    const authObs: Observable<SignUpResponseData | SignInResponseData> = (this.mode === AuthComponentMode.SignUp)
      ? this.authService.signUp(email, password)
      : this.authService.signIn(email, password);

    authObs.subscribe(respData => {
        console.log(respData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.errorMessage = errorMessage;
        this.isLoading = false;
      });
    form.reset();
  }
}

enum AuthComponentMode {
  SignUp,
  Login
}
