import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { EspecieComponent } from './pages/especies/especies.component';
import { VisitanteComponent } from './pages/visitante/visitante.component';
import { MonolitoComponent } from './pages/monolito/monolito.component';

import { AuthGuard } from './auth.guard';
import { AdminSolicitacoesComponent } from './pages/admin-solicitacoes/admin-solicitacoes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Públicas
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Protegidas (tudo direto, sem layout pai)
  { path: 'mainpage', component: MainpageComponent, canActivate: [AuthGuard] },
  { path: 'especies', component: EspecieComponent, canActivate: [AuthGuard] },
  { path: 'monolitos', component: MonolitoComponent, canActivate: [AuthGuard] },
  { path: 'visitante', component: VisitanteComponent, canActivate: [AuthGuard] },
  { path: 'admin/solicitacoes', component: AdminSolicitacoesComponent, canActivate: [AuthGuard] },
  // fallback
  { path: '**', redirectTo: '/login' }
];