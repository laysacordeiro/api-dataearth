import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { ReactiveFormsModule, Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private loginService: LoginService, private userService: UserService, private snackBar: MatSnackBar) {
     this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required]]
    });
  }

   submit() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Coloque os dados corretamente!', 'Close', { duration: 3000 });
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password }).subscribe({
      next: (res) => {
        this.authService.setToken(res.token); // ✅ salva só o JWT puro
        this.router.navigate(['/mainpage']);
        
        if (this.authService.hasRole('ROLE_USER')) {
          this.router.navigate(['/visitante']);
        } else if (
          this.authService.hasRole('ROLE_RESC') ||
          this.authService.hasRole('ROLE_ADMIN')
        ) {
          this.router.navigate(['/mainpage']);
        }

        this.snackBar.open('Sucesso!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Usuário ou senha inválidos', 'Close', { duration: 3000 });
      }
    });
  }

  navigate() {
    console.log('=== NAVIGATE CHAMADO ===');
    console.log('Tentando navegar para /signup...');

    this.router.navigate(['/signup']).then(
      (success) => {
        console.log('Navegação para signup bem-sucedida:', success);
      },
      (error) => {
        console.error('Erro na navegação para signup:', error);
      }
    );
  }
}

