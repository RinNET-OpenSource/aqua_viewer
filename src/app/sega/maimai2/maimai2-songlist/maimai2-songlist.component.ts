// maimai2-songlist.component.ts

import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Maimai2Music } from '../model/Maimai2Music';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../message.service';

@Component({
  selector: 'app-maimai2-songlist',
  templateUrl: './maimai2-songlist.component.html',
  styleUrls: ['./maimai2-songlist.component.scss']
})
export class Maimai2SonglistComponent implements OnInit {
  constructor(
    private dbService: NgxIndexedDBService,
    private messageService: MessageService
  ) {
    // 初始化表单控件
    this.genreOptions.forEach(() => this.genreControls.push(new FormControl(false)));
    this.versionOptions.forEach(() => this.versionControls.push(new FormControl(false)));
  }
  host = environment.assetsHost;
  enableImages = environment.enableImages;
  protected sortOrder$ = new BehaviorSubject<boolean>(true);
  private sortOptionType$ = new BehaviorSubject<number>(0);

  currentPage = 1;
  itemsPerPage = 20;
  totalElements = 0;
  filteredSongList$: Observable<Maimai2Music[]>;

  genreControls  = new FormArray<FormControl<boolean>>([]);
  versionControls = new FormArray<FormControl<boolean>>([]);
  searchControl = new FormControl('');
  patternControl = new FormControl<SearchPattern[]>([]);

  isDescending: any;

  songList: Maimai2Music[] = [];
  genreOptions = [
    { id: 101, name: 'POPS＆アニメ' },
    { id: 102, name: 'niconico＆ボーカロイド' },
    { id: 103, name: '東方Project' },
    { id: 104, name: 'ゲーム＆バラエティ' },
    { id: 105, name: 'ORIGINAL' },
    { id: 106, name: 'オンゲキ＆CHUNITHM' },
    { id: 107, name: '宴会場' }
  ];
  versionOptions = [
    { id: 0, name: 'maimai' },
    { id: 1, name: 'maimai+' },
    { id: 2, name: 'GreeN' },
    { id: 3, name: 'GreeN+' },
    { id: 4, name: 'ORANGE' },
    { id: 5, name: 'ORANGE+' },
    { id: 6, name: 'PiNK' },
    { id: 7, name: 'PiNK+' },
    { id: 8, name: 'MURASAKi' },
    { id: 9, name: 'MURASAKi+' },
    { id: 10, name: 'MiLK' },
    { id: 11, name: 'MiLK+' },
    { id: 12, name: 'FiNALE' },
    { id: 13, name: 'maimai DX' },
    { id: 14, name: 'maimai DX+' },
    { id: 15, name: 'Splash' },
    { id: 16, name: 'Splash+' },
    { id: 17, name: 'UNiVERSE' },
    { id: 18, name: 'UNiVERSE+' },
    { id: 19, name: 'FESTiVAL' },
    { id: 20, name: 'FESTiVAL+' },
    { id: 21, name: 'BUDDiES' },
    { id: 22, name: 'BUDDiES+' },
    { id: 23, name: 'PRiSM' }
  ];
  sortOptions = [
    { id: 0, name: 'Tsuika Version'},
    { id: 1, name: 'Re:Master' },
    { id: 2, name: 'Master' },
    { id: 3, name: 'Expert' },
    { id: 4, name: 'Advanced' },
    { id: 5, name: 'Basic' },
    { id: 6, name: 'ID' },
  ];


  async ngOnInit() {
    await this.loadData();
    this.setupFilters();
  }

  private async loadData() {
    try {
      this.songList = await this.dbService.getAll<Maimai2Music>('maimai2Music').toPromise();
    } catch (error) {
      this.messageService.notice('数据加载失败: ' + error);
    }
  }

  onSortOptionChange(event: Event) {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.sortOptionType$.next(selectedId);
  }

  toggleSortOrder() {
    this.sortOrder$.next(!this.sortOrder$.value);
  }

