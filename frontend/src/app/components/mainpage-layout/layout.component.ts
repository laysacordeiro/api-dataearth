import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [CommonModule, RouterOutlet]
})
export class LayoutComponent {
  rotaAtiva: 'mainpage' | 'especies' = 'mainpage';
  isAdmin = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
  }

  irParaMainpage() {
    this.router.navigate(['/mainpage']);
  }

  irParaEspecies() {
    this.router.navigate(['/especies']);
  }

  irParaPainelAdmin() {
    this.router.navigate(['/paineladmin']);
  }

  irParaVisitante() {
    this.router.navigate(['/visitante']);
  }

  irParaWelcome() {
    this.router.navigate(['/welcome']);
  }

  irParaMonolito(): void {
    this.router.navigate(['/monolitos']);
  }
  irParaSolicitacoes() {
    this.router.navigate(['/admin/solicitacoes']);
  }
  irParaParcelas() {
    this.router.navigate(['/parcelas']);
  }
  logout() {
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}