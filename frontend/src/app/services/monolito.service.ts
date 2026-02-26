import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Monolito } from '../models/monolito.model';
import { Especie } from '../models/especie.model';

@Injectable({
  providedIn: 'root'
})
export class MonolitoService {
  private apiUrl = 'http://localhost:8080/monolito';

  constructor(private http: HttpClient) {}

  salvar(monolito: Monolito): Observable<Monolito> {
    return this.http.post<Monolito>(`${this.apiUrl}/adicionar`, monolito);
  }

  listar(): Observable<Monolito[]> {
    return this.http.get<Monolito[]>(`${this.apiUrl}/all`);
  }

  buscarPorCollector(collector: string): Observable<Monolito[]> {
    return this.http.get<Monolito[]>(`${this.apiUrl}/buscar/collector`, {
      params: { collector }
    });
  }

  buscarPorLocalizacao(localidade: string): Observable<Monolito[]> {
    return this.http.get<Monolito[]>(`${this.apiUrl}/buscar/localizacao`, {
      params: { localidade }
    });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletar/${id}`);
  }

  adicionarEspecies(monolitoId: number, especiesIds: number[]): Observable<Monolito> {
    return this.http.post<Monolito>(`${this.apiUrl}/especies/adicionar/${monolitoId}`, especiesIds);
  }

  listarEspecies(monolitoId: number): Observable<Especie[]> {
    return this.http.get<Especie[]>(`${this.apiUrl}/especies/${monolitoId}`);
  }

  removerEspecie(monolitoId: number, especieId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/especies/${monolitoId}/deletar`, {
      params: { especie: especieId }
    });
  }
}