import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { MonolitoService } from '../../../services/monolito.service';
import { Monolito } from '../../../models/monolito.model';
import { Tombo } from '../../../models/tombo.model';

@Component({
  selector: 'app-form-visualizar-monolito',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './form-visualizar-monolito.component.html',
  styleUrls: ['./form-visualizar-monolito.component.scss']
})
export class FormVisualizarMonolitoComponent implements OnInit {

  monolito?: Monolito;
  tombos: Tombo[] = [];
  carregando = true;

  secoesAbertas: Record<string, boolean> = {
    dados: true,
    especies: true
  };

  constructor(
    private monolitoService: MonolitoService,
    public dialogRef: MatDialogRef<FormVisualizarMonolitoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;

    forkJoin({
      monolito: this.monolitoService.buscarPorId(this.data.id),
      tombos: this.monolitoService.listarTombos(this.data.id).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ monolito, tombos }) => {
        this.monolito = monolito;
        this.tombos = tombos;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  toggleSecao(secao: string): void {
    this.secoesAbertas[secao] = !this.secoesAbertas[secao];
  }

  formatarData(m: Monolito): string {
    if (!m?.dia || !m?.mes || !m?.ano) return '-';
    const dia = String(m.dia).padStart(2, '0');
    const mes = String(m.mes).padStart(2, '0');
    return `${dia}/${mes}/${m.ano}`;
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
