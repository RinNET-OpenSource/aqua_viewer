import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {ChusanMusic, ChusanMusicLevelInfo, Difficulty} from '../model/ChusanMusic';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../../../../environments/environment';
import {HttpParams} from '@angular/common/http';
import {MessageService} from '../../../../message.service';
import {V2Record} from '../model/V2Record';

@Component({
  selector: 'app-v2-song-detail',
  templateUrl: './v2-song-detail.component.html',
  styleUrls: ['./v2-song-detail.component.css']
})
export class V2SongDetailComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  id: number;
  music: ChusanMusic;
  levels: ChusanMusicLevelInfo[] = [];
  difficulty = Difficulty;
  records: V2Record[] = [null, null, null, null, null];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const aimeId = String(this.auth.currentUserValue.extId);
    const param = new HttpParams().set('aimeId', String(aimeId));
    this.dbService.getByID<ChusanMusic>('chusanMusic', this.id).subscribe(x => {
      if (x) {
        this.music = x;
        for (const key of Object.keys(this.music.levels)) {
          if (this.music.levels[key].enable) {
            this.levels.push(this.music.levels[key]);
          }
        }
      }

    });
    this.api.get('api/game/chuni/v2/song/' + this.id, param).subscribe(
      data => {
        console.log(data);
        data.forEach(x => {
          this.records[x.level] = x;
        });
      },
      error => this.messageService.notice(error)
    );

  }

}