  private setupFilters() {
    this.filteredSongList$ = combineLatest([
      this.genreControls.valueChanges.pipe(startWith(this.genreControls.value)),
      this.versionControls.valueChanges.pipe(startWith(this.versionControls.value)),
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.patternControl.valueChanges.pipe(startWith(this.patternControl.value)),
      this.sortOrder$,
      this.sortOptionType$,
    ]).pipe(
      map(([genreValues, versionValues, searchTerm, patterns, isDescending, sortOptionType]) => {
        const filtered = this.songList.filter(song =>
          this.filterByGenre(song, genreValues) &&
          this.filterByVersion(song, versionValues) &&
          this.filterBySearch(song, searchTerm) &&
          this.filterByPatterns(song, patterns)
        );
        return this.sortSongs(filtered, isDescending, sortOptionType);
      })
    );
  }

  private sortSongs(songs: Maimai2Music[], isDescending: boolean, sortOptionType: number): Maimai2Music[] {
    const sortByLevelDecimal = (index: number) => (a: Maimai2Music, b: Maimai2Music) => {
      const levelA = a.details?.[index]?.levelDecimal ?? 0;
      const levelB = b.details?.[index]?.levelDecimal ?? 0;
      const compareResult = levelA - levelB;
      return isDescending ? -compareResult : compareResult;
    };

    switch (sortOptionType) {
      case 1:
        return [...songs].sort(sortByLevelDecimal(4)); // Re:Master
      case 2:
        return [...songs].sort(sortByLevelDecimal(3)); // Master
      case 3:
        return [...songs].sort(sortByLevelDecimal(2)); // Expert
      case 4:
        return [...songs].sort(sortByLevelDecimal(1)); // Advanced
      case 5:
        return [...songs].sort(sortByLevelDecimal(0)); // Basic
      case 6:
        return [...songs].sort((a, b) => {
          const compareResult = a.musicId - b.musicId;
          return isDescending ? -compareResult : compareResult;
        });  // Music Id
      default:
        return [...songs].sort((a, b) => {
          const compareResult = (a.romVersion ?? 0) - (b.romVersion ?? 0);
          return isDescending ? -compareResult : compareResult;
        });
    }
  }

  private filterByGenre(song: Maimai2Music, genreValues: boolean[]): boolean {
    const selectedIds = this.genreOptions
      .filter((_, i) => genreValues[i])
      .map(g => g.id);

    return selectedIds.length === 0 ||
      selectedIds.includes(song.genreId);
  }

  private filterByVersion(song: Maimai2Music, versionValues: boolean[]): boolean {
    const selectedVersionIds = this.versionOptions
      .filter((_, i) => versionValues[i])
      .map(v => v.id);
    return selectedVersionIds.length === 0 || selectedVersionIds.includes(song.addVersion);
  }

  private filterBySearch(song: Maimai2Music, searchTerm: string): boolean {
    if (!searchTerm) { return true; }
    const term = searchTerm.toLowerCase();
    return song.name.toLowerCase().includes(term) ||
      song.artistName.toLowerCase().includes(term);
  }

  private filterByPatterns(song: Maimai2Music, patterns: SearchPattern[]): boolean {
    return patterns.every(pattern =>
      this.checkPattern(song, pattern)
    );
  }

  private checkPattern(song: Maimai2Music, pattern: SearchPattern): boolean {
    // Not implemented
    return true;
  }

  getLevels(song: Maimai2Music): { difficulty: string; value: number }[] {
    return [
      { difficulty: 'BASIC', value: song.details[0].diff },
      { difficulty: 'ADVANCED', value: song.details[1].diff },
      { difficulty: 'EXPERT', value: song.details[2].diff },
      { difficulty: 'MASTER', value: song.details[3].diff },
      { difficulty: 'Re:MASTER', value: song.details[4].diff }
    ].filter(level => level.value !== 0);
  }

  getJacketId(input: number): string {
    return input.toString().slice(-4).padStart(6, '0');
  }

  imgError(event: Event) {
    (event.target as HTMLImageElement).src = this.host + 'assets/mai2/jacket/UI_Jacket_000000.webp';
  }

  pageChanged(page: number) {
    this.currentPage = page;
  }

  getBadgeType(musicId: number): string {
    const idStr = musicId.toString();
    if (idStr.length <= 4 || (idStr.length === 5 && idStr.startsWith('10'))) {
      return 'sd';
    }
    return idStr.length === 6 ? 'utage' : 'dx';
  }
}


interface SearchPattern {
  type: string;
  value: any;
}
