import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  roles: string[];
  isAdmin: boolean;
}

interface RegisterRequest {
  username: string;
  password: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  // 📝 REGISTRO (ADMIN)
  register(request: RegisterRequest): Observable<string> {
    const body = new URLSearchParams();
    body.set('username', request.username);
    body.set('password', request.password);

    request.roles.forEach(role => body.append('roles', role));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(
      `${this.API_URL}/register`,
      body.toString(),
      { headers, responseType: 'text' }
    );
  }

  // 👥 LISTAR USUÁRIOS
  listarTodos(): Observable<User[]> {
    return this.http.get<any[]>(`${this.API_URL}/usuarios`).pipe(
      map(response =>
        response.map(backendUser => {
          const roleNames = backendUser.roles.map((r: any) => r.name);

          return {
            id: backendUser.id,
            username: backendUser.username,
            roles: roleNames,
            isAdmin: roleNames.includes('ROLE_ADMIN')
          } as User;
        })
      )
    );
  }
}

