import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ParcelaService } from '../../../services/parcela.service';
import { MonolitoService } from '../../../services/monolito.service';
import { Parcela } from '../../../models/parcela.model';
import { Monolito } from '../../../models/monolito.model';

@Component({
  selector: 'app-form-parcela',
  standalone: true,
  templateUrl: './form-painel-parcela.component.html',
  styleUrls: ['./form-painel-parcela.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ]
})
export class FormParcelaComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormParcelaComponent>);
  private data = inject<Parcela | null>(MAT_DIALOG_DATA);

  private parcelaService = inject(ParcelaService);
  private monolitoService = inject(MonolitoService);
  private snackBar = inject(MatSnackBar);

  formParcela!: FormGroup;
  monolitos: Monolito[] = [];

  saving = false;

  ngOnInit(): void {
    this.initForm();
    this.carregarMonolitos();

    if (this.data) {
      this.formParcela.patchValue(this.data);
    }
  }

  private initForm(): void {
    this.formParcela = this.fb.group({
      proprietario: ['', Validators.required],
      usoDaTerra: ['', Validators.required],
      dataDoEvento: ['', Validators.required],
      description: [''],
      monolitoId: [null],

      localidade: this.fb.group({
        locality: ['', Validators.required],
        county: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        continent: ['', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
        name_uc: ['', Validators.required],
        class_uc: ['', Validators.required]
      }),

      clima: this.fb.group({
        clima_koppen: ['', Validators.required],
        avg_temp: [null, [Validators.required, Validators.min(-100)]],
        avg_precip: [null, [Validators.required, Validators.min(0)]],
        description: ['', Validators.required]
      }),

      environment: this.fb.group({
        vegeType: ['', Validators.required],
        prepType: ['', Validators.required],
        soilType: ['', Validators.required],
        currentVege: ['', Validators.required],
        originalVege: ['', Validators.required],
        vegeAge: [null, [Validators.required, Validators.min(0)]],
        biome: ['', Validators.required]
      })
    });
  }

  carregarMonolitos(): void {
    this.monolitoService.listar().subscribe({
      next: (lista) => {
        this.monolitos = lista;
      },
      error: (err) => {
        console.error('Erro ao buscar monolitos para seleção', err);
      }
    });
  }

  salvarParcela(): void {
    if (this.formParcela.invalid) {
      this.formParcela.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios corretamente.', 'Fechar', { duration: 3000 });
      return;
    }

    this.saving = true;
    const formValue = this.formParcela.getRawValue();
    const monolitoId = formValue.monolitoId;

    // Remove monolitoId from the main model to map cleanly to backend Parcela model without it being inside body
    const payload: Parcela = {
      proprietario: formValue.proprietario,
      usoDaTerra: formValue.usoDaTerra,
      dataDoEvento: formValue.dataDoEvento,
      description: formValue.description,
      localidade: formValue.localidade,
      clima: formValue.clima,
      environment: formValue.environment
    };

    if (this.data?.id) {
      // Edit mode
      this.parcelaService.atualizar(this.data.id, payload).subscribe({
        next: () => {
          this.snackBar.open('Parcela atualizada com sucesso!', 'Fechar', { duration: 3000 });
          this.saving = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.saving = false;
          this.snackBar.open('Erro ao atualizar parcela: ' + err.message, 'Fechar', { duration: 3000 });
        }
      });
    } else {
      // Create mode
      this.parcelaService.criar(payload, monolitoId).subscribe({
        next: () => {
          this.snackBar.open('Parcela criada com sucesso!', 'Fechar', { duration: 3000 });
          this.saving = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.saving = false;
          this.snackBar.open('Erro ao salvar parcela: ' + err.message, 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  fechar(): void {
    this.dialogRef.close(false);
  }
}
