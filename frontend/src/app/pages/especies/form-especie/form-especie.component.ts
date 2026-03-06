import { Component, OnInit, AfterViewInit, ChangeDetectorRef, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    CommonModule, ReactiveFormsModule, MatInputModule, 
    MatFormFieldModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule
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

  mostrarSub: any = {
    subclasse: false, infraclasse: false,
    subordem: false, infraordem: false, parvordem: false,
    subfamilia: false, subtribo: false,
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
    reino: false, filo: false, classe: false, ordem: false, familia: false, genero: false, epiteto: false
  };

  ngOnInit(): void {
    this.carregarTaxonomias();
    this.initForm();
    this.setupNomeCientificoAuto();
    
    if (this.data) {
      this.isEditMode.set(true);
      this.especieId = this.data.id;
      this.formEspecie.patchValue({
        nome: this.data.nome,
        autor: this.data.autor,
        nomeCientifico: this.data.nomeCientifico,
        ano: this.data.ano,
        descricao: this.data.descricao
      });
    }
    this.carregando = false;
  }

  private initForm() {
    this.formEspecie = this.fb.group({
      nome: ['', Validators.required],
      autor: ['', Validators.required], 
      nomeCientifico: ['', Validators.required],
      ano: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      descricao: [''],
      // Inputs de novos registros (Outro...)
      reinoNome: [''], filoNome: [''], classeNome: [''], ordemNome: [''], familiaNome: [''], generoNome: [''], epitetoNome: [''],
      // Inputs de Subgrupos Dinâmicos
      subclasseNome: [''], infraclasseNome: [''],
      subordemNome: [''], infraordemNome: [''], parvordemNome: [''],
      subfamiliaNome: [''], subtriboNome: [''],
      subgeneroNome: [''],
      // Ids das seleções
      reinoId: [''], filoId: [''], classeId: [''], ordemId: [''],
      familiaId: [''], generoId: ['', Validators.required], epitetoId: ['', Validators.required]
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

  onSelectChange(event: any, nivel: NivelKey) {
    const value = event.target.value;
    this.mostrarInput[nivel] = value === 'outro';
    this.mostrarInput = {
      ...this.mostrarInput,
      [nivel]: value === 'outro'
    };
    this.cdr.detectChanges();
  }

  private setupNomeCientificoAuto() {
    // Lista de campos que compõem o nome científico
    const camposMonitorados = [
      'generoId', 'generoNome', 
      'epitetoId', 'epitetoNome'
    ];

    camposMonitorados.forEach(campo => {
      this.formEspecie.get(campo)?.valueChanges.subscribe(() => {
        this.atualizarNomeCientifico();
      });
    });
  }

  private atualizarNomeCientifico() {
    const f = this.formEspecie.getRawValue();

    // 1. Pegar o nome do Gênero
    let genero = '';
    if (f.generoId === 'outro') {
      genero = f.generoNome || '';
    } else {
      const obj = this.generos.find(g => g.id == f.generoId);
      genero = obj ? obj.nome : '';
    }

    // 2. Pegar o nome do Epíteto
    let epiteto = '';
    if (f.epitetoId === 'outro') {
      epiteto = f.epitetoNome || '';
    } else {
      const obj = this.epitetos.find(e => e.id == f.epitetoId);
      epiteto = obj ? obj.nome : '';
    }

    // 3. Unir e atualizar o formulário
    const nomeCompleto = `${genero} ${epiteto}`.trim();
    this.formEspecie.get('nomeCientifico')?.setValue(nomeCompleto, { emitEvent: false });
  }

  private construirArvore(): Taxonomia | null {
    const f = this.formEspecie.getRawValue();
    const resolverNivel = (idVal: any, nomeVal: string, nivel: string, lista: Taxonomia[], pai: Taxonomia | null): Taxonomia | null => {
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

    // Ordem de inserção na árvore respeitando a hierarquia biológica
    if (f.subclasseNome && this.mostrarSub.subclasse) tree = { nome: f.subclasseNome, nivel: 'Subclasse', parent: tree };
    if (f.infraclasseNome && this.mostrarSub.infraclasse) tree = { nome: f.infraclasseNome, nivel: 'Infraclasse', parent: tree };

    tree = resolverNivel(f.ordemId, f.ordemNome, 'Ordem', this.ordens, tree);

    if (f.subordemNome && this.mostrarSub.subordem) tree = { nome: f.subordemNome, nivel: 'Subordem', parent: tree };
    if (f.infraordemNome && this.mostrarSub.infraordem) tree = { nome: f.infraordemNome, nivel: 'Infraordem', parent: tree };
    if (f.parvordemNome && this.mostrarSub.parvordem) tree = { nome: f.parvordemNome, nivel: 'Parvordem', parent: tree };

    tree = resolverNivel(f.familiaId, f.familiaNome, 'Família', this.familias, tree);

    if (f.subfamiliaNome && this.mostrarSub.subfamilia) tree = { nome: f.subfamiliaNome, nivel: 'Subfamília', parent: tree };
    if (f.subtriboNome && this.mostrarSub.subtribo) tree = { nome: f.subtriboNome, nivel: 'Subtribo', parent: tree };

    tree = resolverNivel(f.generoId, f.generoNome, 'Gênero', this.generos, tree);

    if (f.subgeneroNome && this.mostrarSub.subgenero) tree = { nome: f.subgeneroNome, nivel: 'Subgênero', parent: tree };

    tree = resolverNivel(f.epitetoId, f.epitetoNome, 'Epiteto', this.epitetos, tree);

    return tree;
  }

  salvarEspecie() {
    if (this.formEspecie.invalid) return;
    this.saving = true;

    const hierarquia = this.construirArvore();

    if (!hierarquia) {
      this.saving = false;
      return;
    }

    const f = this.formEspecie.getRawValue();
    const payload: Especie = {
      ...(this.isEditMode() && this.especieId ? { id: this.especieId } : {}),
      nome: f.nome,
      autor: f.autor, 
      nomeCientifico: f.nomeCientifico,
      ano: Number(f.ano),
      descricao: f.descricao ?? "",
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

  ativarSubgrupo(event: any) {
    const valor = event.target.value;
    if (valor) {
      this.mostrarSub[valor] = true;
      this.menuAberto = null; // Fecha o menu
    }
  }

  removerSubgrupo(sub: string) {
    this.mostrarSub[sub] = false;
    this.formEspecie.get(sub + 'Nome')?.setValue('');
  }

  fechar() { this.dialogRef.close(); }
  toggleMenuSub(grupo: string) {
    this.menuAberto = this.menuAberto === grupo ? null : grupo;
  }
  toggleSub(tipo: string) { this.mostrarSub[tipo] = !this.mostrarSub[tipo]; }
}

