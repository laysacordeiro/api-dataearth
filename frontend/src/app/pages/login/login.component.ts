import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private router: Router, private authService: AuthService, private loginService: LoginService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });  
  }

  submit() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    this.loginService.login(email, password).subscribe({
      next: () => {
        alert("Login realizado com sucesso!");
        this.authService.setUserEmail(email);
        this.router.navigate(['/mainpage'], { state: { email } });
      },
      error: () => {
        alert("Credenciais inválidas. Tente novamente.");
      }
    });
  } else {
    alert("Preencha todos os campos corretamente.");
  }
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
