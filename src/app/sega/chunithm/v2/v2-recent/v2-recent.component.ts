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
import {lastValueFrom, Observable} from 'rxjs';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {V2SongScoreRankingComponent} from '../v2-song-score-ranking/v2-song-score-ranking.component';
import {UserService} from 'src/app/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {load} from '@angular-devkit/build-angular/src/utils/server-rendering/esm-in-memory-file-loader';

@Component({
  selector: 'app-v2-recent',
  templateUrl: './v2-recent.component.html',
  styleUrls: ['./v2-recent.component.css']
})
export class V2RecentComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;
  loading: boolean;
  aimeId: string;
  id: number;
  musicName: string;
  level: number;

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
    public route: ActivatedRoute,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    this.loading = true;
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = Number(data.page);
      } else {
        this.currentPage = 1;
      }
      if (data.id && data.level) {
        this.id = Number(data.id);
        this.getMusicName(this.id);
        this.level = Number(data.level);
        if (this.level > 5){
          this.router.navigate(['chuni/v2/recent'], {queryParams: {}});
        }
      } else {
        this.id = null;
        this.musicName = null;
        this.level = null;
      }
      this.load(this.currentPage);
    });
  }

  load(page: number) {
    const param = new HttpParams().set('aimeId', this.aimeId).set('page', String(page - 1));

    let api;
    if (this.id && this.level) {
      api = `api/game/chuni/v2/song/${this.id}/${this.level}`;
    } else {
      api = 'api/game/chuni/v2/recent';
    }
    this.recent = this.api.get(api, param).pipe(
      tap(
        data => {
          this.totalElements = data.totalElements;
          this.currentPage = page;
          this.loading = false;
        }
      ),
      map(
        data => {
          data.content.forEach(x => {
            this.dbService.getByID<ChusanMusic>('chusanMusic', x.musicId).subscribe(
              m => x.songInfo = m
            );
            x.userPlayDate = new Date(x.userPlayDate);
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

  pageChanged(page: number) {
    this.router.navigate(['chuni/v2/recent'], {queryParams: {page, id: this.id, level: this.level}});
  }

  getFcLevel(item: V2PlayLog) {
    if (item.score === 1010000) {
      return 'AJC';
    } else if (item.isAllJustice) {
      return 'AJ';
    } else if (item.isFullCombo) {
      return 'FC';
    } else {
      return 'FC_Base';
    }
  }

  getMusicName(id: number) {
    this.dbService.getByID<ChusanMusic>('chusanMusic', id).subscribe({
      next: (data) => {
        if (data) {
          this.musicName = data.name;
        }
        else {
          this.musicName = `ID: ${id}`;
        }
      },
      error: error => {
        this.musicName = `ID: ${id}`;
      }
    });
  }
}
