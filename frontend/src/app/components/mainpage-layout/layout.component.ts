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
  ) {}

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

  irParaMonolito(): void {
    this.router.navigate(['/monolitos']);
  }

  logout() {
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}