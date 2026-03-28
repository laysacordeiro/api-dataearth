import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ParcelaService } from '../../../services/parcela.service';
import { MonolitoService } from '../../../services/monolito.service';
import { Parcela } from '../../../models/parcela.model';
import { Monolito } from '../../../models/monolito.model';
import { Tombo } from '../../../models/tombo.model';

export interface MonolitoComEspecies {
  monolito: Monolito;
  tombos: Tombo[];
}

@Component({
  selector: 'app-form-visualizar-parcela',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './form-visualizar-parcela.component.html',
  styleUrls: ['./form-visualizar-parcela.component.scss']
})
export class FormVisualizarParcelaComponent implements OnInit {

  parcela?: Parcela;
  monolitosComEspecies: MonolitoComEspecies[] = [];
  carregando = true;

  secoesAbertas: Record<string, boolean> = {
    dados: true,
    localidade: false,
    clima: false,
    ambiente: false,
    monolitos: true
  };

  // Track per-monolito section open/close
  monolitoAberto: Record<number, boolean> = {};

  constructor(
    private parcelaService: ParcelaService,
    private monolitoService: MonolitoService,
    public dialogRef: MatDialogRef<FormVisualizarParcelaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;

    this.parcelaService.buscarPorId(this.data.id).pipe(
      switchMap((parcela) => {
        this.parcela = parcela;

        // Always fetch monolitos from the dedicated endpoint for reliability
        return this.parcelaService.listarMonolitos(this.data.id).pipe(
          catchError(() => of([])),
          switchMap((monolitos: Monolito[]) => {
            if (monolitos.length === 0) {
              this.monolitosComEspecies = [];
              return of(null);
            }

            // Initialize open/closed state
            monolitos.forEach((m, i) => {
              if (m.id != null) this.monolitoAberto[m.id] = i === 0;
            });

            const tombosCalls = monolitos.map(m =>
              this.monolitoService.listarTombos(m.id!).pipe(catchError(() => of([])))
            );

            return forkJoin(tombosCalls).pipe(
              switchMap((tombosLists) => {
                this.monolitosComEspecies = monolitos.map((m, i) => ({
                  monolito: m,
                  tombos: tombosLists[i] as Tombo[]
                }));
                return of(null);
              })
            );
          })
        );
      }),
      catchError(() => of(null))
    ).subscribe(() => {
      this.carregando = false;
    });
  }

  toggleSecao(secao: string): void {
    this.secoesAbertas[secao] = !this.secoesAbertas[secao];
  }

  toggleMonolito(id: number): void {
    this.monolitoAberto[id] = !this.monolitoAberto[id];
  }

  formatarData(dataStr?: string): string {
    if (!dataStr) return '-';
    const parts = dataStr.split('-');
    if (parts.length >= 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dataStr;
  }

  formatarDataMonolito(m: Monolito): string {
    if (!m?.dia || !m?.mes || !m?.ano) return '-';
    const dia = String(m.dia).padStart(2, '0');
    const mes = String(m.mes).padStart(2, '0');
    return `${dia}/${mes}/${m.ano}`;
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
