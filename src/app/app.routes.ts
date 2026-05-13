import { Routes } from '@angular/router';

import { auditUserGuard } from './core/audit-user.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () => import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent),
      },
      {
        path: 'cuentas',
        loadComponent: () =>
          import('./features/cuenta/cuenta-list').then((m) => m.CuentaListComponent),
      },
      {
        path: 'tipos-cuenta',
        loadComponent: () =>
          import('./features/tipo-cuenta/tipo-cuenta-list').then((m) => m.TipoCuentaListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];