import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Especie } from "../models/especie.model"

@Injectable({
  providedIn: "root",
})
export class EspecieService {
  private apiUrl = "http://localhost:8080/especies"

  constructor(private http: HttpClient) {}

  listar(): Observable<Especie[]> {
    return this.http.get<Especie[]>(this.apiUrl)
  }

  buscarPorId(id: number): Observable<Especie> {
    return this.http.get<Especie>(`${this.apiUrl}/${id}`)
  }

  salvar(especie: Especie): Observable<Especie> {
    return this.http.post<Especie>(`${this.apiUrl}/adicionar`, especie)
  }

  atualizar(id: number, especie: Especie): Observable<Especie> {
    return this.http.put<Especie>(`${this.apiUrl}/editar/${id}`, especie)
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletar/${id}`)
  }
}
