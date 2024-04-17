import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {V2PlayLog} from '../model/V2PlayLog';
import {HttpParams} from '@angular/common/http';
import {ChusanMusic, Difficulty} from '../model/ChusanMusic';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ActivatedRoute} from '@angular/router';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-v2-song-playlog',
  templateUrl: './v2-song-playlog.component.html',
  styleUrls: ['./v2-song-playlog.component.css']
})
export class V2SongPlaylogComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  id: number;
  level: number;
  records: V2PlayLog[] = [];
  songInfo: ChusanMusic;
  difficulty = Difficulty;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.level = Number(this.route.snapshot.paramMap.get('level'));
    const aimeId = String(this.userService.currentUser.defaultCard.extId);
    const param = new HttpParams().set('aimeId', aimeId);
    this.api.get('api/game/chuni/v2/song/' + this.id + '/' + this.level, param).subscribe(
      data => {
        data.forEach(x => {
          this.records.push(x);
        });
      },
      error => this.messageService.notice(error)
    );
    this.dbService.getByID<ChusanMusic>('chusanMusic', this.id).subscribe(
      m => this.songInfo = m
    );
  }

}
