import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {HttpParams} from '@angular/common/http';
import {AuthenticationService} from '../../auth/authentication.service';
import {DivaProfile} from './model/DivaProfile';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DivaMylistService {

  profile: DivaProfile;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
  ) {
  }

  getProfile() {
    const pdId = String(this.auth.currentAccountValue.extId);
    const param = new HttpParams().set('pdId', pdId);
    return this.api.get('api/game/diva/playerInfo', param);
  }

  addMyList(listId: number, pvId: number): Observable<DivaProfile> {
    return new Observable<DivaProfile>((observer) => {
      this.getProfile().subscribe(
        data => {
          this.profile = data;
          observer.next(this.profile);
          observer.complete();
        },
        error => observer.error(new Error('Get profile fail'))
      );
    });
  }
}
