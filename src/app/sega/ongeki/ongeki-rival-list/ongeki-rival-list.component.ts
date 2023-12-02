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
import { MatSort, MatSortable } from '@angular/material/sort';

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
    this.aimeId = String(this.auth.currentAccountValue.currentCard);
  }

  ngOnInit() {
    const param = new HttpParams().set('aimeId', this.aimeId);

    this.api.get('api/game/ongeki/rival', param).subscribe(
      this.refreshFrom.bind(this),
      error => this.messageService.notice(`get rival list failed : ${error}`)
    );
  }

  refreshFrom(rivalList: OngekiRival[]) {
    this.rivalList = rivalList;
    this.dataSource.data = this.rivalList;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  removeRival(rivalUserId: number) {
    let param = new HttpParams().set('aimeId', this.aimeId).set('rivalAimeId', rivalUserId);
    this.api.delete(`api/game/ongeki/rival`, param).subscribe(
      () => {
        var newList = this.rivalList.filter(item => item.rivalUserId != rivalUserId);
        this.messageService.notice(`(id:${rivalUserId}) delete successfully.`);
        this.refreshFrom(newList);
      },
      error => this.messageService.notice(`remove rival failed : ${error}`)
    );
  }

  addRival() {
    let param = new HttpParams().set('aimeId', this.aimeId).set('rivalAimeId', Number.parseInt(this.inputAddRivalUserId));
    this.api.post(`api/game/ongeki/rival`, param).subscribe(
      (data: ObjectMessageResponse<OngekiRival>) => {
        if (data != null) {
          if (data.data != null) {
            if (this.rivalList.find(x => x.rivalUserId == data.data.rivalUserId) == null) {
              this.rivalList.push(data.data);
              this.refreshFrom(this.rivalList);
              this.messageService.notice(`add rival (id:${data.data.rivalUserId}) successfully.`);
            }else{
              this.messageService.notice(`rival (id:${data.data.rivalUserId}) has been added.`);
            }
          } else
            this.messageService.notice(`add rival (id:${this.inputAddRivalUserId}) failed: ${data.message}.`);
        }
      },
      error => this.messageService.notice(`add rival failed : ${error}`)
    );
  }
}
