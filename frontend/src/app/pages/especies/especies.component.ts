import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { FormTaxonomiaComponent } from './form-taxonomia/form-taxonomia.component';
import { EspecieService } from '../../services/especie.service';
import { MonolitoService } from '../../services/monolito.service';
import { Especie } from '../../models/especie.model';
import { RouterModule } from '@angular/router';

import { FormEspecieComponent } from './form-especie/form-especie.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormEditarEspecieComponent } from './form-editar-especie/form-editar-especie.component';
import { LayoutComponent } from '../../components/mainpage-layout/layout.component';

import { TaxonomiaService } from '../../services/taxonomia.service';
import { AuthService } from '../../services/auth.service';
import { Monolito } from '../../models/monolito.model';
import { Tombo } from '../../models/tombo.model';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

type TaxLevelKey =
  | 'reino'
  | 'filo'
  | 'classe'
  | 'subclasse'
  | 'infraclasse'
  | 'ordem'
  | 'subordem'
  | 'infraordem'
  | 'parvordem'
  | 'familia'
  | 'subfamilia'
  | 'genero'
  | 'subgenero'
  | 'epiteto';

@Component({
  selector: 'app-especies',
  standalone: true,
  templateUrl: './especies.component.html',
  styleUrls: ['./especies.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTooltipModule,
    LayoutComponent
  ],
})
export class EspecieComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  itensPorPagina: number = 5;
  rotaAtiva: string = 'especies';

  especies: Especie[] = [];
  displayedColumns: string[] = ['nome', 'nomeCientifico', 'autor', 'ano', 'acoes'];
  dataSource = new MatTableDataSource<Especie>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filters: {
    search: string;
    ano: number | null;
    autor: string | null;
    monolito: string | null;
    taxonomia: Record<TaxLevelKey, string | null>;
  } = {
    search: '',
    ano: null,
    autor: null,
    monolito: null,
    taxonomia: {
      reino: null,
      filo: null,
      classe: null,
      subclasse: null,
      infraclasse: null,
      ordem: null,
      subordem: null,
      infraordem: null,
      parvordem: null,
      familia: null,
      subfamilia: null,
      genero: null,
      subgenero: null,
      epiteto: null,
    }
  };

  anoOptions: number[] = [];
  autorOptions: string[] = [];
  monolitoOptions: string[] = [];

  taxonomyLevels: Array<{ key: TaxLevelKey; label: string; apiNivel: string }> = [
    { key: 'reino',       label: 'Reino',       apiNivel: 'Reino' },
    { key: 'filo',        label: 'Filo',        apiNivel: 'Filo' },
    { key: 'classe',      label: 'Classe',      apiNivel: 'Classe' },
    { key: 'subclasse',   label: 'Subclasse',   apiNivel: 'Subclasse' },
    { key: 'infraclasse', label: 'Infraclasse', apiNivel: 'Infraclasse' },
    { key: 'ordem',       label: 'Ordem',       apiNivel: 'Ordem' },
    { key: 'subordem',    label: 'Subordem',    apiNivel: 'Subordem' },
    { key: 'infraordem',  label: 'Infraordem',  apiNivel: 'Infraordem' },
    { key: 'parvordem',   label: 'Parvordem',   apiNivel: 'Parvordem' },
    { key: 'familia',     label: 'Família',     apiNivel: 'Família' },
    { key: 'subfamilia',  label: 'Subfamília',  apiNivel: 'Subfamília' },
    { key: 'genero',      label: 'Gênero',      apiNivel: 'Gênero' },
    { key: 'subgenero',   label: 'Subgênero',   apiNivel: 'Subgênero' },
    { key: 'epiteto',     label: 'Epíteto',     apiNivel: 'Epiteto' },
  ];

  expandedTaxLevels: Record<TaxLevelKey, boolean> = {
    reino: true,
    filo: false,
    classe: false,
    subclasse: false,
    infraclasse: false,
    ordem: false,
    subordem: false,
    infraordem: false,
    parvordem: false,
    familia: false,
    subfamilia: false,
    genero: false,
    subgenero: false,
    epiteto: false,
  };

  taxOptions: Record<TaxLevelKey, string[]> = {
    reino: [],
    filo: [],
    classe: [],
    subclasse: [],
    infraclasse: [],
    ordem: [],
    subordem: [],
    infraordem: [],
    parvordem: [],
    familia: [],
    subfamilia: [],
    genero: [],
    subgenero: [],
    epiteto: [],
  };

  private taxLoaded: Record<TaxLevelKey, boolean> = {
    reino: false,
    filo: false,
    classe: false,
    subclasse: false,
    infraclasse: false,
    ordem: false,
    subordem: false,
    infraordem: false,
    parvordem: false,
    familia: false,
    subfamilia: false,
    genero: false,
    subgenero: false,
    epiteto: false,
  };

  private especieMonolitoMap: Record<number, string[]> = {};

  constructor(
    private especieService: EspecieService,
    private monolitoService: MonolitoService,
    private taxonomiaService: TaxonomiaService,
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setupFilterPredicate();
    this.carregarDados();
    this.loadTaxOptions('reino');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  alterarItensPorPagina() {
    if (this.paginator) {
      this.paginator._changePageSize(this.itensPorPagina);
    }
  }

  carregarDados(): void {
    this.especieService.listar().pipe(
      switchMap((especies) => {
        this.especies = especies ?? [];
        this.dataSource.data = this.especies;

        return this.monolitoService.listar().pipe(
          switchMap((monolitos: Monolito[]) => {
            if (!monolitos || monolitos.length === 0) {
              this.especieMonolitoMap = {};
              this.buildMenuOptions(this.especies);
              this.applyAllFilters();
              return of(null);
            }

            const chamadasTombos = monolitos.map((monolito) =>
              this.monolitoService.listarTombos(monolito.id!).pipe(
                catchError((erro) => {
                  console.error(`Erro ao listar tombos do monólito ${monolito.id}:`, erro);
                  return of([]);
                })
              )
            );

            return forkJoin(chamadasTombos).pipe(
              switchMap((listaDeTombosPorMonolito) => {
                this.montarMapaEspecieMonolito(monolitos, listaDeTombosPorMonolito as Tombo[][]);
                this.buildMenuOptions(this.especies);
                this.applyAllFilters();
                return of(null);
              })
            );
          }),
          catchError((erro) => {
            console.error('Erro ao carregar monólitos:', erro);
            this.especieMonolitoMap = {};
            this.buildMenuOptions(this.especies);
            this.applyAllFilters();
            return of(null);
          })
        );
      }),
      catchError((erro) => {
        console.error('Erro ao carregar espécies:', erro);
        this.snackBar.open('Erro ao carregar espécies.', 'Fechar', { duration: 3000 });
        return of(null);
      })
    ).subscribe();
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.filters.search = value ?? '';
    this.applyAllFilters();
  }

  setAno(ano: number | null) {
    this.filters.ano = ano;
    this.applyAllFilters();
  }

  setAutor(autor: string | null) {
    this.filters.autor = autor;
    this.applyAllFilters();
  }

  setMonolito(monolito: string | null) {
    this.filters.monolito = monolito;
    this.applyAllFilters();
  }

  toggleTaxLevel(level: TaxLevelKey) {
    this.expandedTaxLevels[level] = !this.expandedTaxLevels[level];
    if (this.expandedTaxLevels[level]) {
      this.loadTaxOptions(level);
    }
  }

  selectTaxOption(level: TaxLevelKey, value: string) {
    this.filters.taxonomia[level] = this.filters.taxonomia[level] === value ? null : value;
    this.applyAllFilters();
  }

  limparTaxonomia() {
    (Object.keys(this.filters.taxonomia) as TaxLevelKey[]).forEach((k) => {
      this.filters.taxonomia[k] = null;
    });
    this.applyAllFilters();
  }

  limparFiltros() {
    this.searchTerm = '';
    this.filters.search = '';
    this.filters.ano = null;
    this.filters.autor = null;
    this.filters.monolito = null;

    (Object.keys(this.filters.taxonomia) as TaxLevelKey[]).forEach((k) => {
      this.filters.taxonomia[k] = null;
    });

    this.applyAllFilters();
  }

  private setupFilterPredicate() {
    this.dataSource.filterPredicate = (e: Especie, raw: string) => {
      let f: any;
      try {
        f = JSON.parse(raw || '{}');
      } catch {
        f = {};
      }

      const nome = (e.nome ?? '').toString().toLowerCase();
      const cient = ((e as any).nomeCientifico ?? '').toString().toLowerCase();

      const search = (f.search ?? '').toString().trim().toLowerCase();
      const okSearch = !search || nome.includes(search) || cient.includes(search);

      const okAno = f.ano == null ? true : Number((e as any).ano) === Number(f.ano);

      const autor = this.getAutorFromEspecie(e).toLowerCase();
      const okAutor = !f.autor ? true : autor === String(f.autor).toLowerCase();

      const monolitosDaEspecie = this.getMonolitosFromEspecie(e).map((m) => m.toLowerCase());
      const okMonolito = !f.monolito
        ? true
        : monolitosDaEspecie.includes(String(f.monolito).toLowerCase());

      const okTax = (Object.keys(f.taxonomia || {}) as TaxLevelKey[]).every((k) => {
        const selected = f.taxonomia?.[k];
        if (!selected) return true;

        return this.especiePertenceANivel(e, k, String(selected));
      });

      return okSearch && okAno && okAutor && okMonolito && okTax;
    };
  }

  private applyAllFilters() {
    this.dataSource.filter = JSON.stringify(this.filters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private buildMenuOptions(data: Especie[]) {
    const anos = new Set<number>();
    data.forEach((e) => {
      const a = Number((e as any).ano);
      if (!Number.isNaN(a)) {
        anos.add(a);
      }
    });
    this.anoOptions = Array.from(anos).sort((a, b) => b - a);

    const autores = new Set<string>();
    data.forEach((e) => {
      const au = this.getAutorFromEspecie(e).trim();
      if (au) {
        autores.add(au);
      }
    });
    this.autorOptions = Array.from(autores).sort((a, b) => a.localeCompare(b));

    const monos = new Set<string>();
    data.forEach((e) => {
      const lista = this.getMonolitosFromEspecie(e);
      lista.forEach((m) => {
        const valor = m.trim();
        if (valor) {
          monos.add(valor);
        }
      });
    });
    this.monolitoOptions = Array.from(monos).sort((a, b) => a.localeCompare(b));
  }

  private getAutorFromEspecie(e: Especie): string {
    return String((e as any).autor ?? '');
  }

  private getMonolitosFromEspecie(e: Especie): string[] {
    const especieId = Number((e as any).id);
    if (!especieId || !this.especieMonolitoMap[especieId]) {
      return [];
    }
    return this.especieMonolitoMap[especieId];
  }

  private montarMapaEspecieMonolito(monolitos: Monolito[], tombosPorMonolito: Tombo[][]): void {
    const mapa: Record<number, string[]> = {};

    monolitos.forEach((monolito, index) => {
      const tombos = tombosPorMonolito[index] || [];
      const labelMonolito = this.getMonolitoLabel(monolito);

      tombos.forEach((tombo) => {
        const especieId = Number(tombo?.especie?.id);

        if (!especieId) {
          return;
        }

        if (!mapa[especieId]) {
          mapa[especieId] = [];
        }

        if (!mapa[especieId].includes(labelMonolito)) {
          mapa[especieId].push(labelMonolito);
        }
      });
    });

    this.especieMonolitoMap = mapa;
  }

  private getMonolitoLabel(monolito: any): string {
    const stationFieldNumber = String(monolito?.stationFieldNumber ?? '').trim();
    const samplingNumber = monolito?.samplingNumber != null
      ? String(monolito.samplingNumber).trim()
      : '';
    const id = monolito?.id != null ? String(monolito.id).trim() : '';

    if (stationFieldNumber && samplingNumber) {
      return `${stationFieldNumber} - ${samplingNumber}`;
    }

    if (stationFieldNumber) {
      return stationFieldNumber;
    }

    if (samplingNumber) {
      return `Amostra ${samplingNumber}`;
    }

    if (id) {
      return `Monólito ${id}`;
    }

    return 'Monólito';
  }

  private especiePertenceANivel(especie: Especie, level: TaxLevelKey, selectedValue: string): boolean {
    const nivelLabel = this.getNivelLabelByKey(level);
    if (!nivelLabel) return false;

    let atual: any = (especie as any).taxonomia;

    while (atual) {
      const nomeAtual = String(atual?.nome ?? '').trim().toLowerCase();
      const nivelAtual = String(atual?.nivel ?? '').trim().toLowerCase();

      if (
        nivelAtual === nivelLabel.toLowerCase() &&
        nomeAtual === selectedValue.trim().toLowerCase()
      ) {
        return true;
      }

      atual = atual.parent;
    }

    return false;
  }

  private getNivelLabelByKey(level: TaxLevelKey): string | null {
    const found = this.taxonomyLevels.find((l) => l.key === level);
    return found ? found.label : null;
  }

  private loadTaxOptions(level: TaxLevelKey) {
    if (this.taxLoaded[level]) return;

    const cfg = this.taxonomyLevels.find((l) => l.key === level);
    if (!cfg) return;

    this.taxonomiaService.filtrarPorNivel(cfg.apiNivel).subscribe({
      next: (list) => {
        this.taxOptions[level] = (list || [])
          .map((t: any) => String(t?.nome ?? ''))
          .filter((x: string) => !!x)
          .sort((a: string, b: string) => a.localeCompare(b));

        this.taxLoaded[level] = true;
      },
      error: (err) => {
        console.error('Erro ao carregar taxonomia por nível:', level, err);
        this.taxOptions[level] = [];
        this.taxLoaded[level] = true;
      }
    });
  }

  abrirCadastroEspecie(especie?: Especie): void {
    const dialogRef = this.dialog.open(FormEspecieComponent, {
      width: '70vw',
      height: '85vh',
      maxWidth: '100vw',
      autoFocus: false,
      data: especie ?? null,
      panelClass: 'dialog-especie',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.carregarDados();
      }
    });
  }

  verTaxonomia(especie: Especie): void {
    if (!especie.id) {
      this.snackBar.open('Espécie inválida.', 'Fechar', { duration: 3000 });
      return;
    }

    this.dialog.open(FormTaxonomiaComponent, {
      width: '600px',
      data: { id: especie.id }
    });
  }

  editarEspecie(especie: Especie): void {
    const dialogRef = this.dialog.open(FormEditarEspecieComponent, {
      width: '70vw',
      height: '85vh',
      maxWidth: '100vw',
      autoFocus: false,
      data: { especieId: especie.id },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.snackBar.open('Espécie atualizada com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarDados();
      }
    });
  }

  excluirEspecie(especie: Especie): void {
    const confirmar = confirm(`Tem certeza que deseja excluir a espécie "${especie.nome}"?`);
    if (!confirmar) return;

    this.especieService.deletar(especie.id!).subscribe({
      next: () => {
        this.snackBar.open('Espécie excluída com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarDados();
      },
      error: (erro) => {
        console.error('Erro ao excluir espécie:', erro);
        this.snackBar.open('Erro ao excluir a espécie.', 'Fechar', { duration: 3000 });
      }
    });
  }

  irParaMainpage() {
    this.rotaAtiva = 'mainpage';
    this.router.navigate(['/mainpage']);
  }

  irParaEspecies() {
    this.rotaAtiva = 'especies';
    this.router.navigate(['/especies']);
  }

  logout() {
    this.rotaAtiva = '';
    this.router.navigate(['/login']);
  }
}