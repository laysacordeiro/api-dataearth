import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {

  private readonly API_URL = 'http://localhost:8080/admin/solicitacoes';

  constructor(private http: HttpClient) { }

  listarPendentes(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.API_URL);
  }

  aceitar(id: number): Observable<string> {
    return this.http.put(`${this.API_URL}/${id}/aceitar`, {}, { responseType: 'text' });
  }

  negar(id: number): Observable<string> {
    return this.http.put(`${this.API_URL}/${id}/negar`, {}, { responseType: 'text' });
  }
}
