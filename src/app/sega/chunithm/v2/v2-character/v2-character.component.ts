import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../api.service';
import {MessageService} from '../../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {HttpParams} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {combineLatest, lastValueFrom, Observable, startWith} from 'rxjs';
import {V2Character} from '../model/V2Character';
import {ChusanCharacter} from '../model/ChusanCharacter';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from 'src/app/user.service';
import {FormArray, FormControl} from '@angular/forms';
import {Collapse} from 'bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-v2-character',
  templateUrl: './v2-character.component.html',
  styleUrls: ['./v2-character.component.scss']
})
export class V2CharacterComponent implements OnInit {

  loading = true;
  host = environment.assetsHost;
  enableImages = environment.enableImages;

  aimeId: string;
  equippedCharaId: number;
  equippedCharaIllustId: number;

  filterCollapsed = true;
  filterCollapse: Collapse;

  allCharacters: ChusanCharacter[];
  characterIds: number[];
  filteredIds: number[];
  characterList: Observable<V2Character[]>;

  currentPage = 1;
  pageSize = 12;
  totalElements = 0;
  math = Math;

  searchTermControl = new FormControl('');
  acquiredControls = new FormArray([new FormControl(true), new FormControl(false)]);
  versionControls = new FormArray<FormControl<boolean>>([]);

