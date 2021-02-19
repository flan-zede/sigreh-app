import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { LoginInterface, AuthResponseInterface } from '../shared/interface/app.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) { }

  setCredential(data: AuthResponseInterface): void {
      localStorage.setItem('credential', JSON.stringify(data));
  }

  getCredential(): AuthResponseInterface {
      return JSON.parse(localStorage.getItem('credential'));
  }

  login(data: LoginInterface): Observable<any> {
    return this.http.post<AuthResponseInterface>(`${environment.api}/user/login`, data).pipe(tap(
      res => this.setCredential(res)
    ));
  }

  logout(): void {
      localStorage.clear();
  }

  getAuthUser(): Observable<any> {
    return this.http.get(`${environment.api}/user/me`);
  }

}
