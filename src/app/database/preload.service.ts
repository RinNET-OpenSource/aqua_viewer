import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ReplaySubject} from 'rxjs';
import {ApiService} from '../api.service';
import {DivaPv} from '../sega/diva/model/DivaPv';
import {ChuniMusic} from '../sega/chunithm/v1/model/ChuniMusic';
import {DivaModule} from '../sega/diva/model/DivaModule';
import {DivaCustomize} from '../sega/diva/model/DivaCustomize';
import {OngekiCard} from '../sega/ongeki/model/OngekiCard';
import {OngekiCharacter} from '../sega/ongeki/model/OngekiCharacter';
import {OngekiMusic} from '../sega/ongeki/model/OngekiMusic';
import {OngekiSkill} from '../sega/ongeki/model/OngekiSkill';
import {ChuniCharacter} from '../sega/chunithm/v1/model/ChuniCharacter';
import {ChuniSkill} from '../sega/chunithm/v1/model/ChuniSkill';

@Injectable({
  providedIn: 'root'
})
export class PreloadService {

  private divaPv = new ReplaySubject<string>();
  divaPvState = this.divaPv.asObservable();
  private divaModule = new ReplaySubject<string>();
  divaModuleState = this.divaModule.asObservable();
  private divaCustomize = new ReplaySubject<string>();
  divaCustomizeState = this.divaCustomize.asObservable();

  private chuniMusic = new ReplaySubject<string>();
  chuniMusicState = this.chuniMusic.asObservable();

  private ongekiCard = new ReplaySubject<string>();
  ongekiCardState = this.ongekiCard.asObservable();
  private ongekiCharacter = new ReplaySubject<string>();
  ongekiCharacterState = this.ongekiCharacter.asObservable();
  private ongekiMusic = new ReplaySubject<string>();
  ongekiMusicState = this.ongekiMusic.asObservable();
  private ongekiSkill = new ReplaySubject<string>();
  ongekiSkillState = this.ongekiSkill.asObservable();

  private chuniCharacter = new ReplaySubject<string>();
  chuniCharacterState = this.chuniCharacter.asObservable();
  private chuniSkill = new ReplaySubject<string>();
  chuniSkillState = this.chuniSkill.asObservable();

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService
  ) {
  }

  load() {
    this.loader<DivaPv>('divaPv', 'api/game/diva/data/musicList', this.divaPv);
    this.loader<DivaModule>('divaModule', 'api/game/diva/data/moduleList', this.divaModule);
    this.loader<DivaCustomize>('divaCustomize', 'api/game/diva/data/customizeList', this.divaCustomize);
    this.loader<ChuniMusic>('chuniMusic', 'api/game/chuni/v1/music', this.chuniMusic);
    this.loader<OngekiCard>('ongekiCard', 'api/game/ongeki/data/cardList', this.ongekiCard);
    this.loader<OngekiCharacter>('ongekiCharacter', 'api/game/ongeki/data/charaList', this.ongekiCharacter);
    this.loader<OngekiMusic>('ongekiMusic', 'api/game/ongeki/data/musicList', this.ongekiMusic);
    this.loader<OngekiSkill>('ongekiSkill', 'api/game/ongeki/data/skillList', this.ongekiSkill);
    this.loader<ChuniCharacter>('chuniCharacter', 'api/game/chuni/v1/data/character', this.chuniCharacter);
    this.loader<ChuniSkill>('chuniSkill', 'api/game/chuni/v1/data/skill', this.chuniSkill);
  }

  reload() {

  }

  loader<T>(storeName: string, url: string, status: ReplaySubject<string>) {
    this.dbService.count(storeName).subscribe(
      pageCount => {
        if (pageCount > 0) {
          status.next('OK');
        } else {
          status.next('Downloading');
          this.api.get(url).subscribe(
            data => {
              let errorFlag = false;
              data.forEach(x => {
                this.dbService.add<T>(storeName, x).subscribe(
                  () => '', error => {
                    console.error(error);
                    errorFlag = true;
                  }
                );
              });
              if (errorFlag) {
                status.next('Error');
              } else {
                status.next('OK');
              }
              status.complete();
            },
            error => {
              console.error(error);
              status.next('Error');
              status.complete();
            }
          );
        }
      });
  }
}
