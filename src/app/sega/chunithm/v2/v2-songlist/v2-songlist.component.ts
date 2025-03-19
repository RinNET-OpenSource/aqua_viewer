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
import {Collapse} from 'bootstrap';
import {ReleaseTagService} from '../util/release-tag.service';


@Component({
  selector: 'app-v2-songlist',
  templateUrl: './v2-songlist.component.html',
  styleUrls: ['./v2-songlist.component.css']
})
export class V2SonglistComponent implements OnInit {

  filterCollapsed = true;
  filterCollapse: Collapse;
  songList: ChusanMusic[] = [];
  filteredSongList: Observable<ChusanMusic[]>;
  displayedColumns: string[] = ['musicId', 'name', 'artistName'];
  host = environment.assetsHost;

  genreMap = new Map([
    ['POPS_ANIME', 'POPS & ANIME'],
    ['NICONICO', 'niconico'],
    ['TOUHOU', '東方Project'],
    ['VARIETY', 'VARIETY'],
    ['IRODORI', 'イロドリミドリ'],
    ['GEKICHUMA', 'ゲキマイ'],
    ['ORIGINAL', 'ORIGINAL']
  ]);
  genres: string[] = [...this.genreMap.keys()];

  currentPage: 1;
  totalElements = 0;
  versionControls = new FormArray<FormControl<boolean>>([]);
  genreControls = new FormArray<FormControl<boolean>>([]);
  weControl = new FormControl(false);
  patternControl = new FormControl('');

  constructor(
    public releaseTagService: ReleaseTagService,
    public router: Router,
    public route: ActivatedRoute,
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private messageService: MessageService,
    private offcanvasService: NgbOffcanvas,
  ) {
    this.releaseTagService.releaseTags.forEach(() => this.versionControls.push(new FormControl(false)));
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
      this.versionControls.valueChanges.pipe(startWith(new Array<boolean>())),
      this.patternControl.valueChanges.pipe(startWith('')),
      this.weControl.valueChanges.pipe(startWith(false)),
    ]).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(([genreValues, versionValues, pattern, weChecked]) => {
        let selectedVersions = this.releaseTagService.releaseTags.filter((_, index) => versionValues[index]);
        if (selectedVersions.length === 0 && !weChecked){
          selectedVersions = this.releaseTagService.releaseTags;
        }

        let selectedGenres = this.genres.filter((_, index) => genreValues[index]);
        if (selectedGenres.length === 0 && !weChecked){
          selectedGenres = this.genres;
        }

        return this.filterSongs(selectedGenres, selectedVersions, weChecked, pattern);
      })
    );
  }

  filterSongs(selectedGenres: string[], selectedVersions: string[], weChecked: boolean, pattern: string){
    let filtered = this.songList;
    if (weChecked){
      filtered = filtered.filter(song => song.levels['5'].enable);
    }
    if (selectedVersions.length !== this.releaseTagService.releaseTags.length){
      filtered = filtered.filter(song => selectedVersions.includes(song.releaseVersion));
    }
    if (selectedGenres.length !== this.genreMap.size){
      filtered = filtered.filter(song => selectedGenres.includes(song.genre));
    }
    filtered = filtered.filter(song => this.filterByPattern(song, pattern));
    this.totalElements = filtered.length;
    return filtered;
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

  resetFilter() {
    this.weControl.setValue(false);
    this.genreControls.controls.forEach(c => c.setValue(false));
    this.versionControls.controls.forEach(c => c.setValue(false));
    this.patternControl.setValue('');
  }

  isDefaultFilter() {
    return this.weControl.value === false &&
    this.genreControls.controls.every(c => c.value === false) &&
    this.genreControls.controls.every(c => c.value === false) &&
    this.patternControl.value === '';
  }

  toggleFilter() {
    if (!this.filterCollapse){
      const collapseElement = document.getElementById('filterCollapse');
      if (collapseElement) {
        this.filterCollapse = new Collapse(collapseElement, {toggle: false});
      }
    }
    if (this.filterCollapsed){
      this.filterCollapse.show();
      this.filterCollapsed = false;
    }
    else{
      this.filterCollapse.hide();
      this.filterCollapsed = true;
    }
  }

  showDetail(music: ChusanMusic) {
    const offcanvasRef = this.offcanvasService.open(V2SongScoreRankingComponent, {
      position: 'end',
      scroll: false,
    });
    offcanvasRef.componentInstance.music = music;
  }
}
