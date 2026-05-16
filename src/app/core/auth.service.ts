import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthTokenService } from './auth-token.service';

interface LoginPayload {
  nombre_usuario: string;
  contraseña: string;
}

interface LoginData {
  id_usuario: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginUrl = `${environment.apiUrl}/usuarios/login`;

  constructor(
    private readonly http: HttpClient,
    private readonly token: AuthTokenService,
  ) {}

  login(nombre_usuario: string, contraseña: string): Observable<LoginData> {
    const payload: LoginPayload = { nombre_usuario, contraseña };
    return this.http.post<LoginData>(this.loginUrl, payload).pipe(
      tap((data) => this.token.setToken(data.access_token)),
    );
  }

  logout(): void {
    this.token.clearToken();
  }

  isAuthenticated(): boolean {
    return this.token.hasToken();
  }

  getToken(): string | null {
    return this.token.getToken();
  }
}
