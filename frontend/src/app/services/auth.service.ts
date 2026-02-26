import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // 1. Importar HttpClient
import { Observable, of } from 'rxjs'; // 2. Importar Observable e of

export interface Usuario { 
  id: number;
  fullName: string; // Nome está vindo como 'fullName' do backend, não 'nome'
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    // ⚠️ ATENÇÃO: Corrigindo o apiUrl para o endpoint base da sua API
    private apiUrl = 'http://localhost:8080/api/auth'; 

    private readonly TOKEN_KEY = 'auth-token';
    private readonly USERNAME_KEY = 'username';
    private readonly EMAIL_KEY = 'user-email';

    constructor(private http: HttpClient) {}

    // ✅ CORREÇÃO: Fazendo a chamada HTTP real para o endpoint /users
    listarTodos(): Observable<Usuario[]> {
        // O endpoint completo é: http://localhost:8080/api/auth/users
        return this.http.get<Usuario[]>(`${this.apiUrl}/users`);
    }

    setToken(token: string) {
        sessionStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    setUsername(username: string) {
        sessionStorage.setItem(this.USERNAME_KEY, username);
    }

    getUsername(): string | null {
        return sessionStorage.getItem(this.USERNAME_KEY);
    }

    setUserEmail(email: string) {
        sessionStorage.setItem(this.EMAIL_KEY, email);
    }

    getUserEmail(): string | null {
        return sessionStorage.getItem(this.EMAIL_KEY);
    }

    logout() {
        sessionStorage.clear();
    }
}