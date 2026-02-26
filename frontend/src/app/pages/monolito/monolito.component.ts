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
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../../components/mainpage-layout/layout.component';
import { FormMonolitoComponent } from './form-painel-monolito/form-painel-mono.component';
import { MonolitoService } from '../../services/monolito.service';
import { Monolito } from '../../models/monolito.model';

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
    LayoutComponent
  ],
})
export class MonolitoComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  itensPorPagina: number = 5;

  monolitos: Monolito[] = [];
  displayedColumns: string[] = ['station_field_number', 'sampling_number', 'metodo', 'collector', 'acoes'];
  dataSource = new MatTableDataSource<Monolito>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private monolitoService: MonolitoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarMonolitos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  alterarItensPorPagina() {
    if (this.paginator) {
      this.paginator._changePageSize(this.itensPorPagina);
    }
  }

  carregarMonolitos(): void {
    this.monolitoService.listar().subscribe({
      next: (data) => {
        this.monolitos = data;
        this.dataSource.data = data;
        this.aplicarFiltro({ target: { value: this.searchTerm } } as any);
      },
      error: (e) => console.error('Erro ao carregar monólitos:', e)
    });
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
      if (result === true) this.carregarMonolitos();
    });
  }

  excluirMonolito(monolito: Monolito): void {
    const confirmar = confirm(`Tem certeza que deseja excluir este monólito?`);
    if (!confirmar) return;

    this.monolitoService.deletar(monolito.id!).subscribe({
      next: () => {
        this.snackBar.open('Monólito excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarMonolitos();
      },
      error: () => {
        this.snackBar.open('Erro ao excluir o monólito.', 'Fechar', { duration: 3000 });
      }
    });
  }

  aplicarFiltro(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}