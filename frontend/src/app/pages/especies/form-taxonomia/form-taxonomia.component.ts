import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EspecieService } from '../../../services/especie.service';
import { Especie } from '../../../models/especie.model';
import { Taxonomia } from '../../../models/taxonomia.model';

@Component({
  selector: 'app-form-taxonomia',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './form-taxonomia.component.html',
  styleUrls: ['./form-taxonomia.component.scss']
})
export class FormTaxonomiaComponent implements OnInit {
  
  especie?: Especie;
  taxonomia?: Partial<Taxonomia> | null = null;
  carregando = true;

  // lista pode conter taxonomias parciais
  listaTaxonomiaCompleta: Partial<Taxonomia>[] = [];

  constructor(
    private especieService: EspecieService,
    public dialogRef: MatDialogRef<FormTaxonomiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.carregando = true;

    this.especieService.buscarPorId(this.data.id).subscribe({
      next: (res) => {
        this.especie = res;
        
        this.taxonomia = res.taxonomia ?? null;

        this.listaTaxonomiaCompleta = this.getTaxonomiaCompleta(this.taxonomia);

        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao buscar espécie:', err);
        this.carregando = false;
      }
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  getTaxonomiaCompleta(
    tax?: Partial<Taxonomia> | null
  ): Partial<Taxonomia>[] {

    const lista: Partial<Taxonomia>[] = [];

    let atual: Partial<Taxonomia> | null = tax ?? null;

    while (atual) {
      lista.unshift(atual);

      const parent = atual.parent as Partial<Taxonomia> | null | undefined;

      atual = parent ?? null;
    }

    return lista;
  }

}
