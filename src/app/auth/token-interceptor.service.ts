import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {AccountService} from './account.service';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private accountService: AccountService) {
    }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      request.url.startsWith(environment.apiServer) &&
      this.accountService.currentAccountValue &&
      this.accountService.currentAccountValue.tokenType &&
      this.accountService.currentAccountValue.accessToken){
      request = request.clone({
        setHeaders: {
          Authorization: `${this.accountService.currentAccountValue.tokenType} ${this.accountService.currentAccountValue.accessToken}`
        }
      });
    }
    return next.handle(request);
  }
}
