import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { TokenService } from './token.service';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  API_URL = `${environment.API_URL}/api/v1/`;
  API_USERS = 'users';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getUsers() {
    return this.http.get<User[]>(`${this.API_URL}${this.API_USERS}`,{
      headers: {
        Authorization: `Bearer ${this.tokenService.getToken()}`
      }
    });
  }
}
