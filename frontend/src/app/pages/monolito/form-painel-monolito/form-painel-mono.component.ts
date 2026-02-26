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
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Monolito } from '../../../models/monolito.model';
import { MonolitoService } from '../../../services/monolito.service';
type NivelKey = 'reino' | 'filo' | 'classe' | 'ordem' | 'familia' | 'genero' | 'epiteto';

@Component({
  selector: 'app-form-especie',
  standalone: true,
  templateUrl: './form-painel-mono.component.html',
  styleUrls: ['./form-painel-mono.component.scss'],
  imports: [
    CommonModule, ReactiveFormsModule, MatInputModule, 
    MatFormFieldModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule
  ]
})
export class FormMonolitoComponent implements OnInit, AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private especieService = inject(EspecieService);
  private dialogRef = inject(MatDialogRef<FormMonolitoComponent>);
  private data = inject<Especie | null>(MAT_DIALOG_DATA);
  private monolitoService = inject(MonolitoService);
  private taxonomiaService = inject(TaxonomiaService);

  especies: Especie[] = [];
  especiesFiltradas: Especie[] = [];
  buscaEspecie = new Subject<string>();
  formEspecie!: FormGroup;
  isEditMode = signal(false);
  listaTaxonomiaCompleta: Partial<Taxonomia>[] = [];
carregandoTaxonomia = false;
  especieId?: number;
  carregando = true;
  saving = false;
  formMonolito!: FormGroup;


  mostrarInput: Record<NivelKey, boolean> = {
    reino: false, filo: false, classe: false, ordem: false, familia: false, genero: false, epiteto: false
  };
  

  ngOnInit(): void {
  this.initForms();
  this.carregarEspecies();
  if (this.data) {
    this.formMonolito.patchValue({ especieId: this.data.id });
    this.especiesSelecionada = this.data;
    
    if (this.data.taxonomia) {
      this.listaTaxonomiaCompleta = this.getTaxonomiaCompleta(this.data.taxonomia);
    } else {
      this.carregandoTaxonomia = true;
      this.especieService.buscarPorId(this.data.id!).subscribe({
        next: (res) => {
          this.especiesSelecionada = res;
          this.listaTaxonomiaCompleta = res.taxonomia
            ? this.getTaxonomiaCompleta(res.taxonomia)
            : [];
          this.carregandoTaxonomia = false;
        },
        error: () => this.carregandoTaxonomia = false
      });
    }
  }

  this.buscaEspecie.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(termo => {
    this.especiesFiltradas = this.especies.filter(e =>
      e.nomeCientifico.toLowerCase().includes(termo.toLowerCase())
    );
  });
}

private initForms() {
  this.formEspecie = this.fb.group({
    nome: ['', Validators.required],
    nomeCientifico: ['', Validators.required],
    ano: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    descricao: ['']
  });

  this.formMonolito = this.fb.group({
    especieId: ['', Validators.required],  // FK → monolito_especie.especie_id
    monolitoId: ['', Validators.required], // FK → monolito_especie.monolito_id
    station_field_number: [''],
    sampling_number: [''],
    metodo: [''],
    profundidade_solo: [''],
    dia: [''],
    mes: [''],
    ano: [''],
    collector: [''],
    remarks: ['']
  });
}

especiesSelecionada: Especie | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  carregarEspecies() {
  this.especieService.listar().subscribe(lista => {
    this.especies = lista;
    this.especiesFiltradas = lista;
  });
}


onBuscarEspecie(event: Event) {
  const termo = (event.target as HTMLInputElement).value;
  this.buscaEspecie.next(termo);
}
onSelecionarEspecie(event: Event) {
  const id = +(event.target as HTMLSelectElement).value;
  this.formMonolito.patchValue({ especieId: id });

  if (!id) {
    this.especiesSelecionada = null;
    this.listaTaxonomiaCompleta = [];
    return;
  }

  this.carregandoTaxonomia = true;
  this.especieService.buscarPorId(id).subscribe({
    next: (res) => {
      this.especiesSelecionada = res;
      this.listaTaxonomiaCompleta = res.taxonomia
        ? this.getTaxonomiaCompleta(res.taxonomia)
        : [];
      this.carregandoTaxonomia = false;
    },
    error: () => this.carregandoTaxonomia = false
  });
}
getTaxonomiaCompleta(tax: Partial<Taxonomia>): Partial<Taxonomia>[] {
  const lista: Partial<Taxonomia>[] = [];
  let atual: any = tax;
  while (atual) {
    lista.unshift({ ...atual });
    atual = atual.parent;
  }
  return lista;
}
salvarMonolito() {
  if (this.formMonolito.invalid) return;
  this.saving = true;

  const f = this.formMonolito.getRawValue();
  const especieId = f.especieId;

  const payload: Monolito = {
    station_field_number: f.station_field_number,
    sampling_number: f.sampling_number,
    metodo: f.metodo,
    profundidade_solo: f.profundidade_solo,
    dia: f.dia,
    mes: f.mes,
    ano: f.ano,
    collector: f.collector,
    remarks: f.remarks
  };
  
  this.monolitoService.salvar(payload).pipe(
    finalize(() => this.saving = false)
  ).subscribe({
    next: (monolitoSalvo) => {
      this.monolitoService.adicionarEspecies(monolitoSalvo.id!, [especieId]).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Erro ao vincular espécie:', err)
      });
    },
    error: (err) => console.error('Erro ao salvar monólito:', err)
  });
}
  fechar() { this.dialogRef.close(); }
}