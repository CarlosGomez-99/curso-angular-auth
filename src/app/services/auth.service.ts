import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL = `${environment.API_URL}/api/v1/auth`;
  API_LOGIN = '/login';
  API_REGISTER = '/register';
  API_IS_AVAILABLE_EMAIL = '/is-available';
  API_RECOVERY = '/recovery';
  API_CHANGE_PASSWORD = '/change-password';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.API_URL}${this.API_LOGIN}`, {
      email,
      password,
    });
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.API_URL}${this.API_REGISTER}`, {
      name,
      email,
      password,
    });
  }

  registerAndLogin(name: string, email: string, password: string) {
    return this.register(name, email, password).pipe(
      switchMap(() => this.login(email, password))
    );
  }

  isAvilableEmail(email: string) {
    return this.http.post<{ isAvailable: boolean }>(
      `${this.API_URL}${this.API_IS_AVAILABLE_EMAIL}`,
      {
        email,
      }
    );
  }

  recovery(email: string) {
    return this.http.post(`${this.API_URL}${this.API_RECOVERY}`, {
      email,
    });
  }

  changePassword(token: string, password: string) {
    return this.http.post(`${this.API_URL}${this.API_CHANGE_PASSWORD}`, {
      token: token,
      newPassword: password,
    });
  }
}
