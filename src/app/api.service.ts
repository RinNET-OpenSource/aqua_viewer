import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from './auth/authentication.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loadingSubject = new Subject<LoadingState>();
  loadingState = this.loadingSubject.asObservable();

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) {
  }

  get(path: string, params?: HttpParams) {
    return this.http.get<any>(this.getHost() + path, {params});
  }

  post(path: string, data?: object, params?: HttpParams) {
    return this.http.post<any>(this.getHost() + path, data, {params});
  }

  put(path: string, data?: object, params?: HttpParams) {
    return this.http.put<any>(this.getHost() + path, data, {params});
  }

  delete(path: string, params?: HttpParams) {
    return this.http.delete<any>(this.getHost() + path, {params});
  }

  getHost(): string {
    if (this.authenticationService.currentUserValue) {
      return this.authenticationService.currentUserValue.apiServer + '/';
    }
    return 'http://ea.naominet.live:80' + '/';
  }

  show() {
    this.loadingSubject.next({show: true});
  }

  hide() {
    this.loadingSubject.next({show: false});
  }

}

export class Resp {
  status: string;
  data: object;
}

export interface LoadingState {
  show: boolean;
}
