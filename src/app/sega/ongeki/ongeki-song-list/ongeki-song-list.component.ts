import {
  Observable,
  combineLatest,
  debounceTime,
  map,
  startWith,
  OperatorFunction,
  distinctUntilChanged,
  filter,
  Subject,
  merge, lastValueFrom
} from 'rxjs';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {OngekiMusic} from '../model/OngekiMusic';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {NgbOffcanvas, NgbTypeahead, NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {OngekiSongScoreRankingComponent} from '../ongeki-song-score-ranking/ongeki-song-score-ranking.component';
import {FormArray, FormControl} from '@angular/forms';
import {ToLevelDecimalPipe} from '../util/to-level-decimal.pipe';
import {OngekiCard} from '../model/OngekiCard';
import {OngekiSkill} from '../model/OngekiSkill';
import {OngekiCharacter} from '../model/OngekiCharacter';

@Component({
  selector: 'app-ongeki-song-list',
  templateUrl: './ongeki-song-list.component.html',
  styleUrls: ['./ongeki-song-list.component.css']
})
export class OngekiSongListComponent implements OnInit {
  Number = Number;

  songList: OngekiMusic[] = [];
  allCards: OngekiCard[] = [];
  characters: OngekiCharacter[] = [];
  filteredSongList$: Observable<OngekiMusic[]>;
  currentPage = 1;
  totalElements = 0;
  host = environment.assetsHost;
  genres = ['POPS＆ANIME', 'niconico', '東方Project', 'VARIETY', 'チュウマイ', 'オンゲキ'];

  searchControl = new FormControl('');
  genreControls = new FormArray<FormControl<boolean>>([]);
  patternControl = new FormControl<SearchPattern[]>([]);
  lunaticControl = new FormControl(false);

  @ViewChild(OngekiSongScoreRankingComponent, { static: false }) OngekiSongScroeRankingComponent: OngekiSongScoreRankingComponent;
  @ViewChild('typehead', { static: true }) typehead: NgbTypeahead;
  @ViewChild('inputElement') inputElement!: ElementRef;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private dbService: NgxIndexedDBService,
    public route: ActivatedRoute,
    public router: Router,
    private offcanvasService: NgbOffcanvas
  ) {
    this.genres.forEach(() => this.genreControls.push(new FormControl(false)));
  }

  ngOnInit() {
    this.prepare();
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
    });
  }

  async prepare() {
    const songList = await lastValueFrom(this.dbService.getAll<OngekiMusic>('ongekiMusic'));
    this.songList = songList.filter(item => (item.id > 1 && item.id < 2800) || item.id > 7000);
    this.allCards = await lastValueFrom(this.dbService.getAll<OngekiCard>('ongekiCard'));
    this.characters = await lastValueFrom(this.dbService.getAll<OngekiCharacter>('ongekiCharacter'));

    this.filteredSongList$ = combineLatest([
      this.genreControls.valueChanges.pipe(startWith(new Array<boolean>())),
      this.patternControl.valueChanges.pipe(startWith(new Array<SearchPattern>())),
      this.lunaticControl.valueChanges.pipe(startWith(false)),
    ]).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(([genreValues, patternValues, lunaticChecked]) => {
        let selectedGenres = this.genres.filter((_, index) => genreValues[index]);
        if (selectedGenres.length === 0 && !lunaticChecked){
          selectedGenres = this.genres;
        }

        let filtered = this.songList;
        if (selectedGenres.length !== this.genres.length){
          filtered = filtered.filter(song => selectedGenres.includes(song.genre) || (lunaticChecked && this.isLunatic(song)));
        }
        patternValues.forEach(pattern => {
          filtered = filtered.filter(song => this.filterByPattern(song, pattern));
        });
        return filtered;
      })
    );
  }

  pageChanged(page: number) {
    this.router.navigate(['ongeki/song'], {queryParams: {page}});
  }

  filterByPattern(song: OngekiMusic, pattern: SearchPattern): boolean {
    if (pattern.type === 'ID'){
      return song.id === pattern.value;
    }

    const levels: number[] = [];
    const toLevelDecimalPipe = new ToLevelDecimalPipe();
    const isLunatic = this.isLunatic(song);
    if (isLunatic){
      levels.push(Number(toLevelDecimalPipe.transform(song.level4)));
    }
    else{
      levels.push(Number(toLevelDecimalPipe.transform(song.level3)));
      levels.push(Number(toLevelDecimalPipe.transform(song.level2)));
      levels.push(Number(toLevelDecimalPipe.transform(song.level1)));
      levels.push(Number(toLevelDecimalPipe.transform(song.level0)));
    }
    if (pattern.type === 'Level'){
      const num = Number(pattern.value.endsWith('+') ? pattern.value.slice(0, -1) : pattern.value);
      let max: number;
      let min: number;
      if (num < 7){
        min = num;
        max = num + 1;
      }
      else{
        if (pattern.value.endsWith('+')){
          min = num + 0.7;
          max = num + 1;
        }
        else{
          min = num;
          max = num + 0.7;
        }
      }
      return levels.some(level => level >= min && level < max);
    }
    if (pattern.type === 'Const'){
      return levels.some(level => level === Number(pattern.value));
    }
    if (pattern.type === 'Range'){
      const values = pattern.value.split('~').map(v => Number(v));
      return levels.some(level => level >= values[0] && level < values[1]);
    }

    let bossName: string;
    const bossCard = this.allCards.find(c => c.id === song.bossCardId);
    if (bossCard){
      const boss = this.characters.find(c => c.id === bossCard.charaId);
      if (boss){
        bossName = boss.name;
      }
    }
    const lower = pattern.value.toLowerCase();
    if (pattern.type === 'String'){
      return song.name.toLowerCase().includes(lower) ||
        song.sortName.toLowerCase().includes(lower) ||
        song.artistName.toLowerCase().includes(lower) ||
        bossName.toLowerCase().includes(lower);
    }
    if (pattern.type === 'Artist'){
      return song.artistName.toLowerCase().includes(lower);
    }
    if (pattern.type === 'Title'){
      return song.name.toLowerCase().includes(lower) ||
        song.sortName.toLowerCase().includes(lower);
    }
    if (pattern.type === 'Boss'){
      return bossName.toLowerCase().includes(lower);
    }


    return true;
  }

  searchTypehead: OperatorFunction<string, SearchPattern[]> = (text$: Observable<string>) =>
  {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.typehead.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) => {
        term = term.trim();
        if (term.length < 1) { return []; }
        const lower = term.toLowerCase();
        const res: SearchPattern[] = [];
        const num = Number(term.endsWith('+') ? term.slice(0, -1) : term);
        if (!Number.isNaN(num) && Number.isFinite(num) && !term.endsWith('.')){
          if (Number.isInteger(num) && !term.includes('.')){
            if (num < 10000 && num >= 0 && !term.endsWith('+')){
              res.push({type: 'ID', value: num});
            }
            if (num <= 15 && num >= 0 && (num >= 7 || !term.endsWith('+'))) {
              res.push({type: 'Level', value: term});
            }
          }
          else{
            if (num < 15.8 && num >= 0 && /^\d{1,2}\.\d$/.test(term)){
              res.push({ type: 'Const', value: num.toFixed(1) });
            }
          }
        }
        const rangePattern = /^(\d{1,2}(\.\d)?)[\s-~](\d{1,2}(\.\d)?)$/;
        const match = term.match(rangePattern);

        if (match) {
          let const1 = Number(match[1]);
          let const2 = Number(match[3]);

          if (!Number.isNaN(const1) && Number.isFinite(const1) && !Number.isNaN(const2) && Number.isFinite(const2) && const1 !== const2) {
            if (const2 < const1){
              const tmp = const1;
              const1 = const2;
              const2 = tmp;
            }
            if (const1 >= 0 && const2 < 15.8){
              res.push({ type: 'Range', value: `${const1.toFixed(1)}~${const2.toFixed(1)}` });
            }
          }
        }

        res.push({type: 'String', value: term});
        this.songList.forEach(song => {
          if (song.artistName.toLowerCase().includes(lower) && !res.some(p => p.type === 'Artist' && p.value === song.artistName)) {
            res.push({type: 'Artist', value: song.artistName});
          }
          if ((song.name.toLowerCase().includes(lower) || song.sortName.toLowerCase().includes(lower)) && !res.some(p => p.type === 'Title' && p.value === song.name)) {
            res.push({type: 'Title', value: song.name});
          }
        });
        this.characters.forEach(character => {
          if (character.name.toLowerCase().includes(lower)) {
            res.push({type: 'Boss', value: character.name});
          }
        });
        return res;
        }
      ),
    );
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

  isLunatic(song: OngekiMusic) {
    return song.level0 === '0,0' &&
    song.level1 === '0,0' &&
    song.level2 === '0,0' &&
    song.level3 === '0,0';
  }

  showDetail(music: OngekiMusic) {
    const offcanvasRef = this.offcanvasService.open(OngekiSongScoreRankingComponent, {
      position: 'end',
      scroll: false,
      // panelClass: 'ongeki-song-score-ranking',
    });
    offcanvasRef.componentInstance.music = music;
  }

  onSelectItem(event: NgbTypeaheadSelectItemEvent){
    this.searchControl.setValue('');
    const newValue = [...this.patternControl.value, event.item];
    this.patternControl.setValue(newValue);
    event.preventDefault();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.searchControl.value === '') {
      event.preventDefault();

      if (this.patternControl.value.length > 0) {
        this.patternControl.value.pop();
        this.patternControl.setValue(this.patternControl.value);
      }
    }
  }

  onPatternClick(item: SearchPattern) {
    const index = this.patternControl.value.findIndex(p => p === item);
    if (index !== -1) {
      this.patternControl.value.splice(index, 1);
      this.searchControl.setValue(item.value);
      this.inputElement.nativeElement.focus();
      this.patternControl.setValue(this.patternControl.value);
    }
  }
}
export class SearchPattern{
  type: string;
  value: any;
}
