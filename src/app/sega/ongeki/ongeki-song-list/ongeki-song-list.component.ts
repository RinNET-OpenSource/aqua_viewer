import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {OngekiMusic} from '../model/OngekiMusic';
import {ApiService} from '../../../api.service';
import {MessageService} from '../../../message.service';

@Component({
  selector: 'app-ongeki-song-list',
  templateUrl: './ongeki-song-list.component.html',
  styleUrls: ['./ongeki-song-list.component.css']
})
export class OngekiSongListComponent implements OnInit {

  dataSource = new MatTableDataSource();
  songList: OngekiMusic[] = [];
  displayedColumns: string[] = ['id', 'name', 'artistName'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.api.get('api/game/ongeki/data/musicList').subscribe(
      data => {
        this.songList = data;
        this.dataSource.data = this.songList;
        data.forEach(x => {
          this.dbService.add<OngekiMusic>('ongekiMusic', x).subscribe(
            () => '', error => {
              console.error(error);
            }
          );
        });
      },
      error => this.messageService.notice(error)
    );
    this.dbService.getAll<OngekiMusic>('ongekiMusic').subscribe(
      x => {
        this.songList = x;
        this.dataSource.data = this.songList;
      }
    );
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
