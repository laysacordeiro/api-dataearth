import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(): boolean {
    const token = this.userService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const isAdmin = this.userService.hasRole('ROLE_ADMIN');
    const isResc = this.userService.hasRole('ROLE_RESC');
    if (isAdmin || isResc) {
      return true;
    }

    this.router.navigate(['/forbidden']);
    return false;
  }
}

