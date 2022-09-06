import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ChusanMusic} from '../model/ChusanMusic';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ApiService} from '../../../../api.service';
import {MessageService} from '../../../../message.service';


@Component({
  selector: 'app-v2-songlist',
  templateUrl: './v2-songlist.component.html',
  styleUrls: ['./v2-songlist.component.css']
})
export class V2SonglistComponent implements OnInit {

  dataSource = new MatTableDataSource();
  songList: ChusanMusic[] = [];
  displayedColumns: string[] = ['musicId', 'name', 'artistName'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    // Same as v1-songlist.component.ts:36
    this.api.get('api/game/chuni/v2/data/music').subscribe(
      data => {
        this.songList = data;
        this.dataSource.data = this.songList;
        data.forEach(x => {
          this.dbService.add<ChusanMusic>('chusanMusic', x).subscribe(
            () => '', error => {
              console.error(error);
            }
          );
        });
      },
      error => this.messageService.notice(error)
    );
    this.dbService.getAll<ChusanMusic>('chusanMusic').subscribe(
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
