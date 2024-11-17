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
import {ActivatedRoute, Router} from '@angular/router';
import { UserService } from 'src/app/user.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-v2-character',
  templateUrl: './v2-character.component.html',
  styleUrls: ['./v2-character.component.scss']
})
export class V2CharacterComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;
  searchControl = new FormControl('');

  aimeId: string;
  equippedCharaName: string;
  equippedCharaId: number;

  characters: Observable<V2Character[]>;
  allCharacters: Observable<V2Character[]>;

  currentPage = 1;
  pageSize = 12;
  totalElements = 0;
  math = Math;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    this.getEquippedCharaName();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
      this.load(this.currentPage);
    });
  }

  pageChanged(page: number) {
    this.router.navigate(['chuni/v2/character'], {queryParams: {page}});
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
      this.pageChanged(this.currentPage);
    }, error => this.messageService.notice(error));
  }

  load(page: number) {
    const pageParam = new HttpParams().set('aimeId', this.aimeId).set('size', this.pageSize).set('page', String(page - 1));
    this.allCharacters = this.api.get('api/game/chuni/v2/character', new HttpParams().set('aimeId', this.aimeId)).pipe();
    this.characters = this.api.get('api/game/chuni/v2/character', pageParam).pipe(
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
  handleErrorImg(e) {
    e.srcElement.src = 'https://rinnet.stehp.cn/assets/chuni/chara/CHU_UI_Character_0000_00_00.webp';
  }

  filterCharacter(searchValue: string) {
    if (searchValue) {
      console.log(this.allCharacters);
      this.allCharacters.subscribe((item) => {
        console.log(item);
      });
    }
  }
}
