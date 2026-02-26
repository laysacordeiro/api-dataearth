import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Taxonomia } from "../models/taxonomia.model"

@Injectable({
  providedIn: "root",
})
export class TaxonomiaService {
  private apiUrl = "http://localhost:8080/taxonomias"

  constructor(private http: HttpClient) {}

  buscarPorId(id: number): Observable<Taxonomia> {
    return this.http.get<Taxonomia>(`${this.apiUrl}/${id}`)
  }

  atualizar(id: number, taxonomia: Taxonomia): Observable<Taxonomia> {
    return this.http.put<Taxonomia>(`${this.apiUrl}/editar/${id}`, taxonomia)
  }
  listar(): Observable<Taxonomia[]> {
    return this.http.get<Taxonomia[]>(this.apiUrl)
  }

  filtrarPorNivel(nivel: string): Observable<Taxonomia[]> {
    return this.http.get<Taxonomia[]>(`${this.apiUrl}/nivel/${nivel}`)
  }

  salvar(taxonomia: Taxonomia): Observable<Taxonomia> {
    return this.http.post<Taxonomia>(`${this.apiUrl}/adicionar`, taxonomia)
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletar/${id}`)
  }
}
