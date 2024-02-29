import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {environment} from 'src/environments/environment';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(public auth: AuthenticationService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      request.url.startsWith(environment.apiServer) &&
      this.auth.currentAccountValue &&
      this.auth.currentAccountValue.tokenType &&
      this.auth.currentAccountValue.accessToken){
      request = request.clone({
        setHeaders: {
          Authorization: `${this.auth.currentAccountValue.tokenType} ${this.auth.currentAccountValue.accessToken}`
        }
      });
    }
    return next.handle(request);
  }
}
