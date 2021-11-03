import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  static isLoggedIn() {
    return !!AuthGuard.getToken();
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  constructor(
    private route: Router,
  ) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('in authguard');
    if (AuthGuard.isLoggedIn()) {
      return true;
    }
    this.route.navigate(['/login']);
    return false;
  }
}
