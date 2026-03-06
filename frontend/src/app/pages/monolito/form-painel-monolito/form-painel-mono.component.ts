import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
  signal
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, finalize, map } from 'rxjs/operators';

import { EspecieService } from '../../../services/especie.service';
import { TaxonomiaService } from '../../../services/taxonomia.service';
import { MonolitoService } from '../../../services/monolito.service';

import { Especie } from '../../../models/especie.model';
import { Taxonomia } from '../../../models/taxonomia.model';
import { Monolito } from '../../../models/monolito.model';
import { AuthService } from '../../../services/auth.service';

type NivelKey =
  | 'reino'
  | 'filo'
  | 'classe'
  | 'ordem'
  | 'familia'
  | 'genero'
  | 'epiteto';

interface TomboTemporario {
  especieId: number;
  nomeCientifico: string;
  abundancia: number;
  identificador: string;
}

@Component({
  selector: 'app-form-especie',
  standalone: true,
  templateUrl: './form-painel-mono.component.html',
  styleUrls: ['./form-painel-mono.component.scss'],
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
export class FormMonolitoComponent implements OnInit, AfterViewInit {

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private dialogRef = inject(MatDialogRef<FormMonolitoComponent>);
  private data = inject<Especie | null>(MAT_DIALOG_DATA);

  private especieService = inject(EspecieService);
  private taxonomiaService = inject(TaxonomiaService);
  private monolitoService = inject(MonolitoService);
  private authService = inject(AuthService);

  // ===== FORM =====
  formMonolito!: FormGroup;

  // ===== ESTADO =====
  especies: Especie[] = [];
  especiesFiltradas: Especie[] = [];
  especiesSelecionada: Especie | null = null;

  listaTaxonomiaCompleta: Partial<Taxonomia>[] = [];
  listaDeTombos: TomboTemporario[] = [];

  buscaEspecie = new Subject<string>();

  carregandoTaxonomia = false;
  saving = false;

  proximoNumero = '001';

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
    this.carregarEspecies();
    this.gerarNovoNumero();

    if (this.data) {
      this.formMonolito.patchValue({ especieId: this.data.id });
      this.especiesSelecionada = this.data;

      if (this.data.taxonomia) {
        this.listaTaxonomiaCompleta = this.getTaxonomiaCompleta(this.data.taxonomia);
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

  ngAfterViewInit(): void {
    setTimeout(() => this.cdr.detectChanges());
  }

  // ===== FORM INIT =====
  private initForm(): void {
    this.formMonolito = this.fb.group({
      especieId: [null],
      abundancia: [null, [Validators.min(1)]],
      identificador: [''],

      stationFieldNumber: ['', [Validators.required]],
      samplingNumber: [null, [Validators.required, Validators.min(1)]],
      metodo: ['', [Validators.required]],
      profundidadeSolo: ['', [Validators.required]],

      dataColeta: [null, Validators.required],

      collector: ['', [Validators.required]],
      remarks: ['']
    });
  }

  // ===== ESPÉCIES =====
  carregarEspecies(): void {
    this.especieService.listar().subscribe(lista => {
      this.especies = lista;
      this.especiesFiltradas = lista;
    });
  }

  onBuscarEspecie(event: Event): void {
    const termo = (event.target as HTMLInputElement).value;
    this.buscaEspecie.next(termo);
  }

  onSelecionarEspecie(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);

    if (!id) {
      this.especiesSelecionada = null;
      this.listaTaxonomiaCompleta = [];
      return;
    }

    this.carregandoTaxonomia = true;
    this.especieService.buscarPorId(id).subscribe({
      next: res => {
        this.especiesSelecionada = res;
        this.listaTaxonomiaCompleta = res.taxonomia
          ? this.getTaxonomiaCompleta(res.taxonomia)
          : [];
        this.carregandoTaxonomia = false;
      },
      error: () => this.carregandoTaxonomia = false
    });
  }

  // ===== TAXONOMIA =====
  getTaxonomiaCompleta(tax: Partial<Taxonomia>): Partial<Taxonomia>[] {
    const lista: Partial<Taxonomia>[] = [];
    let atual: any = tax;

    while (atual) {
      lista.unshift({ ...atual });
      atual = atual.parent;
    }
    return lista;
  }

  // ===== TOMBO =====
  gerarNovoNumero(): void {
    this.proximoNumero = (this.listaDeTombos.length + 1)
      .toString()
      .padStart(3, '0');
  }

  adicionarEspecieALista(): void {
    const f = this.formMonolito.value;

    if (!f.especieId || !f.abundancia) {
      alert('Preencha os dados da espécie.');
      return;
    }

    const identificadorCompleto = `${f.identificador}${this.proximoNumero}`;

    this.listaDeTombos.push({
      especieId: Number(f.especieId),
      nomeCientifico: this.especiesSelecionada?.nomeCientifico || '',
      abundancia: f.abundancia,
      identificador: identificadorCompleto
    });

    this.formMonolito.patchValue({
      especieId: null,
      abundancia: null
    });

    this.gerarNovoNumero();
  }

  removerEspecieDaLista(index: number): void {
    this.listaDeTombos.splice(index, 1);
    this.gerarNovoNumero();
  }

  // ===== SALVAR =====
  salvarMonolito(): void {
    const ids = this.listaDeTombos.map(t => (t.identificador || '').trim());
    const repetidos = ids.filter((id, i) => id && ids.indexOf(id) !== i);

    if (repetidos.length > 0) {
      alert('Há tombos repetidos na lista: ' + Array.from(new Set(repetidos)).join(', '));
      return;
    }

    if (this.listaDeTombos.length === 0) {
      alert('Adicione ao menos uma espécie.');
      return;
    }

    if (this.formMonolito.invalid) {

      Object.entries(this.formMonolito.controls).forEach(([k, c]) => {
        if (c.invalid) console.log('INVÁLIDO:', k, c.errors, c.value);
      });

      this.formMonolito.markAllAsTouched();

      alert('Preencha os campos obrigatórios do monólito.');
      return;
    }

    const f = this.formMonolito.getRawValue();

    const [anoStr, mesStr, diaStr] = String(f.dataColeta).split('-');
    const ano = Number(anoStr);
    const mes = Number(mesStr);
    const dia = Number(diaStr);

    const payload: Monolito = {
      stationFieldNumber: f.stationFieldNumber,
      samplingNumber: Number(f.samplingNumber),
      metodo: f.metodo,
      profundidadeSolo: f.profundidadeSolo,
      dia,
      mes,
      ano,
      collector: f.collector,
      remarks: f.remarks
    };

    this.saving = true;

    this.monolitoService
    .verificarStationFieldNumber(payload.stationFieldNumber)
    .pipe(
      switchMap(existe => {
        if (existe) {
          this.saving = false;
          alert('Já existe um monólito com esse Station Field Number.');
          throw new Error('Duplicado');
        }

        const verificacoes = this.listaDeTombos.map(t =>
          this.monolitoService.verificarIdentificadorExistente(t.identificador).pipe(
            map(existeId => ({ identificador: t.identificador, existe: existeId }))
          )
        );

        // Se por algum motivo não houver tombos, segue (mas você já bloqueia antes)
        return forkJoin(verificacoes).pipe(
          switchMap(resultados => {
            const jaExistem = resultados.filter(r => r.existe).map(r => r.identificador);

            if (jaExistem.length > 0) {
              this.saving = false;
              alert('Já existe Tombo com este(s) identificador(es): ' + jaExistem.join(', '));
              throw new Error('IdentificadorDuplicado');
            }

            return this.monolitoService.salvar(payload);
          })
        );
      }),
      switchMap((monolito: Monolito) => {
        const id = monolito.id!;
        const chamadas = this.listaDeTombos.map(t =>
          this.monolitoService.adicionarEspecieComDados(
            id,
            t.especieId,
            t.abundancia,
            t.identificador
          )
        );
        return forkJoin(chamadas);
      }),

      finalize(() => (this.saving = false))
    )
    .subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
        if (err.message !== 'Duplicado' && err.message !== 'IdentificadorDuplicado') {
          alert('Erro ao salvar: ' + err.message);
        }
      }
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }

}

