import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loadingState = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
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

  delete(path: string, params?: HttpParams, body?) {
    return this.http.delete<any>(this.getHost() + path, {params, body});
  }

  getHost(): string {
    return environment.apiServer;
  }

  show() {
    Promise.resolve().then(() => this.loadingSubject.next(true));
  }

  hide() {
    Promise.resolve().then(() => this.loadingSubject.next(false));
  }

}

export class Resp {
  status: string;
  data: object;
}

export interface LoadingState {
  show: boolean;
}
