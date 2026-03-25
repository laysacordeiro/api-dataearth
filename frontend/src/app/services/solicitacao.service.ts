import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../models/solicitacao.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {

  private readonly API_URL = 'http://localhost:8080/admin/solicitacoes';

  constructor(private http: HttpClient) { }

  listarPendentes(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.API_URL);
  }

  listarTodas(): Observable<Solicitacao[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map(response =>
        response.map(item => {

          let role = item.requestedRole;
          if (role && typeof role === 'object' && role.name) {
            role = role.name;
          }

          return {
            id: item.id,
            user: {
              id: item.user?.id,
              username: item.user?.username
            },
            requestedRole: role,
            status: item.status,
            createdAt: item.createdAt
          } as Solicitacao;
        })
      )
    );
  }

  aceitar(id: number): Observable<string> {
    return this.http.put(`${this.API_URL}/${id}/aceitar`, {}, { responseType: 'text' });
  }

  negar(id: number): Observable<string> {
    return this.http.put(`${this.API_URL}/${id}/negar`, {}, { responseType: 'text' });
  }
}
