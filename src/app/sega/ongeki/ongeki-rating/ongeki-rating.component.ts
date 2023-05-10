import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../../../environments/environment';
import {PlayerRatingItem} from '../model/PlayerRatingItem';
import {AttributeType, Difficulty} from '../model/OngekiEnums';
import {HttpParams} from '@angular/common/http';
import {PropertyEntry} from '../../../model/PropertyEntry';
import {OngekiMusic} from '../model/OngekiMusic';
import {DisplayOngekiProfile} from '../model/OngekiProfile';

@Component({
  selector: 'app-ongeki-rating',
  templateUrl: './ongeki-rating.component.html',
  styleUrls: ['./ongeki-rating.component.css']
})
export class OngekiRatingComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  aimeId = '';

  profile: DisplayOngekiProfile;

  bestList: PlayerRatingItem[] = [];
  nextList: PlayerRatingItem[] = [];
  newBestList: PlayerRatingItem[] = [];
  newNextList: PlayerRatingItem[] = [];
  hotBestList: PlayerRatingItem[] = [];
  hotNextList: PlayerRatingItem[] = [];

  allArray = [this.bestList, this.nextList, this.newBestList, this.newNextList, this.hotBestList, this.hotNextList];

  difficulty = Difficulty;
  attribute = AttributeType;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    this.aimeId = String(this.auth.currentUserValue.extId);
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/ongeki/profile', param).subscribe(
      data => this.profile = data,
      error => this.messageService.notice(error)
    );
    this.load('rating_base_best', this.bestList);
    this.load('rating_base_next', this.nextList);
    this.load('rating_base_new_best', this.newBestList);
    this.load('rating_base_new_next', this.newNextList);
    this.load('rating_base_hot_best', this.hotBestList);
    this.load('rating_base_hot_next', this.hotNextList);
  }

  load(key: string, list: PlayerRatingItem[]) {
    const param = new HttpParams().set('aimeId', this.aimeId).set('key', key);
    this.api.get('api/game/ongeki/general', param).subscribe(
      (data: PropertyEntry) => {
        if (data.propertyValue.indexOf(',') < 0) {
          this.messageService.notice('Can\'t read battle data. Please save again in-game');
        } else {
          const records = data.propertyValue.split(',');
          records.forEach(record => {
            const value = record.split(':');
            const item: PlayerRatingItem = {
              musicId: Number(value[0]),
              level: Number(value[1]),
              value: Number(value[2]),
            };
            this.dbService.getByID<OngekiMusic>('ongekiMusic', item.musicId).subscribe(
              x => item.musicInfo = x
            );
            list.push(item);
          });
        }
      }
    );
  }
}
