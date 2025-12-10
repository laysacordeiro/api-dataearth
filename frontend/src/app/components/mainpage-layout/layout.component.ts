import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  rotaAtiva: 'mainpage' | 'especies' = 'mainpage';

  constructor(
      private authService: AuthService, 
      private router: Router 
    ) { }

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
}
