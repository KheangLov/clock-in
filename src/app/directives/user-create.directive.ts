import { FormBuilder, Validators } from '@angular/forms';
import { Directive } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { passwordMatchingValidatior } from '../validator';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[appUserCreate]'
})
export class UserCreateDirective {

  hide = true;
  form = this._formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
  }, { validators: passwordMatchingValidatior });

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertBar: MatSnackBar
  ) {}

  get formData() {
    return this.form.controls;
  }

  onSubmit() {
    if(!this.form.valid) {
      this._alertBar.open('Invalid data!', 'Close', {
        duration: 3000,
        panelClass: ['error-message']
      });
      return;
    }

    this._userService.registerService(this.form.value).subscribe(
      ({ message, success }: any) => {
        success && this._alertBar.open(message, 'Close', {
          duration: 3000,
        });
      },
      ({ error: { message, errors } }: any) => {
        message && this._alertBar.open(message, 'Close', {
          duration: 3000,
          panelClass: ['error-message']
        });
        Object.keys(errors)
          .forEach((val: string) => {
            switch (val) {
              case 'name':
                this.form.controls.name.setErrors({
                  server: errors[val][0]
                });
                break;
              case 'email':
                this.form.controls.email.setErrors({
                  server: errors[val][0]
                });
                break;
              case 'password':
                this.form.controls.password.setErrors({
                  server: errors[val][0]
                });
                break;
            }
          });
      }
    );
  }

}
