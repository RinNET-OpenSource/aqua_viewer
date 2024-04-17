import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {HttpParams} from '@angular/common/http';
import {V2PlayLog} from '../model/V2PlayLog';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ChusanMusic, Difficulty} from '../model/ChusanMusic';
import {environment} from '../../../../../environments/environment';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {V2SongScoreRankingComponent} from '../v2-song-score-ranking/v2-song-score-ranking.component';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-v2-recent',
  templateUrl: './v2-recent.component.html',
  styleUrls: ['./v2-recent.component.css']
})
export class V2RecentComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  aimeId: string;

  recent: Observable<V2PlayLog[]>;
  difficulty = Difficulty;

  currentPage = 1;
  totalElements = 0;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService,
    private offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    this.load(this.currentPage);
  }

  load(page: number) {
    const param = new HttpParams().set('aimeId', this.aimeId).set('page', String(page - 1));
    this.recent = this.api.get('api/game/chuni/v2/recent', param).pipe(
      tap(
        data => {
          this.totalElements = data.totalElements;
          this.currentPage = page;
        }
      ),
      map(
        data => {
          data.content.forEach(x => {
            this.dbService.getByID<ChusanMusic>('chusanMusic', x.musicId).subscribe(
              m => x.songInfo = m
            );
          });
          return data.content;
        },
        error => this.messageService.notice(error)
      )
    );
  }

  showDetail(music: ChusanMusic) {
    const offcanvasRef = this.offcanvasService.open(V2SongScoreRankingComponent, {
      position: 'end',
      scroll: false,
    });
    offcanvasRef.componentInstance.music = music;
  }
}
