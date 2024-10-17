import {AccountService} from 'src/app/auth/account.service';
import {Injectable} from '@angular/core';
import {
  CanLoad,
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  Route,
  CanMatch,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanMatch, CanActivate {

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const currentUser = this.accountService.currentAccountValue;
    if (currentUser) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.accountService.currentAccountValue;
    if (currentUser) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

}
