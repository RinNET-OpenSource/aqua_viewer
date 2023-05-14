import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {PlayerPlaylog} from '../model/PlayerPlaylog';
import {HttpParams} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {OngekiMusic} from '../model/OngekiMusic';
import {AttributeType, BattleRank, Difficulty, TechnicalRank} from '../model/OngekiEnums';
import {OngekiCard} from '../model/OngekiCard';
import {OngekiCharacter} from '../model/OngekiCharacter';
import {end} from '@popperjs/core';

@Component({
  selector: 'app-ongeki-recent',
  templateUrl: './ongeki-recent.component.html',
  styleUrls: ['./ongeki-recent.component.css']
})
export class OngekiRecentComponent implements OnInit {

  protected readonly Math = Math;

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  aimeId: string;
  loading: boolean;
  recent: Observable<PlayerPlaylog[]>;
  difficulty = Difficulty;
  battleRank = BattleRank;
  technicalRank = TechnicalRank;
  attributeType = AttributeType;

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
    this.loading = true;
    this.load(this.currentPage);
  }

  load(page: number) {
    const param = new HttpParams().set('aimeId', this.aimeId).set('page', String(page - 1));
    this.recent = this.api.get('api/game/ongeki/recent', param).pipe(
      tap(
        data => {
          this.totalElements = data.totalElements;
          this.currentPage = page;
        }
      ),
      map(
        data => {
          data.content.forEach(x => {
            x.isTechNewRecord = x.techNewRecord ? x.techNewRecord : x.isTechNewRecord;
            x.isBattleNewRecord = x.battleNewRecord ? x.battleNewRecord : x.isBattleNewRecord;
            x.isOverDamageNewRecord = x.overDamageNewRecord ? x.overDamageNewRecord : x.isOverDamageNewRecord;
            x.isFullCombo = x.fullCombo ? x.fullCombo : x.isFullCombo;
            x.isAllBreak = x.allBreak ? x.allBreak : x.isAllBreak;
            x.isFullBell = x.fullBell ? x.fullBell : x.isFullBell;
            this.dbService.getByID<OngekiMusic>('ongekiMusic', x.musicId).subscribe(
              m => x.songInfo = m
            );
            this.dbService.getByID<OngekiCharacter>('ongekiCharacter', x.bossCharaId).subscribe(
              m => x.bossCharaInfo = m
            );
            this.dbService.getByID<OngekiCard>('ongekiCard', x.cardId1).subscribe(
              m => x.cardInfo1 = m
            );
            this.dbService.getByID<OngekiCard>('ongekiCard', x.cardId2).subscribe(
              m => x.cardInfo2 = m
            );
            this.dbService.getByID<OngekiCard>('ongekiCard', x.cardId3).subscribe(
              m => x.cardInfo3 = m
            );
          });
          this.loading = false;
          return data.content;
        },
        error => this.messageService.notice(error)
      )
    );
  }
}
