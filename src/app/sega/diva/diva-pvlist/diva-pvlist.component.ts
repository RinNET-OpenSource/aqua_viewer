import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DivaPv} from '../model/DivaPv';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-diva-pvlist',
  templateUrl: './diva-pvlist.component.html',
  styleUrls: ['./diva-pvlist.component.css']
})
export class DivaPvlistComponent implements OnInit {

  dataSource = new MatTableDataSource();
  pvList: DivaPv[] = [];
  displayedColumns: string[] = ['pvId', 'songName', 'songNameEng'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {
    this.dbService.getAll<DivaPv>('divaPv').subscribe(
      x => {
        x.forEach(y => this.pvList.push(y));
        this.dataSource.data = this.pvList;
      }
    );
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