  releaseTags = [
    'v1 1.00.00', 'v1 1.05.00',
    'v1 1.10.00', 'v1 1.15.00',
    'v1 1.20.00', 'v1 1.25.00',
    'v1 1.30.00', 'v1 1.35.00',
    'v1 1.40.00', 'v1 1.45.00',
    'v1 1.50.00', 'v1 1.55.00',
    'v2 2.00.00', 'v2 2.05.00',
    'v2 2.10.00', 'v2 2.15.00',
    'v2 2.20.00', 'v2 2.25.00'
  ];
  releaseTagMap = new Map([
    ['v1 1.00.00', 'ORIGIN'],
    ['v1 1.05.00', 'ORIGIN PLUS'],
    ['v1 1.10.00', 'AIR'],
    ['v1 1.15.00', 'AIR PLUS'],
    ['v1 1.20.00', 'STAR'],
    ['v1 1.25.00', 'STAR PLUS'],
    ['v1 1.30.00', 'AMAZON'],
    ['v1 1.35.00', 'AMAZON PLUS'],
    ['v1 1.40.00', 'CRYSTAL'],
    ['v1 1.45.00', 'CRYSTAL PLUS'],
    ['v1 1.50.00', 'PARADISE'],
    ['v1 1.55.00', 'PARADISE LOST'],
    ['v2 2.00.00', 'NEW'],
    ['v2 2.05.00', 'NEW PLUS'],
    ['v2 2.10.00', 'SUN'],
    ['v2 2.15.00', 'SUN PLUS'],
    ['v2 2.20.00', 'LUMINOUS'],
    ['v2 2.25.00', 'LUMINOUS PLUS'],
  ]);

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService,
    private translateService: TranslateService,
    protected modalService: NgbModal,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    this.releaseTags.forEach(() => this.versionControls.push(new FormControl(false)));
  }

  async ngOnInit() {
    await this.prepare();
    combineLatest([
      this.route.queryParams.pipe(startWith({page: 1})),
      this.acquiredControls.valueChanges.pipe(startWith(this.acquiredControls.value)),
      this.versionControls.valueChanges.pipe(startWith(this.versionControls.value)),
      this.searchTermControl.valueChanges.pipe(startWith(this.searchTermControl.value)),
    ]).subscribe(([queryParams, acquiredValues, versionValues, searchTerm]) => {
      const selectedVersions = this.releaseTags.filter((_, index) => versionValues[index]);
      this.filteredIds = this.filterCharacter(acquiredValues, selectedVersions, searchTerm);
      this.totalElements = this.filteredIds.length;
      if (queryParams.page) {
        this.currentPage = queryParams.page;
      } else {
        const index = this.filteredIds.findIndex(c => c === this.equippedCharaId);
        if (index > -1) {
          this.currentPage = Math.floor(index / this.pageSize) + 1;
        }
      }
      this.load(this.currentPage);
    });

  }

  async prepare() {
    this.allCharacters = await lastValueFrom(this.dbService.getAll<ChusanCharacter>('chusanCharacter'));
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.equippedCharaId = (await lastValueFrom(this.api.get('api/game/chuni/v2/profile', param))).characterId;
    this.equippedCharaIllustId = (await lastValueFrom(this.api.get('api/game/chuni/v2/profile', param))).charaIllustId;
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
        data => {
          const content: V2Character[] = data;
          const characters = pageIds.map(id => {
            let character: V2Character = content.find(c => c.characterId === id);
            if (!character) {
              character = {
                characterId: id,
                playCount: 0,
                level: 0,
                friendshipExp: 0,
                isValid: false,
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
            x.characterInfo = this.allCharacters.find(c => c.id === x.characterId);
          });
          this.loading = false;
          return characters;
        },
        error => this.messageService.notice(error)
      )
    );
  }

  filterCharacter(acquiredValues: boolean[], selectedVersions: string[], searchTerm: string) {
    let filteredIds;

    if (acquiredValues[0] === acquiredValues[1]) {
      filteredIds = this.allCharacters.map(c => c.id);
    }
    else if (acquiredValues[0]) {
      filteredIds = this.characterIds;
    }
    else {
      const allIds = this.allCharacters.map(c => c.id);
      filteredIds = allIds.filter(id => !this.characterIds.includes(id));
    }

    if (selectedVersions.length !== 0 && selectedVersions.length !== this.releaseTags.length) {
      const ids = this.allCharacters.filter(c => selectedVersions.indexOf(c.releaseTag) !== -1).map(c => c.id);
      filteredIds = filteredIds.filter(id => ids.includes(id));
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
    const addImages = character.addImages.split(',').map(i => {
      const values = i.split(':');
      return {id: Number(values[0]), name: values[1]};
    }).filter(i => i.id !== -1);
    return terms.every(term => {
      if (id === Number(term) || addImages?.some(i => i.id === Number(term))) {
        return true;
      }
      if (charaName.includes(term) || addImages?.some(i => i.name.includes(term))) {
        return true;
      }
      if (illustratorName.includes(term)) {
        return true;
      }
      if (worksName.includes(term)) {
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
    e.srcElement.src = this.host + 'assets/chuni/chara/CHU_UI_Character_0000_00_00.webp';
  }

  nextImage($event: MouseEvent, chara: V2Character) {
    const addImages = chara.characterInfo.addImages.split(',').map(i => {
      const values = i.split(':');
      return Number(values[0]);
    }).filter(i => i !== -1);
    if (addImages && addImages.length > 0) {
      const ids = [chara.characterInfo.id, ...addImages];
      const currentIndex = ids.indexOf(chara.characterId);
      const nextIndex = (currentIndex + 1) % ids.length;
      chara.characterId = ids[nextIndex];
      $event.stopPropagation();
    }
  }

  getCharaName(characterId: number, characterInfo: ChusanCharacter) {
    const addImages = characterInfo.addImages.split(',').map(i => {
      const values = i.split(':');
      return {id: Number(values[0]), name: values[1]};
    }).filter(i => i.id !== -1);
    if (addImages && addImages.length > 0) {
      const characters = [{id: characterInfo.id, name: characterInfo.name}, ...addImages];
      const result = characters.find(i => i.id === characterId);
      if (result) {
        return result.name;
      }
    }
    return characterInfo.name;
  }

  addImageCount(addImagesString: string) {
    const addImages = addImagesString.split(',').map(i => {
      const values = i.split(':');
      return Number(values[0]);
    }).filter(i => i !== -1);
    return addImages?.length ?? 0;
  }

  resetFilter() {
    this.acquiredControls.setValue([true, false]);
    this.versionControls.controls.forEach(c => c.setValue(false));
    this.searchTermControl.setValue('');
  }

  isDefaultFilter() {
    return this.acquiredControls.value.toString() === [true, false].toString() &&
      this.versionControls.controls.every(c => c.value === false) &&
      this.searchTermControl.value === '';
  }

  toggleFilter() {
    if (!this.filterCollapse){
      const collapseElement = document.getElementById('filterCollapse');
      if (collapseElement) {
        this.filterCollapse = new Collapse(collapseElement, {toggle: false});
      }
    }
    if (this.filterCollapsed) {
      this.filterCollapse.show();
      this.filterCollapsed = false;
    } else {
      this.filterCollapse.hide();
      this.filterCollapsed = true;
    }
  }

  setChara(character: V2Character) {
    const params = { aimeId: this.aimeId, characterId: character.characterInfo.id, charaIllustId: character.characterId };
    this.api.put('api/game/chuni/v2/profile/character', params).subscribe({
        next: async result => {
          this.messageService.notice(await lastValueFrom(this.translateService.get('ChuniV2.CharacterPage.SetSuccess')), 'success');
          this.equippedCharaIllustId = result.charaIllustId;
          this.equippedCharaId = result.characterId;
          this.modalService.dismissAll();
        },
        error: error => this.messageService.notice(error, 'warning')
    });
  }

  unlockCharacter(characterId: number) {
    this.api.post('api/game/chuni/v2/character', {
      aimeId: this.aimeId,
      characterId,
      level: 1,
      isValid: true,
      isNewMark: true
    }).subscribe(data => {
      this.characterIds = [characterId].concat(this.characterIds);
      this.load(this.currentPage);
    }, error => this.messageService.notice(error));
  }
}
