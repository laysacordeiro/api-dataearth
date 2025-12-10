import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { EspecieComponent } from './pages/especies/especies.component';
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
    component: EspecieComponent
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];