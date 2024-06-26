import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';
import { ResponseLogin } from '@models/auth.model';
import { User } from '@models/user.model';
import { checkToken } from '@interceptors/token.interceptor';

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
  API_PROFILE = '/profile';
  API_REFRESH_TOKEN = '/refresh-token';

  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string) {
    return this.http
      .post<ResponseLogin>(`${this.API_URL}${this.API_LOGIN}`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.access_token);
          this.tokenService.saveRefreshToken(response.refresh_token);
        })
      );
  }

  refreshToken(refreshToken: string) {
    return this.http
      .post<ResponseLogin>(`${this.API_URL}${this.API_REFRESH_TOKEN}`, {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.access_token);
          this.tokenService.saveRefreshToken(response.refresh_token);
        })
      );
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

  logout() {
    this.tokenService.removeToken();
  }

  getProfile() {
    return this.http
      .get<User>(`${this.API_URL}${this.API_PROFILE}`, {
        context: checkToken(),
      })
      .pipe(
        tap((user) => {
          this.user$.next(user);
        })
      );
  }
}
