import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanLoad, CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentAccountValue;
    if (!currentUser) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }

  canLoad(route: Route) {
    const currentUser = this.authenticationService.currentAccountValue;
    if (!currentUser) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
