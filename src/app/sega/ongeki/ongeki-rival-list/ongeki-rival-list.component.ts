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
import { environment } from "../../../../environments/environment";
import {DisplayOngekiProfile} from "../model/OngekiProfile";

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
  host = environment.assetsHost;
  rivalList: OngekiRival[] = [];
  displayedColumns: string[] = ['rivalUserId', 'rivalUserName', 'opButton'];
  myProfile: OngekiRival;
  loadingProfile = true;
  loadingRival = true;

  inputAddRivalUserId = '';

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    protected auth: AuthenticationService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {

    this.api.get('api/game/ongeki/rival').subscribe(
      this.refreshFrom.bind(this),
      error => {
        this.messageService.notice(`get rival list failed : ${error}`);
        this.loadingRival = false;
      }
    );

    this.api.get(`api/game/ongeki/rival/${10000000 + this.auth.currentAccountValue.currentCard.id}`).subscribe(
      (data: OngekiRival) => {
        this.myProfile = data;
        this.loadingProfile = false;
      },
      (error) => {
        this.messageService.notice(error);
        this.loadingProfile = false;
      }
    );
  }

  refreshFrom(rivalList: OngekiRival[]) {
    this.rivalList = rivalList;
    this.loadingRival = false;
  }

  removeRival(rivalUserId: number) {
    let param = new HttpParams().set('rivalUserId', rivalUserId);
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
    const param = new HttpParams().set('rivalUserId', (Number).parseInt(this.inputAddRivalUserId));
    this.api.post(`api/game/ongeki/rival`, param).subscribe(
      (data: ObjectMessageResponse<OngekiRival>) => {
        if (data != null) {
          if (data.data != null) {
            if (this.rivalList.find(x => x.rivalUserId === data.data.rivalUserId) == null) {
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
