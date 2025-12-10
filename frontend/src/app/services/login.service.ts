import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  login(email: string, password: string): Observable<string> {
  return this.httpClient.post<string>(
  `${this.apiUrl}/login`,
  { email, password },
  { responseType: 'text' as 'json' }
);
  }
}

