import {Observable, combineLatest, debounceTime, map, startWith} from 'rxjs';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {MatPaginator} from '@angular/material/paginator';
import {OngekiMusic} from '../model/OngekiMusic';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {OngekiSongScoreRankingComponent} from '../ongeki-song-score-ranking/ongeki-song-score-ranking.component';
import {FormArray, FormControl} from '@angular/forms';
import {ToLevelDecimalPipe} from '../util/to-level-decimal.pipe';

@Component({
  selector: 'app-ongeki-song-list',
  templateUrl: './ongeki-song-list.component.html',
  styleUrls: ['./ongeki-song-list.component.css']
})
export class OngekiSongListComponent implements OnInit {
  Number = Number;

  songList: OngekiMusic[] = [];
  filteredSongList$: Observable<OngekiMusic[]>;
  currentPage = 1;
  totalElements = 0;
  host = environment.assetsHost;
  genres = ['POPS＆ANIME', 'niconico', '東方Project', 'VARIETY', 'チュウマイ', 'オンゲキ'];

  searchControl = new FormControl('');
  genreControls = new FormArray([]);
  lunaticControl = new FormControl(false);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(OngekiSongScoreRankingComponent, { static: false }) OngekiSongScroeRankingComponent: OngekiSongScoreRankingComponent;

  constructor(
    private dbService: NgxIndexedDBService,
    public route: ActivatedRoute,
    public router: Router,
    private offcanvasService: NgbOffcanvas,
  ) {
    this.genres.forEach(() => this.genreControls.push(new FormControl(false)));
  }

  ngOnInit() {
    this.dbService.getAll<OngekiMusic>('ongekiMusic').subscribe(
      x => {
        this.songList = x.filter(item => (item.id > 1 && item.id < 2800) || item.id > 7000);
        this.filteredSongList$ = combineLatest([
          this.searchControl.valueChanges.pipe(startWith('')),
          this.genreControls.valueChanges.pipe(startWith([])),
          this.lunaticControl.valueChanges.pipe(startWith(false)),
        ]).pipe(
          map(([searchTerm, genreValues, lunaticChecked]) => {
            let selectedGenres = this.genres.filter((_, index) => genreValues[index]);
            if (selectedGenres.length === 0 && !lunaticChecked){
              selectedGenres = this.genres;
            }
            return this.songList.filter(song =>
              this.filterSongs(song, searchTerm) &&
              (selectedGenres.includes(song.genre) || (lunaticChecked && this.isLunatic(song)))
            );
          })
        );
      }
    );
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
    });
  }

  pageChanged(page: number) {
    this.router.navigate(['ongeki/song'], {queryParams: {page}});
  }

  filterSongs(song: OngekiMusic, searchTerm: string): boolean {
    if (searchTerm) {
      const terms = this.parseSearchTerms(searchTerm.toLowerCase());

      let levels: string[] = [];
      const toLevelDecimalPipe = new ToLevelDecimalPipe();
      const isLunatic = this.isLunatic(song);
      if (isLunatic){
        levels.push(toLevelDecimalPipe.transform(song.level4));
      }
      else{
        levels.push(toLevelDecimalPipe.transform(song.level3));
        levels.push(toLevelDecimalPipe.transform(song.level2));
        levels.push(toLevelDecimalPipe.transform(song.level1));
        levels.push(toLevelDecimalPipe.transform(song.level0));
      }

      return terms.every(term => {
        if (song.id === Number(term)){
          return true;
        }
        if (song.name.toLowerCase().includes(term)){
          return true;
        }
        if (song.sortName.toLowerCase().includes(term)){
          return true;
        }
        if (song.artistName.toLowerCase().includes(term)){
          return true;
        }
        const result = this.filterLevels(levels, term);
        if (result && result.length > 0){
          levels = result;
          return true;
        }
      });
    }
    return true;
  }

  filterLevels(levels: string[], term: string) {

    const regex = /^(\d+(?:\.\d+)?)([+-]?)$/;
    const match = term.match(regex);
    if (match) {
      const value = parseFloat(match[1]);
      const modifier = match[2];

      switch (modifier) {
        case '+':
          return levels.filter(level => Number(level) >= value);
        case '-':
          return levels.filter(level => Number(level) <= value);
        default:
          return levels.filter(level => Number(level) === value);
      }
    }
    return undefined;
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
}
