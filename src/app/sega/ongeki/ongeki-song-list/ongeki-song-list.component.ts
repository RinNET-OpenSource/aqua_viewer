import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {MatPaginator} from '@angular/material/paginator';
import {OngekiMusic} from '../model/OngekiMusic';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-ongeki-song-list',
  templateUrl: './ongeki-song-list.component.html',
  styleUrls: ['./ongeki-song-list.component.css']
})
export class OngekiSongListComponent implements OnInit {
  songList: OngekiMusic[] = [];
  filteredSongList: OngekiMusic[];
  currentPage = 1;
  totalElements = 0;
  searchTerm = '';

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private dbService: NgxIndexedDBService,
    public route: ActivatedRoute,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.dbService.getAll<OngekiMusic>('ongekiMusic').subscribe(
      x => {
        this.songList = x;
        this.filteredSongList = [...x];
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
  filterSongs() {
    if (this.searchTerm) {
      this.filteredSongList = this.songList.filter(song =>
      {
        const lowerSearchTerm = this.searchTerm.toLowerCase();
        const sameId = song.id === Number(this.searchTerm);
        const includesName = song.name.toLowerCase().includes(lowerSearchTerm);
        const includesSortName = song.sortName.toLowerCase().includes(lowerSearchTerm);
        const includesArtist = song.artistName.toLowerCase().includes(lowerSearchTerm);
        return sameId || includesName || includesSortName || includesArtist;
      });
    } else {
      this.filteredSongList = [...this.songList];
    }
  }

}
