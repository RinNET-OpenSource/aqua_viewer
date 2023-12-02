import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {HttpParams} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {V1Character} from '../model/V1Character';
import {ChuniCharacter} from '../model/ChuniCharacter';
import {environment} from '../../../../../environments/environment';
import {ChuniSkill} from '../model/ChuniSkill';

@Component({
  selector: 'app-v1-character',
  templateUrl: './v1-character.component.html',
  styleUrls: ['./v1-character.component.css']
})
export class V1CharacterComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  aimeId: string;

  characters: Observable<V1Character[]>;

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
    this.aimeId = String(this.auth.currentAccountValue.currentCard);
    this.load(this.currentPage);
  }

  load(page: number) {
    const param = new HttpParams().set('aimeId', this.aimeId).set('page', String(page - 1));
    this.characters = this.api.get('api/game/chuni/v1/character', param).pipe(
      tap(
        data => {
          this.totalElements = data.totalElements;
          this.currentPage = page;
        }
      ),
      map(
        data => {
          data.content.forEach(x => {
            this.dbService.getByID<ChuniCharacter>('chuniCharacter', x.characterId).subscribe(
              m => x.characterInfo = m
            );
            this.dbService.getByID<ChuniSkill>('chuniSkill', x.skillId).subscribe(
              m => x.skillInfo = m
            );
          });
          return data.content;
        },
        error => this.messageService.notice(error)
      )
    );
  }

  levelUp(characterId: number, currentLevel: number) {
    this.api.post('api/game/chuni/v1/character', {
      aimeId: this.aimeId,
      characterId,
      level: currentLevel + 1
    }).subscribe(data => {
      this.load(this.currentPage);
    }, error => this.messageService.notice(error));
  }
}
