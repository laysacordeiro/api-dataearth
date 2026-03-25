import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

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
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from '../../components/mainpage-layout/layout.component';
import { FormMonolitoComponent } from './form-painel-monolito/form-painel-mono.component';
import { MonolitoService } from '../../services/monolito.service';
import { EspecieService } from '../../services/especie.service';
import { AuthService } from '../../services/auth.service';

import { Monolito } from '../../models/monolito.model';
import { Especie } from '../../models/especie.model';

@Component({
  selector: 'app-monolito',
  standalone: true,
  templateUrl: './monolito.component.html',
  styleUrls: ['./monolito.component.scss'],
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
export class MonolitoComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  itensPorPagina: number = 5;
  rotaAtiva: 'monolitos' = 'monolitos';

  monolitos: Monolito[] = [];
  displayedColumns: string[] = [
    'stationFieldNumber',
    'profundidadeSolo',
    'collector',
    'dataColeta',
    'acoes'
  ];

  dataSource = new MatTableDataSource<Monolito>([]);

  // filtros
  filtroStationFieldNumber: string = '';
  filtroEspecie: string = '';
  filtroMetodo: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';

  // opções dos menus
  especies: Especie[] = [];
  metodos: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private monolitoService: MonolitoService,
    private especieService: EspecieService,
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.configurarFiltro();
    this.carregarDadosIniciais();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  configurarFiltro(): void {
    this.dataSource.filterPredicate = (monolito: Monolito, filtroJson: string): boolean => {
      const filtros = JSON.parse(filtroJson);

      const station = (monolito.stationFieldNumber || '').toLowerCase();
      const metodo = (monolito.metodo || '').toLowerCase();

      const filtroStation = (filtros.stationFieldNumber || '').toLowerCase();
      const filtroMetodo = (filtros.metodo || '').toLowerCase();
      const filtroEspecie = (filtros.especie || '').toLowerCase();

      const correspondeStation =
        !filtroStation || station.includes(filtroStation);

      const correspondeMetodo =
        !filtroMetodo || metodo === filtroMetodo;

      const tombos = (monolito as any).tombos || [];
      const correspondeEspecie =
        !filtroEspecie ||
        tombos.some((tombo: any) => {
          const nome = (tombo?.especie?.nome || '').toLowerCase();
          const nomeCientifico = (tombo?.especie?.nomeCientifico || '').toLowerCase();
          return nome === filtroEspecie || nomeCientifico === filtroEspecie;
        });

      const dataMonolito = this.criarDataMonolito(monolito);

      let correspondeDataInicio = true;
      let correspondeDataFim = true;

      if (this.filtroDataInicio && dataMonolito) {
        const dataInicio = new Date(this.filtroDataInicio + 'T00:00:00');
        correspondeDataInicio = dataMonolito >= dataInicio;
      }

      if (this.filtroDataFim && dataMonolito) {
        const dataFim = new Date(this.filtroDataFim + 'T23:59:59');
        correspondeDataFim = dataMonolito <= dataFim;
      }

      if ((this.filtroDataInicio || this.filtroDataFim) && !dataMonolito) {
        return false;
      }

      return (
        correspondeStation &&
        correspondeMetodo &&
        correspondeEspecie &&
        correspondeDataInicio &&
        correspondeDataFim
      );
    };
  }

  carregarDadosIniciais(): void {
    forkJoin({
      monolitos: this.monolitoService.listar(),
      especies: this.especieService.listar(),
      metodos: this.monolitoService.listarMetodos()
    }).subscribe({
      next: ({ monolitos, especies, metodos }) => {
        this.monolitos = monolitos;
        this.dataSource.data = monolitos;
        this.especies = especies;
        this.metodos = metodos;
        this.aplicarFiltros();
      },
      error: (e) => {
        console.error('Erro ao carregar dados:', e);
        this.snackBar.open('Erro ao carregar filtros da tela.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  criarDataMonolito(monolito: Monolito): Date | null {
    if (!monolito?.dia || !monolito?.mes || !monolito?.ano) {
      return null;
    }

    return new Date(monolito.ano, monolito.mes - 1, monolito.dia);
  }

  formatarData(m: Monolito): string {
    if (!m?.dia || !m?.mes || !m?.ano) return '-';

    const dia = String(m.dia).padStart(2, '0');
    const mes = String(m.mes).padStart(2, '0');

    return `${dia}/${mes}/${m.ano}`;
  }

  alterarItensPorPagina(): void {
    if (this.paginator) {
      this.paginator._changePageSize(this.itensPorPagina);
    }
  }

  carregarMonolitos(): void {
    this.monolitoService.listar().subscribe({
      next: (data) => {
        this.monolitos = data;
        this.dataSource.data = data;
        this.aplicarFiltros();
      },
      error: (e) => console.error('Erro ao carregar monólitos:', e)
    });
  }

  selecionarEspecie(nome: string): void {
    this.filtroEspecie = nome;
    this.aplicarFiltros();
  }

  selecionarMetodo(metodo: string): void {
    this.filtroMetodo = metodo;
    this.aplicarFiltros();
  }

  limparFiltroEspecie(): void {
    this.filtroEspecie = '';
    this.aplicarFiltros();
  }

  limparFiltroMetodo(): void {
    this.filtroMetodo = '';
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const filtros = {
      stationFieldNumber: this.filtroStationFieldNumber.trim().toLowerCase(),
      especie: this.filtroEspecie.trim().toLowerCase(),
      metodo: this.filtroMetodo.trim().toLowerCase()
    };

    this.dataSource.filter = JSON.stringify(filtros);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  limparFiltros(): void {
    this.filtroStationFieldNumber = '';
    this.filtroEspecie = '';
    this.filtroMetodo = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';

    this.aplicarFiltros();
  }

  abrirCadastroMonolito(): void {
    const dialogRef = this.dialog.open(FormMonolitoComponent, {
      width: '70vw',
      height: '85vh',
      maxWidth: '100vw',
      autoFocus: false,
      data: null,
      panelClass: 'dialog-monolito',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.carregarDadosIniciais();
      }
    });
  }

  excluirMonolito(monolito: Monolito): void {
    const confirmar = confirm(`Tem certeza que deseja excluir este monólito?`);
    if (!confirmar) return;

    this.monolitoService.deletar(monolito.id!).subscribe({
      next: () => {
        this.snackBar.open('Monólito excluído com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.carregarDadosIniciais();
      },
      error: () => {
        this.snackBar.open('Erro ao excluir o monólito.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }
}