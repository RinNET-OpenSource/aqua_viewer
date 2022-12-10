import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OngekiRival } from '../model/OngekiRival';
import { HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../../../auth/authentication.service';
import { ApiService } from '../../../api.service';
import { MessageService } from '../../../message.service';
import { Key } from 'protractor';

const DBTable = 'ongekiRival';
type ObjectMessageResponse<T> = {
  data: T,
  message: string
}

@Component({
  selector: 'app-ongeki-rival-list',
  templateUrl: './ongeki-rival-list.component.html',
  styleUrls: ['./ongeki-rival-list.component.css']
})

export class OngekiRivalListComponent implements OnInit {
  rivalList: OngekiRival[] = [];
  displayedColumns: string[] = ['rivalUserId', 'rivalUserName', 'opButton'];
  dataSource = new MatTableDataSource();
  aimeId: string;

  inputAddRivalUserId: string = "";

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
  ) {
    this.aimeId = String(this.auth.currentUserValue.extId);
  }

  ngOnInit() {
    let param = new HttpParams().set('aimeId', this.aimeId);

    this.api.get('api/game/ongeki/rival', param).subscribe(
      (data: OngekiRival[]) => {
        this.rivalList = data;
        this.dataSource.data = this.rivalList;

        this.dbService.bulkAdd<OngekiRival>(DBTable, this.rivalList).subscribe(
          () => this.refreshFromDB(), error => {
            console.error(error);
          }
        );
      },
      error => this.messageService.notice(`get rival list failed : ${error}`)
    );
  }

  refreshFromDB() {
    this.dbService.getAll<OngekiRival>(DBTable).subscribe(
      x => {
        this.rivalList = x;
        this.dataSource.data = this.rivalList;

        //this.messageService.notice('refresh rival list successfully.');
        console.log('refresh rival list successfully.');
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  removeRival(rivalUserId: number) {
    let param = new HttpParams().set('aimeId', this.aimeId).set('rivalAimeId', rivalUserId);
    this.api.delete(`api/game/ongeki/rival`, param).subscribe(
      () => {
        this.dbService.deleteByKey(DBTable, rivalUserId).subscribe(isSuccess => {
          this.messageService.notice(`(id:${rivalUserId}) delete ${isSuccess ? 'successfully' : 'failed'}.`);
          this.refreshFromDB();
        });
      },
      error => this.messageService.notice(`remove rival failed : ${error}`)
    );
  }

  addRival() {
    let param = new HttpParams().set('aimeId', this.aimeId).set('rivalAimeId', Number.parseInt(this.inputAddRivalUserId));
    this.api.post(`api/game/ongeki/rival`, param).subscribe(
      (data: ObjectMessageResponse<OngekiRival>) => {
        if (data != null) {
          this.dbService.add(DBTable, data.data).subscribe(() => {
            this.messageService.notice(`add rival (id:${data.data.rivalUserId}) ${data.data != null ? 'successfully' : 'failed: ' + data.message}.`);
            this.refreshFromDB();
          });
        }
      },
      error => this.messageService.notice(`add rival failed : ${error}`)
    );
  }
}
