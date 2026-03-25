import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/mainpage-layout/layout.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [CommonModule, LayoutComponent]
})
export class WelcomeComponent {
  constructor(private router: Router) { }

  irParaEspecies() {
    this.router.navigate(['/especies']);
  }

  irParaMonolito() {
    this.router.navigate(['/monolitos']);
  }

  irParaParcelas() {
    this.router.navigate(['/parcelas']);
  }
}
