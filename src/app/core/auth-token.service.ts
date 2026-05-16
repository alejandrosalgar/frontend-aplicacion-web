import { Injectable } from '@angular/core';

const TOKEN_STORAGE_KEY = 'api_access_token';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
