import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ChusanMusic} from '../model/ChusanMusic';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ApiService} from '../../../../api.service';
import {MessageService} from '../../../../message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';


@Component({
  selector: 'app-v2-songlist',
  templateUrl: './v2-songlist.component.html',
  styleUrls: ['./v2-songlist.component.css']
})
export class V2SonglistComponent implements OnInit {

  dataSource = new MatTableDataSource();
  songList: ChusanMusic[] = [];
  filteredSongList: ChusanMusic[];
  displayedColumns: string[] = ['musicId', 'name', 'artistName'];
  host = environment.assetsHost;
  currentPage: 1;
  totalElements = 0;
  searchTerm = '';

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private messageService: MessageService,
    public router: Router,
    public route: ActivatedRoute,
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageChanged(page: number) {
    this.router.navigate(['chuni/v2/song'], {queryParams: {page}});
  }

  filterSongs() {
    if (this.searchTerm) {
      console.log(this.searchTerm);
      this.filteredSongList = this.songList.filter(song =>
      {
        const lowerSearchTerm = this.searchTerm.toLowerCase();
        const sameId = song.musicId === Number(this.searchTerm);
        const includesName = song.name.toLowerCase().includes(lowerSearchTerm);
        // const includesSortName = song.sotrName.toLowerCase().includes(lowerSearchTerm);
        const includesArtist = song.artistName.toLowerCase().includes(lowerSearchTerm);
        return sameId || includesName || includesArtist;
      });
    } else {
      this.filteredSongList = [...this.songList];
    }
  }
}
