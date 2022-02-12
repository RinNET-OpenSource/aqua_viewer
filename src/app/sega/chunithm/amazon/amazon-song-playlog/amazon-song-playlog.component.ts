import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {AmazonPlayLog} from '../model/AmazonPlayLog';
import {HttpParams} from '@angular/common/http';
import {ChuniMusic, Difficulty} from '../model/ChuniMusic';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-amazon-song-playlog',
  templateUrl: './amazon-song-playlog.component.html',
  styleUrls: ['./amazon-song-playlog.component.css']
})
export class AmazonSongPlaylogComponent implements OnInit {

  host = environment.assetsHost;

  id: number;
  level: number;
  records: AmazonPlayLog[] = [];
  songInfo: ChuniMusic;
  difficulty = Difficulty;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.level = Number(this.route.snapshot.paramMap.get('level'));
    const aimeId = String(this.auth.currentUserValue.extId);
    const param = new HttpParams().set('aimeId', aimeId);
    this.api.get('api/game/chuni/amazon/song/' + this.id + '/' + this.level, param).subscribe(
      data => {
        data.forEach(x => {
          this.records.push(x);
        });
      },
      error => this.messageService.notice(error)
    );
    this.dbService.getByID<ChuniMusic>('chuniMusic', this.id).subscribe(
      m => this.songInfo = m
    );
  }

}
