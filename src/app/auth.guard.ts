import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';

import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: UserService,
    private _router: Router,
    private _alertBar: MatSnackBar
  ) { }
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    if (this._authService.isLoggedIn !== true) {
      this._alertBar.open('Session timeout!', 'Close', {
        duration: 3000,
        panelClass: ['error-message']
      });
      this._router.navigate(['login']);
      return true;
    }

    this._authService
      .getCurrentUser()
      .subscribe(({ data: user }: any) => {
        if (user && user?.roles && !user?.roles.includes('admin')) {
          this._router.navigate(['clockin-out']);
        }
      });

    return true;
  }
}
