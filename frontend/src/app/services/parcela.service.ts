import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcela } from '../models/parcela.model';
import { Monolito } from '../models/monolito.model';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {
  private apiUrl = 'http://localhost:8080/parcelas';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Parcela[]> {
    return this.http.get<Parcela[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Parcela> {
    return this.http.get<Parcela>(`${this.apiUrl}/${id}`);
  }

  criar(parcela: Parcela, monolitoIds?: number[]): Observable<Parcela> {
    let params = new HttpParams();
    if (monolitoIds && monolitoIds.length > 0) {
      monolitoIds.forEach(id => {
        params = params.append('monolitoIds', id.toString());
      });
    }
    return this.http.post<Parcela>(this.apiUrl, parcela, { params });
  }

  listarMonolitos(parcelaId: number): Observable<Monolito[]> {
    return this.http.get<Monolito[]>(`${this.apiUrl}/${parcelaId}/monolitos`);
  }

  atualizar(id: number, parcela: Parcela): Observable<Parcela> {
    return this.http.put<Parcela>(`${this.apiUrl}/${id}`, parcela);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
