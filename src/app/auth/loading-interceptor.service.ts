import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private api: ApiService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.activeRequests === 0) {
      this.showLoader();
    }

    this.activeRequests++;

    return next.handle(req).pipe(
      finalize(() => {
        this.decrementActiveRequests();
      })
    );
  }

  private decrementActiveRequests(): void {
    this.activeRequests--;

    if (this.activeRequests === 0) {
      this.hideLoader();
    }
  }

  private showLoader(): void {
    this.api.show();
  }

  private hideLoader(): void {
    this.api.hide();
  }
}
