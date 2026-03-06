import { Component, OnInit, AfterViewInit, ChangeDetectorRef, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EspecieService } from '../../../services/especie.service';
import { TaxonomiaService } from '../../../services/taxonomia.service';
import { finalize } from 'rxjs/operators';
import { Especie } from '../../../models/especie.model';
import { Taxonomia } from '../../../models/taxonomia.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type NivelKey = 'reino' | 'filo' | 'classe' | 'ordem' | 'familia' | 'genero' | 'epiteto';

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

  autores: string[] = [];
  mostrarAutorInput = false;

  mostrarSub: any = {
    subclasse: false,
    infraclasse: false,
    subordem: false,
    infraordem: false,
    parvordem: false,
    subfamilia: false,
    subtribo: false,
    subgenero: false
  };

  menuAberto: string | null = null;

  reinos: Taxonomia[] = [];
  filos: Taxonomia[] = [];
  classes: Taxonomia[] = [];
  ordens: Taxonomia[] = [];
  familias: Taxonomia[] = [];
  generos: Taxonomia[] = [];
  epitetos: Taxonomia[] = [];

  mostrarInput: Record<NivelKey, boolean> = {
    reino: false,
    filo: false,
    classe: false,
    ordem: false,
    familia: false,
    genero: false,
    epiteto: false
  };

  ngOnInit(): void {
    this.initForm();
    this.carregarTaxonomias();
    this.carregarAutores();
    this.setupNomeCientificoAuto();

    if (this.data) {
      this.isEditMode.set(true);
      this.especieId = this.data.id;

      const autorExistente = this.data.autor && this.autores.includes(this.data.autor);

      this.formEspecie.patchValue({
        nome: this.data.nome,
        nomeCientifico: this.data.nomeCientifico,
        ano: this.data.ano,
        descricao: this.data.descricao,
        autorId: autorExistente ? this.data.autor : 'outro',
        autorNome: autorExistente ? '' : (this.data.autor ?? '')
      });

      if (!autorExistente && this.data.autor) {
        this.mostrarAutorInput = true;
        this.formEspecie.get('autorNome')?.setValidators([Validators.required]);
        this.formEspecie.get('autorNome')?.updateValueAndValidity();
      }
    }

    this.carregando = false;
  }

  private initForm() {
    this.formEspecie = this.fb.group({
      nome: ['', Validators.required],
      nomeCientifico: ['', Validators.required],

      autorId: ['', Validators.required],
      autorNome: [''],

      ano: [''],
      descricao: [''],

      reinoNome: [''],
      filoNome: [''],
      classeNome: [''],
      ordemNome: [''],
      familiaNome: [''],
      generoNome: [''],
      epitetoNome: [''],

      subclasseNome: [''],
      infraclasseNome: [''],
      subordemNome: [''],
      infraordemNome: [''],
      parvordemNome: [''],
      subfamiliaNome: [''],
      subtriboNome: [''],
      subgeneroNome: [''],

      reinoId: ['', Validators.required],
      filoId: ['', Validators.required],
      classeId: ['', Validators.required],
      ordemId: ['', Validators.required],
      familiaId: ['', Validators.required],
      generoId: ['', Validators.required],
      epitetoId: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  carregarTaxonomias() {
    this.taxonomiaService.filtrarPorNivel('Reino').subscribe(r => this.reinos = r);
    this.taxonomiaService.filtrarPorNivel('Filo').subscribe(r => this.filos = r);
    this.taxonomiaService.filtrarPorNivel('Classe').subscribe(r => this.classes = r);
    this.taxonomiaService.filtrarPorNivel('Ordem').subscribe(r => this.ordens = r);
    this.taxonomiaService.filtrarPorNivel('Família').subscribe(r => this.familias = r);
    this.taxonomiaService.filtrarPorNivel('Gênero').subscribe(r => this.generos = r);
    this.taxonomiaService.filtrarPorNivel('Epiteto').subscribe(r => this.epitetos = r);
  }

  carregarAutores() {
    this.especieService.listar().subscribe({
      next: (lista) => {
        const autoresUnicos = Array.from(
          new Set(
            (lista || [])
              .map(e => (e as any).autor?.trim())
              .filter((a): a is string => !!a)
          )
        ).sort((a, b) => a.localeCompare(b));

        this.autores = autoresUnicos;

        if (this.data?.autor) {
          const existe = this.autores.includes(this.data.autor);
          this.formEspecie.patchValue({
            autorId: existe ? this.data.autor : 'outro',
            autorNome: existe ? '' : this.data.autor
          });

          this.mostrarAutorInput = !existe;

          if (this.mostrarAutorInput) {
            this.formEspecie.get('autorNome')?.setValidators([Validators.required]);
          } else {
            this.formEspecie.get('autorNome')?.clearValidators();
          }
          this.formEspecie.get('autorNome')?.updateValueAndValidity();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar autores:', err);
      }
    });
  }

  onAutorChange(event: any) {
    const value = event.target.value;
    this.mostrarAutorInput = value === 'outro';

    const autorNomeCtrl = this.formEspecie.get('autorNome');

    if (this.mostrarAutorInput) {
      autorNomeCtrl?.setValidators([Validators.required]);
    } else {
      autorNomeCtrl?.setValue('');
      autorNomeCtrl?.clearValidators();
    }

    autorNomeCtrl?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  onSelectChange(event: any, nivel: NivelKey) {
    const value = event.target.value;
    this.mostrarInput[nivel] = value === 'outro';

    const nomeCtrl = this.formEspecie.get(`${nivel}Nome`);
    const idCtrl = this.formEspecie.get(`${nivel}Id`);

    if (value === 'outro') {
      nomeCtrl?.setValidators([Validators.required]);
    } else {
      nomeCtrl?.setValue('');
      nomeCtrl?.clearValidators();
    }

    nomeCtrl?.updateValueAndValidity();
    idCtrl?.updateValueAndValidity();

    this.mostrarInput = {
      ...this.mostrarInput,
      [nivel]: value === 'outro'
    };

    this.cdr.detectChanges();
  }

  private setupNomeCientificoAuto() {
    ['generoId', 'generoNome', 'epitetoId', 'epitetoNome'].forEach(campo => {
      this.formEspecie.get(campo)?.valueChanges.subscribe(() => {
        this.atualizarNomeCientifico();
      });
    });
  }

  private atualizarNomeCientifico() {
    const f = this.formEspecie.getRawValue();

    let genero = '';
    if (f.generoId === 'outro') {
      genero = f.generoNome || '';
    } else {
      const obj = this.generos.find(g => g.id == f.generoId);
      genero = obj ? obj.nome : '';
    }

    let epiteto = '';
    if (f.epitetoId === 'outro') {
      epiteto = f.epitetoNome || '';
    } else {
      const obj = this.epitetos.find(e => e.id == f.epitetoId);
      epiteto = obj ? obj.nome : '';
    }

    const nomeCompleto = `${genero} ${epiteto}`.trim();
    this.formEspecie.get('nomeCientifico')?.setValue(nomeCompleto, { emitEvent: false });
  }

  private construirArvore(): Taxonomia | null {
    const f = this.formEspecie.getRawValue();

    const resolverNivel = (
      idVal: any,
      nomeVal: string,
      nivel: string,
      lista: Taxonomia[],
      pai: Taxonomia | null
    ): Taxonomia | null => {
      if (idVal === 'outro' && nomeVal) return { nome: nomeVal, nivel: nivel, parent: pai };
      if (idVal && idVal !== 'outro') {
        const existente = lista.find(t => t.id == idVal);
        return existente ? { ...existente, parent: pai } : pai;
      }
      return pai;
    };

    let tree: Taxonomia | null = null;

    tree = resolverNivel(f.reinoId, f.reinoNome, 'Reino', this.reinos, null);
    tree = resolverNivel(f.filoId, f.filoNome, 'Filo', this.filos, tree);
    tree = resolverNivel(f.classeId, f.classeNome, 'Classe', this.classes, tree);

    if (f.subclasseNome && this.mostrarSub.subclasse) {
      tree = { nome: f.subclasseNome, nivel: 'Subclasse', parent: tree };
    }
    if (f.infraclasseNome && this.mostrarSub.infraclasse) {
      tree = { nome: f.infraclasseNome, nivel: 'Infraclasse', parent: tree };
    }

    tree = resolverNivel(f.ordemId, f.ordemNome, 'Ordem', this.ordens, tree);

    if (f.subordemNome && this.mostrarSub.subordem) {
      tree = { nome: f.subordemNome, nivel: 'Subordem', parent: tree };
    }
    if (f.infraordemNome && this.mostrarSub.infraordem) {
      tree = { nome: f.infraordemNome, nivel: 'Infraordem', parent: tree };
    }
    if (f.parvordemNome && this.mostrarSub.parvordem) {
      tree = { nome: f.parvordemNome, nivel: 'Parvordem', parent: tree };
    }

    tree = resolverNivel(f.familiaId, f.familiaNome, 'Família', this.familias, tree);

    if (f.subfamiliaNome && this.mostrarSub.subfamilia) {
      tree = { nome: f.subfamiliaNome, nivel: 'Subfamília', parent: tree };
    }
    if (f.subtriboNome && this.mostrarSub.subtribo) {
      tree = { nome: f.subtriboNome, nivel: 'Subtribo', parent: tree };
    }

    tree = resolverNivel(f.generoId, f.generoNome, 'Gênero', this.generos, tree);

    if (f.subgeneroNome && this.mostrarSub.subgenero) {
      tree = { nome: f.subgeneroNome, nivel: 'Subgênero', parent: tree };
    }

    tree = resolverNivel(f.epitetoId, f.epitetoNome, 'Epiteto', this.epitetos, tree);

    return tree;
  }

  salvarEspecie() {
    this.aplicarValidacoesSubgrupos();
    this.formEspecie.markAllAsTouched();

    if (this.formEspecie.invalid) {
      return;
    }

    this.saving = true;

    const hierarquia = this.construirArvore();

    if (!hierarquia) {
      this.saving = false;
      return;
    }

    const f = this.formEspecie.getRawValue();

    const autorFinal = f.autorId === 'outro' ? f.autorNome : f.autorId;

    const payload: Especie = {
      ...(this.isEditMode() && this.especieId ? { id: this.especieId } : {}),
      nome: f.nome,
      autor: autorFinal,
      nomeCientifico: f.nomeCientifico,
      ano: f.ano ? Number(f.ano) : 0,
      descricao: f.descricao ?? '',
      taxonomia: hierarquia
    };

    const request = this.isEditMode() && this.especieId
      ? this.especieService.atualizar(this.especieId, payload)
      : this.especieService.salvar(payload);

    request.pipe(finalize(() => this.saving = false)).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error(err);
      }
    });
  }

  private aplicarValidacoesSubgrupos() {
    this.setRequiredIfVisible('subclasseNome', this.mostrarSub.subclasse);
    this.setRequiredIfVisible('infraclasseNome', this.mostrarSub.infraclasse);
    this.setRequiredIfVisible('subordemNome', this.mostrarSub.subordem);
    this.setRequiredIfVisible('infraordemNome', this.mostrarSub.infraordem);
    this.setRequiredIfVisible('parvordemNome', this.mostrarSub.parvordem);
    this.setRequiredIfVisible('subfamiliaNome', this.mostrarSub.subfamilia);
    this.setRequiredIfVisible('subtriboNome', this.mostrarSub.subtribo);
    this.setRequiredIfVisible('subgeneroNome', this.mostrarSub.subgenero);
  }

  private setRequiredIfVisible(controlName: string, visible: boolean) {
    const ctrl = this.formEspecie.get(controlName);
    if (!ctrl) return;

    if (visible) {
      ctrl.setValidators([Validators.required]);
    } else {
      ctrl.clearValidators();
      ctrl.setValue('');
    }

    ctrl.updateValueAndValidity();
  }

  campoInvalido(nome: string): boolean {
    const campo = this.formEspecie.get(nome);
    return !!(campo && campo.invalid && campo.touched);
  }

  ativarSubgrupo(event: any) {
    const valor = event.target.value;
    if (valor) {
      this.mostrarSub[valor] = true;
      this.menuAberto = null;
      this.aplicarValidacoesSubgrupos();
    }
  }

  removerSubgrupo(sub: string) {
    this.mostrarSub[sub] = false;
    this.formEspecie.get(sub + 'Nome')?.setValue('');
    this.aplicarValidacoesSubgrupos();
  }

  fechar() {
    this.dialogRef.close();
  }

  toggleMenuSub(grupo: string) {
    this.menuAberto = this.menuAberto === grupo ? null : grupo;
  }

  toggleSub(tipo: string) {
    this.mostrarSub[tipo] = !this.mostrarSub[tipo];
    this.aplicarValidacoesSubgrupos();
  }
}