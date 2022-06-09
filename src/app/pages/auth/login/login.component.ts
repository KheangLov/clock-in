import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  loginForm = this._loginFormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private _loginFormBuilder: FormBuilder,
    private _userService: UserService,
    private _alertBar: MatSnackBar,
    private _router: Router
  ) { }

  get loginFormData() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(!this.loginForm.valid) {
      this._alertBar.open('Invalid data!', 'Close', {
        duration: 3000,
        panelClass: ['error-message']
      });
      return;
    }

    this._userService.loginService(this.loginForm.value).subscribe(
      ({ message, success, data: { token: { access_token } } }) => {
        success && this._alertBar.open(message, 'Close', {
          duration: 3000,
        });
        localStorage.setItem('access_token', access_token);
        this._router.navigate(['dashboard']);
      },
      ({ error: { message, errors } }) => {
        message && this._alertBar.open(message, 'Close', {
          duration: 3000,
          panelClass: ['error-message']
        });
        Object.keys(errors)
          .forEach((val: string) => {
            switch (val) {
              case 'email':
                this.loginForm.controls.email.setErrors({
                  server: errors[val][0]
                });
                break;
              case 'password':
                this.loginForm.controls.password.setErrors({
                  server: errors[val][0]
                });
                break;
            }
          });
      }
    );
  }

}
