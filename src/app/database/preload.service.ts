import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ReplaySubject } from 'rxjs';
import { ApiService } from '../api.service';
import { OngekiCard } from '../sega/ongeki/model/OngekiCard';
import { OngekiCharacter } from '../sega/ongeki/model/OngekiCharacter';
import { OngekiMusic } from '../sega/ongeki/model/OngekiMusic';
import { OngekiSkill } from '../sega/ongeki/model/OngekiSkill';
import { ChusanMusic } from '../sega/chunithm/v2/model/ChusanMusic';
import { ChusanCharacter } from '../sega/chunithm/v2/model/ChusanCharacter';
import { ChusanTrophy } from '../sega/chunithm/v2/model/ChusanTrophy';
import { ChusanNamePlate } from '../sega/chunithm/v2/model/ChusanNamePlate';
import { ChusanSystemVoice } from '../sega/chunithm/v2/model/ChusanSystemVoice';
import { ChusanMapIcon } from '../sega/chunithm/v2/model/ChusanMapIcon';
import { ChusanFrame } from '../sega/chunithm/v2/model/ChusanFrame';
import { ChusanAvatarAcc } from '../sega/chunithm/v2/model/ChusanAvatarAcc';
import { OngekiRival } from '../sega/ongeki/model/OngekiRival';
import { HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PreloadService {
  private ongekiCard = new ReplaySubject<string>();
  ongekiCardState = this.ongekiCard.asObservable();
  private ongekiCharacter = new ReplaySubject<string>();
  ongekiCharacterState = this.ongekiCharacter.asObservable();
  private ongekiMusic = new ReplaySubject<string>();
  ongekiMusicState = this.ongekiMusic.asObservable();
  private ongekiSkill = new ReplaySubject<string>();
  ongekiSkillState = this.ongekiSkill.asObservable();

  private chusanMusic = new ReplaySubject<string>();
  chusanMusicState = this.chusanMusic.asObservable();
  private chusanCharacter = new ReplaySubject<string>();
  chusanCharacterState = this.chusanCharacter.asObservable();
  private chusanTrophy = new ReplaySubject<string>();
  chusanTrophyState = this.chusanTrophy.asObservable();
  private chusanNamePlate = new ReplaySubject<string>();
  chusanNamePlateState = this.chusanNamePlate.asObservable();
  private chusanSystemVoice = new ReplaySubject<string>();
  chusanSystemVoiceState = this.chusanSystemVoice.asObservable();
  private chusanMapIcon = new ReplaySubject<string>();
  chusanMapIconState = this.chusanMapIcon.asObservable();
  private chusanFrame = new ReplaySubject<string>();
  chusanFrameState = this.chusanFrame.asObservable();
  private chusanAvatarAcc = new ReplaySubject<string>();
  chusanAvatarAccState = this.chusanAvatarAcc.asObservable();

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private auth: AuthenticationService,
  ) {
  }

  load() {
    const aimeId = String(this.auth.currentAccountValue.currentCard);
    const param = aimeId.trim().length != 0 ? new HttpParams().set('aimeId', aimeId) : undefined;

    this.loader<OngekiCard>('ongekiCard', 'api/game/ongeki/data/cardList', this.ongekiCard);
    this.loader<OngekiCharacter>('ongekiCharacter', 'api/game/ongeki/data/charaList', this.ongekiCharacter);
    this.loader<OngekiMusic>('ongekiMusic', 'api/game/ongeki/data/musicList', this.ongekiMusic);
    this.loader<OngekiSkill>('ongekiSkill', 'api/game/ongeki/data/skillList', this.ongekiSkill);
    this.loader<ChusanMusic>('chusanMusic', 'api/game/chuni/v2/data/music', this.chusanMusic);
    this.loader<ChusanCharacter>('chusanCharacter', 'api/game/chuni/v2/data/character', this.chusanCharacter);
    this.loader<ChusanTrophy>('chusanTrophy', 'api/game/chuni/v2/data/trophy', this.chusanTrophy);
    this.loader<ChusanNamePlate>('chusanNamePlate', 'api/game/chuni/v2/data/nameplate', this.chusanNamePlate);
    this.loader<ChusanSystemVoice>('chusanSystemVoice', 'api/game/chuni/v2/data/sysvoice', this.chusanSystemVoice);
    this.loader<ChusanMapIcon>('chusanMapIcon', 'api/game/chuni/v2/data/mapicon', this.chusanMapIcon);
    this.loader<ChusanFrame>('chusanFrame', 'api/game/chuni/v2/data/frame', this.chusanFrame);
    this.loader<ChusanAvatarAcc>('chusanAvatarAcc', 'api/game/chuni/v2/data/avatar', this.chusanAvatarAcc);
  }

  reload() {

  }

  loader<T>(storeName: string, url: string, status: ReplaySubject<string>, param?: HttpParams) {
    this.dbService.count(storeName).subscribe(
      pageCount => {
        if (pageCount > 0) {
          //table is avaliable.
          status.next('OK');
        } else {
          //test if table is avaliable.
          let callback = (error?: any) => {
            if (error != null) {
              status.next('Error');
              console.error(error);
            } else
              status.next('OK');

            status.complete();
          }

          //fetch data and add into DB.
          status.next('Downloading');
          this.api.get(url, param).subscribe(
            data => this.dbService.bulkAdd<T>(storeName, data).subscribe(() => callback(), error => callback(error)),
            error => callback(error)
          );
        }
      });
  }
}
