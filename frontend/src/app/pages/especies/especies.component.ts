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
import { FormTaxonomiaComponent } from './form-taxonomia/form-taxonomia.component';
import { EspecieService } from '../../services/especie.service';
import { Especie } from '../../models/especie.model';
import { RouterModule } from '@angular/router';
import { FormEspecieComponent } from './form-especie/form-especie.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormEditarEspecieComponent } from './form-editar-especie/form-editar-especie.component';
import { LayoutComponent } from '../../components/mainpage-layout/layout.component';

@Component({
  selector: 'app-especies',
  standalone: true,
  templateUrl: "./especies.component.html",
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
    LayoutComponent
  ],
})
export class EspecieComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  itensPorPagina: number = 5;
  rotaAtiva: string = 'especies';

  especies: Especie[] = [];
  displayedColumns: string[] = ['nome', 'nomeCientifico', 'ano', 'acoes'];
  dataSource = new MatTableDataSource<Especie>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private especieService: EspecieService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarEspecies();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Alterar itens por página
  alterarItensPorPagina() {
    if (this.paginator) {
      this.paginator._changePageSize(this.itensPorPagina); // 🔹 atualiza corretamente
    }
  }

  carregarEspecies(): void {
    this.especieService.listar().subscribe({
      next: (data) => {
        this.especies = data;
        this.dataSource.data = data;
        this.aplicarFiltro({ target: { value: this.searchTerm } } as any);
      },
      error: (e) => {
        console.error('Erro ao carregar espécies:', e);
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

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) this.carregarEspecies();
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

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.snackBar.open('Espécie atualizada com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarEspecies();
      }
    });
  }

  excluirEspecie(especie: Especie): void {
    const confirmar = confirm(`Tem certeza que deseja excluir a espécie "${especie.nome}"?`);
    if (!confirmar) return;

    this.especieService.deletar(especie.id!).subscribe({
      next: () => {
        this.snackBar.open('Espécie excluída com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarEspecies();
      },
      error: (erro) => {
        console.error('Erro ao excluir espécie:', erro);
        this.snackBar.open('Erro ao excluir a espécie.', 'Fechar', { duration: 3000 });
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

  // Navegação
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
