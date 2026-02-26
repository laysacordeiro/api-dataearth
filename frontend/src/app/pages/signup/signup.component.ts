import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { ReactiveFormsModule, Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  providers: [SignupService],
  imports: [
    ReactiveFormsModule,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;

  constructor(
    private router: Router,
    private signupService: SignupService,
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
        verticalPosition: 'top',
        panelClass: ['custom-snackbar']
      });
      return;
    }

    const { username, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.snackBar.open('⚠️ As senhas não coincidem.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['custom-snackbar']
      });
      return;
    }
    const roles = ['ROLE_USER'];
    this.userService.RegisterUser({ username, password, roles }).subscribe({
        next: (res) => {
      this.snackBar.open(res, 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['custom-snackbar']
      });
      this.router.navigate(['/forum']);
    },
      error: (err) => {
        console.error(err);
        this.snackBar.open('❌ Erro ao registrar. Tente novamente.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['custom-snackbar']
        });
      }
    });
  }

  navigate() {
    this.router.navigate(["/login"]);
  }
}