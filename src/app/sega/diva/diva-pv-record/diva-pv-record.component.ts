import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {HttpParams} from '@angular/common/http';
import {Difficulty, DivaPvRecord, Edition, Result} from '../model/DivaPvRecord';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DivaPv} from '../model/DivaPv';

@Component({
  selector: 'app-diva-pv-record',
  templateUrl: './diva-pv-record.component.html',
  styleUrls: ['./diva-pv-record.component.css']
})
export class DivaPvRecordComponent implements OnInit {

  edition = Edition;
  difficulty = Difficulty;
  result = Result;

  pvRecords: DivaPvRecord[] = [];

  currentPage = 0;
  totalPages = 0;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    const pdId = String(this.auth.currentAccountValue.currentCard.extId);
    const param = new HttpParams().set('pdId', pdId).set('page', String(this.currentPage));
    this.api.get('api/game/diva/pvRecord', param).subscribe(
      data => {
        if (data.content.length === 0) {
          this.messageService.notice('No more record');
          return;
        }
        this.currentPage = data.page + 1;
        this.totalPages = data.totalPages;
        data.content.forEach(x => {
          this.pvRecords.push(x);
        });
        this.pvRecords.forEach(x => {
          if (!x.songInfo) {
            this.dbService.getByID<DivaPv>('divaPv', x.pvId).subscribe(
              m => x.songInfo = m
            );
          }
        });
      },
      error => this.messageService.notice(error)
    );
  }

}
