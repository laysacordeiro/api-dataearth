import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../models/solicitacao.model';
import { LayoutComponent } from '../../components/mainpage-layout/layout.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-admin-solicitacoes',
  standalone: true,
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
  templateUrl: './admin-solicitacoes.component.html',
  styleUrls: ['./admin-solicitacoes.component.scss']
})
export class AdminSolicitacoesComponent implements OnInit, AfterViewInit {
  solicitacoes: Solicitacao[] = [];
  loading = true;
  itensPorPagina: number = 5;

  displayedColumns: string[] = ['email', 'cargo', 'data', 'acoes'];
  dataSource = new MatTableDataSource<Solicitacao>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.carregar();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  carregar(): void {
    this.loading = true;
    this.solicitacaoService.listarTodas().subscribe({
      next: (data) => {
        // Filtra apenas solicitações não processadas (PENDING)
        const pendentes = data.filter(sol => sol.status === 'PENDING');
        this.solicitacoes = pendentes;
        this.dataSource.data = pendentes;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('❌ Erro ao carregar solicitações.', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  aceitar(id: number): void {
    this.solicitacaoService.aceitar(id).subscribe({
      next: () => {
        this.snackBar.open('✅ Solicitação aceita. Email enviado ao usuário.', 'Fechar', { duration: 4000 });
        this.carregar();
      },
      error: () => this.snackBar.open('❌ Erro ao aceitar solicitação.', 'Fechar', { duration: 3000 })
    });
  }

  negar(id: number): void {
    this.solicitacaoService.negar(id).subscribe({
      next: () => {
        this.snackBar.open('🚫 Solicitação negada. Email enviado ao usuário.', 'Fechar', { duration: 4000 });
        this.carregar();
      },
      error: () => this.snackBar.open('❌ Erro ao negar solicitação.', 'Fechar', { duration: 3000 })
    });
  }

  roleLabel(role: string): string {
    return role === 'ROLE_RESC' ? 'Pesquisador' : 'Visitante';
  }
  alterarItensPorPagina() {
    if (this.paginator) this.paginator._changePageSize(this.itensPorPagina);
  }
}
