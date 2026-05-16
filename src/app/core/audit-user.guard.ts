import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuditContextService } from './audit-context.service';
import { AuthService } from './auth.service';

export const auditUserGuard: CanActivateFn = () => {
  const audit = inject(AuditContextService);
  const auth = inject(AuthService);
  const router = inject(Router);
  if (audit.hasUsuario() && auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};