import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Monolito } from '../models/monolito.model';
import { Tombo } from '../models/tombo.model';

@Injectable({
  providedIn: 'root'
})
export class MonolitoService {

  private apiUrl = 'http://localhost:8080/monolitos';

  constructor(private http: HttpClient) {}

  // --- METODOS DO MONOLITO ---

  salvar(monolito: Monolito): Observable<Monolito> {
    return this.http.post<Monolito>(this.apiUrl, monolito);
  }

  listar(): Observable<Monolito[]> {
    return this.http.get<Monolito[]>(this.apiUrl);
  }

  verificarIdentificadorExistente(identificador: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/tombos/verificar-identificador`,
      { params: { identificador } }
    );
  }

  verificarStationFieldNumber(stationFieldNumber: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/verificar`,
      { params: { stationFieldNumber } }
    );
  }

  buscarPorCollector(collector: string): Observable<Monolito[]> {
    const params = new HttpParams().set('collector', collector);
    return this.http.get<Monolito[]>(
      `${this.apiUrl}/collector`,
      { params }
    );
  }

  buscarTombosPorIdentificador(identificador: string): Observable<Tombo[]> {
    const params = new HttpParams().set('identificador', identificador);
    return this.http.get<Tombo[]>(
      `${this.apiUrl}/tombos/buscar`,
      { params }
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletar/${id}`);
  }

  adicionarEspecieComDados(
    monolitoId: number,
    especieId: number,
    abundancia: number,
    identificador: string
  ): Observable<void> {
    const url = `${this.apiUrl}/${monolitoId}/especies/${especieId}`;
    return this.http.post<void>(url, { abundancia, identificador });
  }

 /* listarTombos(monolitoId: number): Observable<Tombo[]> {
    return this.http.get<Tombo[]>(
      `${this.apiUrl}/${monolitoId}/tombos`
    );
  }*/

  removerTombo(tomboId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/tombos/${tomboId}`
    );
  }
}