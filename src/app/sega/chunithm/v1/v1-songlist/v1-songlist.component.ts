import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ChuniMusic} from '../model/ChuniMusic';
import {NgxIndexedDBService} from 'ngx-indexed-db';

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

  constructor(private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {
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
