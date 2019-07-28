import {Component, OnInit} from '@angular/core';

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

}

enum AuthComponentMode {
  SignUp,
  Login
}
