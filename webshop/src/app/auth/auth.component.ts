import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private AuthComponentModes = AuthComponentMode;
  private mode = AuthComponentMode.Login;
  private isLoading = false;

  constructor(private authService: AuthService) {
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
    if (this.mode === AuthComponentMode.SignUp) {
      this.signUp(email, password);
    }
    form.reset();
  }

  signUp(email: string, password: string) {
    this.authService
      .signUp(email, password)
      .subscribe(respData => {
          console.log(respData);
          this.isLoading = false;
        },
        error => {
          console.log(error);
          this.isLoading = false;
        });
  }
}

enum AuthComponentMode {
  SignUp,
  Login
}
