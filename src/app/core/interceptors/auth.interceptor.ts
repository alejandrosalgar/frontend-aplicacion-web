import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthTokenService } from '../auth-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthTokenService).getToken();
  if (!token) {
    return next(req);
  }
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(authReq);
};
