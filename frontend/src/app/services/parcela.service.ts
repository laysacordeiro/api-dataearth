import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcela } from '../models/parcela.model';

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

  criar(parcela: Parcela, monolitoId?: number): Observable<Parcela> {
    let url = this.apiUrl;
    if (monolitoId) {
      url += `?monolitoId=${monolitoId}`;
    }
    return this.http.post<Parcela>(url, parcela);
  }

  atualizar(id: number, parcela: Parcela): Observable<Parcela> {
    return this.http.put<Parcela>(`${this.apiUrl}/${id}`, parcela);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
