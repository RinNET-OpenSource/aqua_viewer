import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {HttpParams} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {combineLatest, lastValueFrom, Observable, startWith} from 'rxjs';
import {V2Profile} from '../model/V2Profile';
import {V2Character} from '../model/V2Character';
import {ChusanCharacter} from '../model/ChusanCharacter';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import { UserService } from 'src/app/user.service';
import {FormControl} from '@angular/forms';
import {OngekiCard} from '../../../ongeki/model/OngekiCard';
import {OngekiSkill} from '../../../ongeki/model/OngekiSkill';
import {PlayerCard} from '../../../ongeki/model/PlayerCard';
import {OngekiCharacter} from '../../../ongeki/model/OngekiCharacter';

@Component({
  selector: 'app-v2-character',
  templateUrl: './v2-character.component.html',
  styleUrls: ['./v2-character.component.scss']
})
export class V2CharacterComponent implements OnInit {

  loading = true;
  host = environment.assetsHost;
  enableImages = environment.enableImages;
  searchControl = new FormControl('');

  aimeId: string;
  equippedCharaName: string;
  equippedCharaId: number;

  allCharacters: ChusanCharacter[];
  characterIds: number[];
  filteredIds: number[];
  characterList: Observable<V2Character[]>;

  currentPage = 1;
  pageSize = 12;
  totalElements = 0;
  math = Math;

  searchTermControl = new FormControl('');

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

  async ngOnInit() {
    await this.prepare();
    combineLatest([
      this.route.queryParams.pipe(startWith({page: 1})),
      this.searchTermControl.valueChanges.pipe(startWith('')),
    ]).subscribe(([queryParams, searchTerm]) => {
      this.filteredIds = this.filterCharacter(false, searchTerm);
      this.totalElements = this.filteredIds.length;
      if (queryParams.page){
        this.currentPage = queryParams.page;
      }
      this.load(this.currentPage);
    });

  }

  async prepare() {
    this.allCharacters = await lastValueFrom(this.dbService.getAll<ChusanCharacter>('chusanCharacter'));
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.characterIds = await lastValueFrom(this.api.get('api/game/chuni/v2/charaIds', param));
  }

  load(page: number) {
    const pageSize = 12;
    const start = Math.min((page - 1) * pageSize, this.filteredIds.length);
    const end = Math.min(start + pageSize, this.filteredIds.length);
    const pageIds = this.filteredIds.slice(start, end);
    const acquiredPageIds = pageIds.filter(id => this.characterIds.includes(id));
    const characterIdsParam = acquiredPageIds.join(',');
    const params = new HttpParams().set('charaIds', characterIdsParam).set('aimeId', this.aimeId);
    this.characterList = this.api.get('api/game/chuni/v2/charaInfos', params).pipe(
      tap(
        data => {
          this.currentPage = page;
        }
      ),
      map(
        data =>  {
          const content: V2Character[] = data;
          const characters = pageIds.map(id => {
            let character: V2Character = content.find(c => c.characterId === id);
            if (!character) {
              character = {
                characterId: id,
                playCount: 0,
                level: 0,
                friendshipExp: 0,
                isValid: true,
                isNewMark: false,
                exMaxLv: 0,
                assignIllust: 0,
                param1: '0',
                param2: '0',
                characterInfo: undefined
              };
            }
            return character;
          });

          characters.forEach(x => {
            this.dbService.getByID<ChusanCharacter>('chusanCharacter', x.characterId).subscribe(y => { x.characterInfo = y; });
          });
          this.loading = false;
          return characters;
        },
        error => this.messageService.notice(error)
      )
    );
  }

  filterCharacter(showAll: boolean, searchTerm: string){
    let filteredIds;

    if (!showAll){
      filteredIds = this.characterIds;
    }
    else{
      filteredIds = this.allCharacters.map(c => c.id);
    }

    const terms = this.parseSearchTerms(searchTerm.toLowerCase());
    filteredIds = filteredIds.filter(id => this.filterCharacterByTerms(id, terms));

    return filteredIds;
  }

  private filterCharacterByTerms(id, terms: string[]) {
    const character = this.allCharacters.find(c => c.id === id);
    if (!character) {
      return false;
    }
    const charaName = character.name.toLowerCase();
    const illustratorName = character.illustratorName.toLowerCase();
    const worksName = character.worksName.toLowerCase();
    return terms.every(term => {
      if (Math.floor(id / 10) === Number(term)){
        return true;
      }
      if (charaName.includes(term)){
        return true;
      }
      if (illustratorName.includes(term)){
        return true;
      }
      if (worksName.includes(term)){
        return true;
      }
      return false;
    });
  }

  parseSearchTerms(searchTerm: string): string[] {
    const terms: string[] = [];
    let buffer = '';
    let inQuotes = false;
    let escapeNext = false;

    for (const char of searchTerm) {
      if (escapeNext) {
        buffer += char;
        escapeNext = false;
      } else if (char === '\\') {
        escapeNext = true;
      } else if (char === '"') {
        if (!inQuotes && buffer.length > 0) {
          terms.push(buffer.trim());
          buffer = '';
        }
        inQuotes = !inQuotes;
      } else if (char === ' ' && !inQuotes) {
        if (buffer.length > 0) {
          terms.push(buffer);
          buffer = '';
        }
      } else {
        buffer += char;
      }
    }

    if (buffer.length > 0) {
      terms.push(buffer.trim());
    }

    return terms;
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

  handleErrorImg(e) {
    e.srcElement.src = 'https://rinnet.stehp.cn/assets/chuni/chara/CHU_UI_Character_0000_00_00.webp';
  }
}
