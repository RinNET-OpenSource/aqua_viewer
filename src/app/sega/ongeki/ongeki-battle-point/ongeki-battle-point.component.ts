import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {HttpParams} from '@angular/common/http';
import {PlayerRatingItem} from '../model/PlayerRatingItem';
import {OngekiMusic} from '../model/OngekiMusic';
import {environment} from '../../../../environments/environment';
import {PropertyEntry} from '../../../model/PropertyEntry';
import {AttributeType, Difficulty} from '../model/OngekiEnums';
import {OngekiCard} from '../model/OngekiCard';
import {DisplayOngekiProfile} from '../model/OngekiProfile';

@Component({
  selector: 'app-ongeki-battle-point',
  templateUrl: './ongeki-battle-point.component.html',
  styleUrls: ['./ongeki-battle-point.component.css']
})
export class OngekiBattlePointComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  aimeId = '';

  profile: DisplayOngekiProfile;

  bPList: PlayerRatingItem[] = [];

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
    this.aimeId = String(this.auth.currentAccountValue.currentCard);
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/ongeki/profile', param).subscribe(
      data => this.profile = data,
      error => this.messageService.notice(error)
    );
    this.load();
  }

  load() {
    const param = new HttpParams().set('aimeId', this.aimeId).set('key', 'battle_point_base');
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
              x => {
                item.musicInfo = x;
                this.dbService.getByID<OngekiCard>('ongekiCard', item.musicInfo.bossCardId)
                  .subscribe(y => item.bossCardInfo = y);
              }
            );
            this.bPList.push(item);
          });
        }
      }
    );
  }
}
