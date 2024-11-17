import {Component, OnInit, ViewChild} from '@angular/core';
import {ChusanMusic} from '../model/ChusanMusic';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ApiService} from '../../../../api.service';
import {MessageService} from '../../../../message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {V2SongScoreRankingComponent} from '../v2-song-score-ranking/v2-song-score-ranking.component';


@Component({
  selector: 'app-v2-songlist',
  templateUrl: './v2-songlist.component.html',
  styleUrls: ['./v2-songlist.component.css']
})
export class V2SonglistComponent implements OnInit {

  songList: ChusanMusic[] = [];
  filteredSongList: ChusanMusic[];
  displayedColumns: string[] = ['musicId', 'name', 'artistName'];
  host = environment.assetsHost;
  currentPage: 1;
  totalElements = 0;

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private messageService: MessageService,
    public router: Router,
    public route: ActivatedRoute,
    private offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    this.dbService.getAll<ChusanMusic>('chusanMusic').subscribe(
      x => {
        this.songList = x;
        this.filteredSongList = [...this.songList];
      }
    );
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
    });
  }

  pageChanged(page: number) {
    this.router.navigate(['chuni/v2/song'], {queryParams: {page}});
  }

  filterSongs(searchTerm: string) {
    if (searchTerm) {
      console.log(searchTerm);
      this.filteredSongList = this.songList.filter(song =>
      {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const sameId = song.musicId === Number(searchTerm);
        const includesName = song.name.toLowerCase().includes(lowerSearchTerm);
        // const includesSortName = song.sotrName.toLowerCase().includes(lowerSearchTerm);
        const includesArtist = song.artistName.toLowerCase().includes(lowerSearchTerm);
        return sameId || includesName || includesArtist;
      });
    } else {
      this.filteredSongList = [...this.songList];
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
