import {Component, OnInit, ViewChild} from '@angular/core';
import {ChusanMusic} from '../model/ChusanMusic';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ApiService} from '../../../../api.service';
import {MessageService} from '../../../../message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {V2SongScoreRankingComponent} from '../v2-song-score-ranking/v2-song-score-ranking.component';
import {FormArray, FormControl} from '@angular/forms';
import {combineLatest, debounceTime, distinctUntilChanged, lastValueFrom, map, Observable, startWith} from 'rxjs';


@Component({
  selector: 'app-v2-songlist',
  templateUrl: './v2-songlist.component.html',
  styleUrls: ['./v2-songlist.component.css']
})
export class V2SonglistComponent implements OnInit {

  genres = ['POPS_ANIME', 'NICONICO', 'TOUHOU', 'VARIETY', 'GEKICHUMA', 'IRODORI', 'ORIGINAL'];
  genresMap = new Map([
    ['POPS_ANIME', 'POPS & ANIME'],
    ['NICONICO', 'niconico'],
    ['TOUHOU', '東方Project'],
    ['VARIETY', 'VARIETY'],
    ['GEKICHUMA', 'ゲキマイ'],
    ['IRODORI', 'イロドリミドリ'],
    ['ORIGINAL', 'ORIGINAL']
  ]);
  songList: ChusanMusic[] = [];
  filteredSongList: Observable<ChusanMusic[]>;
  displayedColumns: string[] = ['musicId', 'name', 'artistName'];
  host = environment.assetsHost;
  currentPage: 1;
  totalElements = 0;
  genreControls = new FormArray<FormControl<boolean>>([]);
  weControl = new FormControl(false);
  patternControl = new FormControl('');

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private messageService: MessageService,
    public router: Router,
    public route: ActivatedRoute,
    private offcanvasService: NgbOffcanvas,
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
    this.songList = await lastValueFrom(this.dbService.getAll<ChusanMusic>('chusanMusic'));

    this.filteredSongList = combineLatest([
      this.genreControls.valueChanges.pipe(startWith(new Array<boolean>())),
      this.patternControl.valueChanges.pipe(startWith('')),
      this.weControl.valueChanges.pipe(startWith(false)),
    ]).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(([genreValues, pattern, weChecked]) => {
        let selectedGenres = this.genres.filter((_, index) => genreValues[index]);
        if (selectedGenres.length === 0 && !weChecked){
          selectedGenres = this.genres;
        }

        let filtered = this.songList;
        if (selectedGenres.length !== this.genres.length){
          filtered = filtered.filter(song => selectedGenres.includes(song.genre) || (weChecked && song.levels['5'].enable));
        }
        filtered = filtered.filter(song => this.filterByPattern(song, pattern));
        return filtered;
      })
    );
  }

  pageChanged(page: number) {
    this.router.navigate(['chuni/v2/song'], {queryParams: {page}});
  }

  filterByPattern(song: ChusanMusic, searchTerm: string){
    const lowerSearchTerm = searchTerm.toLowerCase();
    const sameId = song.musicId === Number(searchTerm);
    const includesName = song.name.toLowerCase().includes(lowerSearchTerm);
    // const includesSortName = song.sotrName.toLowerCase().includes(lowerSearchTerm);
    const includesArtist = song.artistName.toLowerCase().includes(lowerSearchTerm);
    return sameId || includesName || includesArtist;
  }

  showDetail(music: ChusanMusic) {
    const offcanvasRef = this.offcanvasService.open(V2SongScoreRankingComponent, {
      position: 'end',
      scroll: false,
    });
    offcanvasRef.componentInstance.music = music;
  }
}
