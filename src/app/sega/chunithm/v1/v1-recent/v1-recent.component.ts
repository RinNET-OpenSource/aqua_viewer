import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {HttpParams} from '@angular/common/http';
import {V1PlayLog} from '../model/V1PlayLog';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ChuniMusic, Difficulty} from '../model/ChuniMusic';
import {environment} from '../../../../../environments/environment';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-v1-recent',
  templateUrl: './v1-recent.component.html',
  styleUrls: ['./v1-recent.component.css']
})
export class V1RecentComponent implements OnInit {

  host = environment.assetsHost;

  aimeId: string;

  recent: Observable<V1PlayLog[]>;
  difficulty = Difficulty;

  currentPage = 1;
  totalElements = 0;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    this.aimeId = String(this.auth.currentUserValue.extId);
    this.load(this.currentPage);
  }

  load(page: number) {
    const param = new HttpParams().set('aimeId', this.aimeId).set('page', String(page - 1));
    this.recent = this.api.get('api/game/chuni/v1/recent', param).pipe(
      tap(
        data => {
          this.totalElements = data.totalElements;
          this.currentPage = page;
        }
      ),
      map(
        data => {
          data.content.forEach(x => {
            this.dbService.getByID<ChuniMusic>('chuniMusic', x.musicId).subscribe(
              m => x.songInfo = m
            );
          });
          return data.content;
        },
        error => this.messageService.notice(error)
      )
    );
  }

}
