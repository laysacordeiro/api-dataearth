import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Usuario } from '../../services/auth.service'; 
import { AuthService } from '../../services/auth.service'; 
import { LayoutComponent } from '../../components/mainpage-layout/layout.component';  


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
export class MainpageComponent implements OnInit {
  searchTerm: string = '';
  itensPorPagina: number = 5;
  rotaAtiva: 'mainpage' | 'especies' = 'mainpage';

  usuarios: Usuario[] = []; 
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>([]);
  isLoading: boolean = true; 
  emailUsuario: string = 'Desconhecido';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authService: AuthService, 
    private router: Router 
  ) { }

  ngOnInit() {
    this.emailUsuario = this.authService.getUserEmail() || 'Desconhecido';
    
    this.authService.listarTodos().subscribe(data => {
        this.dataSource.data = data;
    });
  }

  carregarUsuarios(): void {
    this.authService.listarTodos().subscribe({
      next: (usuarios: Usuario[]) => {
        console.log('Dados recebidos da API:', usuarios);
        this.dataSource.data = usuarios;
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
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  novoUsuario(): void {
    this.router.navigate(['/novo-usuario']); 
  }

  editar(usuario: Usuario): void {
    console.log('Editar usuário', usuario);
    this.router.navigate(['/editar-usuario', usuario.id]); 
  }

  deletar(usuario: Usuario): void {
    console.log('Deletar usuário', usuario);
  }
  
  aplicarFiltro(event: any): void {
    const filterValue = this.searchTerm;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}