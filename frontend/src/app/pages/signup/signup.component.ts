import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  submit() {
    if (this.signupForm.invalid) {
      this.snackBar.open('⚠️ Preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const { username, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.snackBar.open('⚠️ As senhas não coincidem.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    // 🔒 regra mantida
    const roles = ['ROLE_USER'];

    this.userService.register({ username, password, roles }).subscribe({
      next: (res) => {
        this.snackBar.open(res, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('❌ Erro ao registrar. Tente novamente.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  navigate() {
    this.router.navigate(['/login']);
  }
}