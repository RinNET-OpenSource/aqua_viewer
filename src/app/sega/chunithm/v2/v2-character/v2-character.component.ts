import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {HttpParams} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {V2Profile} from '../model/V2Profile';
import {V2Character} from '../model/V2Character';
import {ChusanCharacter} from '../model/ChusanCharacter';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-v2-character',
  templateUrl: './v2-character.component.html',
  styleUrls: ['./v2-character.component.css']
})
export class V2CharacterComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  aimeId: string;
  equippedCharaName: string;
  equippedCharaId: number;

  characters: Observable<V2Character[]>;

  currentPage = 1;
  totalElements = 0;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
    this.aimeId = String(this.auth.currentUserValue.extId);
    this.getEquippedCharaName();
  }

  ngOnInit() {
    this.load(this.currentPage);
  }

  load(page: number) {
    const param = new HttpParams().set('aimeId', this.aimeId).set('page', String(page - 1));
    this.characters = this.api.get('api/game/chuni/v2/character', param).pipe(
      tap(
        data => {
          this.totalElements = data.totalElements;
          this.currentPage = page;
        }
      ),
      map(
        data => {
          data.content.forEach(x => {
            this.dbService.getByID<ChusanCharacter>('chusanCharacter', x.characterId).subscribe(
              m => x.characterInfo = m
            );
          });
          return data.content;
        },
        error => this.messageService.notice(error)
      )
    );
  }

  getEquippedCharaName() {
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/chuni/v2/profile', param).subscribe(
      data => {
        this.dbService.getByID<ChusanCharacter>('chusanCharacter', data.characterId).subscribe(
          m => this.equippedCharaName = m.name
        );
        this.equippedCharaId = data.characterId;
      },
      error => this.messageService.notice(error)
    );
    
  }

  levelUp(characterId: number, currentLevel: number) {
    this.api.post('api/game/chuni/v2/character', {
      aimeId: this.aimeId,
      characterId,
      level: currentLevel + 1
    }).subscribe(data => {
      this.load(this.currentPage);
    }, error => this.messageService.notice(error));
  }
}
