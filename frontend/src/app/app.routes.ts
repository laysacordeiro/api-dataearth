import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { EspecieComponent } from './pages/especies/especies.component';
import { AuthGuard } from './auth.guard';
import { VisitanteComponent } from './pages/visitante/visitante.component';
import { MonolitoComponent } from './pages/monolito/monolito.component';
export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'signup', 
    component: SignupComponent 
  },
  {
    path: 'mainpage',
    component: MainpageComponent
  },
  {
    path: 'especies',
    component: EspecieComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'visitante',
    component: VisitanteComponent
  },
  {
    path: 'monolito',
    component: MonolitoComponent
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];