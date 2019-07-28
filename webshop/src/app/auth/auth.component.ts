import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private AuthComponentModes = AuthComponentMode;
  private mode = AuthComponentMode.Login;

  constructor() {
  }

  ngOnInit() {
  }

  onSwitchMode() {
    this.mode = (this.mode === AuthComponentMode.Login)
      ? AuthComponentMode.SignUp
      : AuthComponentMode.Login;
  }

  onSubmit(form: NgForm) {
    console.log(form.value)
    form.reset();
  }
}

enum AuthComponentMode {
  SignUp,
  Login
}
