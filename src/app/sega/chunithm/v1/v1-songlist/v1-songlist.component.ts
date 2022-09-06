import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ChuniMusic} from '../model/ChuniMusic';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';

@Component({
  selector: 'app-v1-songlist',
  templateUrl: './v1-songlist.component.html',
  styleUrls: ['./v1-songlist.component.css']
})
export class V1SonglistComponent implements OnInit {

  dataSource = new MatTableDataSource();
  songList: ChuniMusic[] = [];
  displayedColumns: string[] = ['musicId', 'name', 'artistName'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService
  ) {

  }


  ngOnInit() {
    // This is a temporary solve method
    // Reload the database when user access the page
    this.api.get('api/game/chuni/v1/data/music').subscribe(
      data => {
        this.songList = data;
        this.dataSource.data = this.songList;
        data.forEach(x => {
          this.dbService.add<ChuniMusic>('chuniMusic', x).subscribe(
            () => '', error => {
              console.error(error);
            }
          );
        });
      },
      error => this.messageService.notice(error)
    );
    this.dbService.getAll<ChuniMusic>('chuniMusic').subscribe(
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
