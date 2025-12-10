import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Taxonomia } from '../models/taxonomia.model';

@Injectable({
  providedIn: 'root'
})
export class TaxonomiaService {
  private baseUrl = 'http://localhost:8080/taxonomias';

  constructor(private http: HttpClient) { }

  atualizarTaxonomia(id: number, taxonomia: Partial<Taxonomia>): Observable<Taxonomia> {
    return this.http.put<Taxonomia>(`${this.baseUrl}/editar/${id}`, taxonomia, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
