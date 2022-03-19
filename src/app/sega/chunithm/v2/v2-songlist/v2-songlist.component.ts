import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ChusanMusic} from '../model/ChusanMusic';
import {NgxIndexedDBService} from 'ngx-indexed-db';

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

  constructor(private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {
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
