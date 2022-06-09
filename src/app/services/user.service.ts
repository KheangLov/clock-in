import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { omit } from 'lodash';

import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IUser {
  id: number;
  name: string;
  email: string;
  is_disabled: boolean;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

const headers = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _apiUserUrl: string = `${environment.apiUrl}/users`;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _alertBar: MatSnackBar
  ) {}
  loginService(data: any): Observable<any> {
    return this._http.post(`${environment.apiUrl}/login`, data, headers);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  doLogout() {
    localStorage.removeItem('access_token');
    this._alertBar.open('Session timeout!', 'Close', {
      duration: 3000,
      panelClass: ['error-message']
    });
    this._router.navigate(['login']);
  }

  get isLoggedIn(): boolean {
    let authToken = this.getToken();
    return authToken !== null ? true : false;
  }

  getCurrentUser() {
    return this._http.get(`${environment.apiUrl}/current_user`);
  }

  registerService(data: any): Observable<any> {
    return this._http.post(`${environment.apiUrl}/register`, data, headers);
  }

  getUsers({ sort, order, page, perPage, search }: any): Observable<any> {
    return this._http.get(`${this._apiUserUrl}?sort=${sort}&order=${order}&page=${page}&per_page=${perPage}&search=${search ? search : ''}`);
  }

  updateUser(data: any): Observable<any> {
    return this._http.put(`${this._apiUserUrl}/${data.id}`, omit(data, ['id']), headers);
  }

}
