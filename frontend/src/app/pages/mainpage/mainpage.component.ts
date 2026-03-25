import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../../services/user.service'; 
import { AuthService } from '../../services/auth.service'; 
import { LayoutComponent } from '../../components/mainpage-layout/layout.component';  
import { UserService } from '../../services/user.service';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../models/solicitacao.model';

@Component({
  standalone: true,
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss'],
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule, 
    LayoutComponent,
    // Módulos do Material
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
  ]
})
export class MainpageComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  itensPorPagina: number = 5;
  rotaAtiva: 'mainpage' | 'especies' = 'mainpage';
  isAdmin = false;

  usuarios: User[] = []; 
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  isLoading: boolean = true; 
  emailUsuario: string = 'Desconhecido';

  // Adições para solicitações
  solicitacoesPendentes: Solicitacao[] = [];
  solicitacoesAceitas: Solicitacao[] = [];
  solicitacoesNegadas: Solicitacao[] = [];
  
  statusMap: { [key: string]: string } = {
    'PENDING': 'Não verificado',
    'ACCEPTED': 'Aceito',
    'DENIED': 'Negado'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    public userService: UserService,
    private solicitacaoService: SolicitacaoService
  ) { }

  roleMap: any = {
    'ROLE_ADMIN': { label: 'Administrador', css: 'badge-red' }, 
    'ROLE_RESC':  { label: 'Pesquisador Cientifico', css: 'badge-blue' },
    'ROLE_USER':  { label: 'Visitante', css: 'badge-gray' }
  };

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    console.log('Admin detected:', this.isAdmin);
    this.carregarUsuarios();
    this.carregarSolicitacoes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  carregarSolicitacoes(): void {
    this.solicitacaoService.listarTodas().subscribe({
      next: (solicitacoes: Solicitacao[]) => {
        this.solicitacoesPendentes = solicitacoes.filter(s => s.status === 'PENDING');
        this.solicitacoesAceitas = solicitacoes.filter(s => s.status === 'ACCEPTED');
        this.solicitacoesNegadas = solicitacoes.filter(s => s.status === 'DENIED');
      },
      error: (err) => console.error('Erro ao carregar solicitações:', err)
    });
  }

  carregarUsuarios(): void {
    this.userService.listarTodos().subscribe({
      next: (usuarios: User[]) => {
        console.log('Dados recebidos da API:', usuarios);
        // Exibe apenas usuários que possuem um cargo atribuído (já foram aceitos ou são admins)
        const usuariosAceitos = usuarios.filter(u => u.roles && u.roles.length > 0);
        this.dataSource.data = usuariosAceitos;
        this.isLoading = false; 
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.isLoading = false;
      }
    });
  }

  irParaMainpage(): void {
    this.rotaAtiva = 'mainpage';
    this.router.navigate(['/mainpage']);
  }

  irParaEspecies(): void {
    this.rotaAtiva = 'especies';
    this.router.navigate(['/especies']);
  }

  isUserAdmin(user: User): boolean {
    return user.isAdmin;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  novoUsuario(): void {
    this.router.navigate(['/novo-usuario']); 
  }

  getRoleStyle(roleName: string) {
    return this.roleMap[roleName] || { label: roleName, css: 'badge-default' };
  }

  getStatusLabel(status: string): string {
    return this.statusMap[status] || status;
  }

  editar(usuario: User): void {
    console.log('Editar usuário', usuario);
    this.router.navigate(['/editar-usuario', usuario.id]); 
  }

  deletar(usuario: User): void {
    console.log('Deletar usuário', usuario);
  }
  
  aplicarFiltro(event: any): void {
    const filterValue = this.searchTerm;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

