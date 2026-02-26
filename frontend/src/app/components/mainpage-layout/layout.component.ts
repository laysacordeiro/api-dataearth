import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [CommonModule]
})
export class LayoutComponent {
  rotaAtiva: 'mainpage' | 'especies' = 'mainpage';
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public userService: UserService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isAdmin = this.userService.getIsAdmin();
      console.log('Admin detected:', this.isAdmin);
    }, 0);
  }
  irParaMainpage(): void {
    this.rotaAtiva = 'mainpage';
    this.router.navigate(['/mainpage']);
  }

  irParaEspecies(): void {
    this.rotaAtiva = 'especies';
    this.router.navigate(['/especies']);
  }
  irParaPainelAdmin(): void {
    this.router.navigate(['/paineladmin']);
  }
  irParaVisitante(): void {
    this.router.navigate(['/visitante']);
  }
  irParaMonolito(): void {
    this.router.navigate(['/monolito']);
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
