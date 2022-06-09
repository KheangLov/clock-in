import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from 'src/app/services/user.service';
import { passwordMatchingValidatior } from '../../../validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  hide = true;
  registerForm = this._registerFormBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
  }, { validators: passwordMatchingValidatior });

  constructor(
    private _registerFormBuilder: FormBuilder,
    private _userService: UserService,
    private _alertBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  get registerFormData() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if(!this.registerForm.valid) {
      this._alertBar.open('Invalid data!', 'Close', {
        duration: 3000,
        panelClass: ['error-message']
      });
      return;
    }

    this._userService.registerService(this.registerForm.value).subscribe(
      ({ message, success }) => {
        success && this._alertBar.open(message, 'Close', {
          duration: 3000,
        });
      },
      ({ error: { message, errors } }) => {
        message && this._alertBar.open(message, 'Close', {
          duration: 3000,
          panelClass: ['error-message']
        });
        Object.keys(errors)
          .forEach((val: string) => {
            switch (val) {
              case 'name':
                this.registerForm.controls.name.setErrors({
                  server: errors[val][0]
                });
                break;
              case 'email':
                this.registerForm.controls.email.setErrors({
                  server: errors[val][0]
                });
                break;
              case 'password':
                this.registerForm.controls.password.setErrors({
                  server: errors[val][0]
                });
                break;
            }
          });
      }
    );
  }

}
