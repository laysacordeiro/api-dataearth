import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'auth-token';

  constructor(private http: HttpClient) {}

  // 🔐 LOGIN
  login(request: LoginRequest): Observable<{ token: string }> {
    const body = new URLSearchParams();
    body.set('username', request.username);
    body.set('password', request.password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<{ token: string }>(
      `${this.API_URL}/login`,
      body.toString(),
      { headers }
    );
  }


  // 💾 TOKEN
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ✅ STATUS
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 🔍 JWT PAYLOAD
  private getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  // 👤 USUÁRIO
  getUsername(): string | null {
    const payload = this.getPayload();
    return payload?.sub || payload?.username || null;
  }

  // 🛂 ROLES
  hasRole(role: string): boolean {
    const payload = this.getPayload();
    if (!payload) return false;

    const roles: string[] =
      payload.roles ||
      payload.authorities ||
      [];

    return roles.includes(role) || roles.includes(role.replace('ROLE_', ''));
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isResearcher(): boolean {
    return this.hasRole('ROLE_RESC');
  }
}

