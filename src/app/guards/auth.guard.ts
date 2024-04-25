import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '@services/token.service';

export const AuthGuard: CanActivateFn = () => {
  const token: string | unknown = inject(TokenService).isTokenValid();  

  if (!token) {
    inject(Router).navigate(['/login']);
    return false;
  }

  return true;
};
