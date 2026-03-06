import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LayoutComponent } from '../../components/mainpage-layout/layout.component';

@Component({
  standalone: true,
  selector: 'app-visitante',
  templateUrl: './visitante.component.html',
  styleUrls: ['./visitante.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LayoutComponent
  ]
})
export class VisitanteComponent implements OnInit {

  rotaAtiva: 'mainpage' | 'especies' = 'mainpage';
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
  }

  irParaMainpage(): void {
    this.router.navigate(['/mainpage']);
  }

  irParaEspecies(): void {
    this.router.navigate(['/especies']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}