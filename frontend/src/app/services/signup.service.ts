import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SignupResponse {
  message: string;
  userId?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private apiUrl = 'http://localhost:8080/api/auth/signup';

  constructor(private httpClient: HttpClient) { }

  signup(name: string, email: string, password: string): Observable<string> {
    return this.httpClient.post(this.apiUrl, {
      fullName: name,
      email,
      password
    }, { responseType: 'text' }); 
  }
}
