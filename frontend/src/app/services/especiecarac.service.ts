import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Especie {
  id?: number;
  nome?: string;
}

export interface Carac {
  id?: number;
  caracteristica?: string;
}

export interface EspecieCarac {
  id?: number;
  valorCarac: string;
  especie: Especie;
  carac: Carac;
}

@Injectable({ providedIn: 'root' })
export class EspecieCaracService {
  private apiUrl = 'http://localhost:8080/api/caracteristica';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<EspecieCarac[]> {
    return this.http.get<EspecieCarac[]>(this.apiUrl);
  }

  listarPorEspecie(idEspecie: number): Observable<EspecieCarac[]> {
    return this.http.get<EspecieCarac[]>(`${this.apiUrl}/filtrar-por-especie/${idEspecie}`);
  }
  associar(especieId: number, caracId: number, valorCarac: string): Observable<EspecieCarac> {
    const payload = {
      especie: { id: especieId },
      carac: { id: caracId },
      valorCarac
    };
    return this.http.post<EspecieCarac>(`${this.apiUrl}/adicionar`, payload);
  }
}
