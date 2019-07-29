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
        },
        error => {
          console.log(error);
        });
  }
}

enum AuthComponentMode {
  SignUp,
  Login
}
