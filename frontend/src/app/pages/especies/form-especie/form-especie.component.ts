import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  signal,
  inject
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { EspecieService } from '../../../services/especie.service';
import { TaxonomiaService } from '../../../services/taxonomia.service';
import { finalize } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Especie } from '../../../models/especie.model';
import { Taxonomia } from '../../../models/taxonomia.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type NivelKey = 'reino' | 'filo' | 'classe' | 'ordem' | 'familia' | 'genero';

@Component({
  selector: 'app-form-especie',
  standalone: true,
  templateUrl: './form-especie.component.html',
  styleUrls: ['./form-especie.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})

export class FormEspecieComponent implements OnInit, AfterViewInit {

  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private especieService = inject(EspecieService);
  private dialogRef = inject(MatDialogRef<FormEspecieComponent>);
  private data = inject<Especie | null>(MAT_DIALOG_DATA);
  private taxonomiaService = inject(TaxonomiaService);

  formEspecie!: FormGroup;
  isEditMode = signal(false);
  especieId?: number;
  carregando = true;
  saving = false;

  especie: Especie | null = null;

  reinos: Taxonomia[] = [];
  filos: Taxonomia[] = [];
  classes: Taxonomia[] = [];
  ordens: Taxonomia[] = [];
  familias: Taxonomia[] = [];
  generos: Taxonomia[] = [];

  mostrarInput: Record<NivelKey, boolean> = {
    reino: false,
    filo: false,
    classe: false,
    ordem: false,
    familia: false,
    genero: false
  };

  ngOnInit(): void {
    this.carregarTaxonomias();

    // ✔️ corrigido: nenhum nome é obrigatório
    this.formEspecie = this.fb.group({
      nome: ['', Validators.required],
      nomeCientifico: ['', Validators.required],
      ano: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      descricao: [''],

      reinoId: [''],
      reinoNome: [''],

      filoId: [''],
      filoNome: [''],

      classeId: [''],
      classeNome: [''],

      ordemId: [''],
      ordemNome: [''],

      familiaId: [''],
      familiaNome: [''],

      generoId: ['', Validators.required],
      generoNome: ['']
    });

    if (this.data) {
      this.isEditMode.set(true);
      this.especie = this.data;
      this.especieId = this.data.id;
      this.preencherFormularioParaEdicao(this.data);
    }

    this.carregando = false;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  onSelectChange(event: any, nivel: NivelKey) {
    const value = event.target.value;

    this.mostrarInput[nivel] = value === 'outro';

    if (value !== 'outro') {
      this.formEspecie.get(nivel + 'Nome')?.setValue('');
    }
  }

  carregarTaxonomias() {
    this.taxonomiaService.filtrarPorNivel('Reino').subscribe(r => this.reinos = r);
    this.taxonomiaService.filtrarPorNivel('Filo').subscribe(r => this.filos = r);
    this.taxonomiaService.filtrarPorNivel('Classe').subscribe(r => this.classes = r);
    this.taxonomiaService.filtrarPorNivel('Ordem').subscribe(r => this.ordens = r);
    this.taxonomiaService.filtrarPorNivel('Família').subscribe(r => this.familias = r);
    this.taxonomiaService.filtrarPorNivel('Gênero').subscribe(r => this.generos = r);
  }

  private criarTaxonomia(nivel: string, parentId: number | null, nome: string): Promise<Taxonomia> {
    return firstValueFrom(
      this.taxonomiaService.salvar({
        nome,
        nivel,
        parent: parentId ? { id: parentId } : null
      })
    );
  }

  async salvarEspecie() {
    this.formEspecie.markAllAsTouched();

    const f = this.formEspecie.value;

    // ✔️ Validação manual só quando for "outro"
    const niveis: NivelKey[] = ['reino', 'filo', 'classe', 'ordem', 'familia', 'genero'];

    for (const nivel of niveis) {
      const id = f[nivel + 'Id'];
      const nome = f[nivel + 'Nome'];

      if (id === 'outro' && (!nome || !nome.trim())) {
        alert(`Digite o nome do novo ${nivel}!`);
        return;
      }
    }

    if (this.formEspecie.invalid) return;

    let reinoId = f.reinoId;
    let filoId = f.filoId;
    let classeId = f.classeId;
    let ordemId = f.ordemId;
    let familiaId = f.familiaId;
    let generoId = f.generoId;

    if (reinoId === 'outro')
      reinoId = (await this.criarTaxonomia('Reino', null, f.reinoNome)).id;

    if (filoId === 'outro')
      filoId = (await this.criarTaxonomia('Filo', reinoId, f.filoNome)).id;

    if (classeId === 'outro')
      classeId = (await this.criarTaxonomia('Classe', filoId, f.classeNome)).id;

    if (ordemId === 'outro')
      ordemId = (await this.criarTaxonomia('Ordem', classeId, f.ordemNome)).id;

    if (familiaId === 'outro')
      familiaId = (await this.criarTaxonomia('Família', ordemId, f.familiaNome)).id;

    if (generoId === 'outro')
      generoId = (await this.criarTaxonomia('Gênero', familiaId, f.generoNome)).id;

    const payload: Especie = {
      ...(this.isEditMode() && this.especieId ? { id: this.especieId } : {}),
      nome: f.nome,
      nomeCientifico: f.nomeCientifico,
      ano: f.ano,
      descricao: f.descricao ?? "",
      taxonomia: { id: generoId }
    };

    console.log("➡️ JSON enviado para o backend:");
    console.log(JSON.stringify(payload, null, 2));

    this.saving = true;

    const req$ = this.isEditMode() && this.especieId
      ? this.especieService.atualizar(this.especieId, payload)
      : this.especieService.salvar(payload);

    req$
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => console.error("❌ Erro ao salvar:", err.error)
      });
  }

  preencherFormularioParaEdicao(especie: Especie): void {
    // deixado livre — não interfere no problema dos selects
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
