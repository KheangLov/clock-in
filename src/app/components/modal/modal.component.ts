import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { pick } from 'lodash';

import { UserService } from 'src/app/services/user.service';
import { passwordMatchingValidatior } from '../../validator';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  hide = true;
  action: string = 'create';
  entity: string = '';
  form = this._formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
  }, { validators: passwordMatchingValidatior });
  infoForm = this._formBuilder.group({
    id: [''],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });
  passwordForm = this._formBuilder.group({
    id: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
  }, { validators: passwordMatchingValidatior })

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) {
    const { action, entity, row } = data;
    if (action === 'update') {
      this.infoForm.patchValue(pick(row, ['id', 'name', 'email']));
      this.passwordForm.patchValue(pick(row, ['id']));
    }
    this.action = action;
    this.entity = entity;
  }

  get formData() {
    return this.form.controls;
  }

  get infoFormData() {
    return this.infoForm.controls;
  }

  get passwordFormData() {
    return this.passwordForm.controls;
  }

  onSubmit() {
    if(!this.form.valid) {
      this._alertBar.open('Invalid data!', 'Close', {
        duration: 3000,
        panelClass: ['error-message']
      });
      return;
    }

    this._userService.registerService(this.form.value)
      .subscribe(
        ({ message, success, data }) => {
          success && this._alertBar.open(message, 'Close', {
            duration: 3000,
          });
          this.dialogRef.close({
            event: 'Cancel',
            data,
            action: this.action,
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

  onUpdateInfo() {
    if(!this.infoForm.valid) {
      this._alertBar.open('Invalid data!', 'Close', {
        duration: 3000,
        panelClass: ['error-message']
      });
      return;
    }

    this._userService.updateUser(this.infoForm.value)
      .subscribe(
        ({ message, success, data }) => {
          success && this._alertBar.open(message, 'Close', {
            duration: 3000,
          });
          this.dialogRef.close({
            event: 'Cancel',
            data,
            action: this.action,
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
                  this.form.controls.name.setErrors({
                    server: errors[val][0]
                  });
                  break;
                case 'email':
                  this.form.controls.email.setErrors({
                    server: errors[val][0]
                  });
                  break;
              }
            });
        }
      );
  }

  onUpdatePassword() {
    if(!this.passwordForm.valid) {
      this._alertBar.open('Invalid data!', 'Close', {
        duration: 3000,
        panelClass: ['error-message']
      });
      return;
    }

    this._userService.updateUser(this.passwordForm.value)
      .subscribe(
        ({ message, success, data }) => {
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
