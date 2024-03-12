import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL = environment.API_URL;
  API_LOGIN = '/api/v1/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.API_URL}${this.API_LOGIN}`, {
      email,
      password,
    });
  }
}
