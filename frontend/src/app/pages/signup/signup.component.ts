import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

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
    private signupService: SignupService
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  submit() {
  if (this.signupForm.valid) {
    const { name, email, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    this.signupService.signup(name, email, password).subscribe({
      next: () => {
        alert("Conta criada com sucesso!");
        this.signupForm.reset(); // limpa todos os campos
        this.router.navigate(["/login"]); // redireciona
      },
      error: () => {
        alert("Erro ao criar conta. Tente novamente.");
      }
    });
  } else {
    alert("Preencha todos os campos corretamente.");
  }
}

  navigate() {
    this.router.navigate(["/login"]);
  }
}