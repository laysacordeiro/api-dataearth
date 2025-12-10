import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Carac {
  id?: number;
  caracteristica: string;
}

@Injectable({ providedIn: 'root' })
export class CaracService {
  private apiUrl = 'http://localhost:8080/api/caracs';

  constructor(private http: HttpClient) {}

  // GET - Buscar todas as características
  getCaracs(): Observable<Carac[]> {
    return this.http.get<Carac[]>(this.apiUrl);
  }

  // GET - Buscar por ID
  getCaracById(id: number): Observable<Carac> {
    return this.http.get<Carac>(`${this.apiUrl}/${id}`);
  }

  criarCarac(caracteristica: string): Observable<Carac> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Carac>(`${this.apiUrl}/criar`, { caracteristica }, { headers });
  }

  // PUT - Atualizar característica existente (/atualizar/{id})
  atualizarCarac(id: number, carac: Carac): Observable<Carac> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Carac>(`${this.apiUrl}/atualizar/${id}`, carac, { headers });
  }

  // DELETE - Deletar característica (/deletar/{id})
  deletarCarac(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletar/${id}`);
  }
}
