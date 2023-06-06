import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {HttpParams} from '@angular/common/http';
import {DivaPlayLog} from '../model/DivaPlayLog';
import {Difficulty, Edition, Result} from '../model/DivaPvRecord';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DivaPv} from '../model/DivaPv';
import {DivaModule} from '../model/DivaModule';

@Component({
  selector: 'app-diva-recent',
  templateUrl: './diva-recent.component.html',
  styleUrls: ['./diva-recent.component.css']
})
export class DivaRecentComponent implements OnInit {

  edition = Edition;
  difficulty = Difficulty;
  result = Result;

  playLogList: DivaPlayLog[] = [];

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
    const pdId = String(this.auth.currentUserValue.currentCard);
    const param = new HttpParams().set('pdId', pdId).set('page', String(this.currentPage));
    this.api.get('api/game/diva/playLog', param).subscribe(
      data => {
        if (data.content.length === 0) {
          this.messageService.notice('No more record');
          return;
        }
        this.currentPage = data.page + 1;
        this.totalPages = data.totalPages;
        data.content.forEach(x => {
          this.playLogList.push(x);
        });

        this.playLogList.forEach(x => {
          if (!x.songInfo) {
            this.dbService.getByID<DivaPv>('divaPv', x.pvId).subscribe(y => {
              x.songInfo = y;
              const p = x.songInfo.performerNumber;
              const moduleIds = x.modules.split(',');
              x.modulesInfo = [];
              if (p > 0) {
                this.dbService.getByID<DivaModule>('divaModule', moduleIds[0]).subscribe(y => x.modulesInfo[0] = y);
              }
              if (p > 1) {
                this.dbService.getByID<DivaModule>('divaModule', moduleIds[1]).subscribe(y => x.modulesInfo[1] = y);
              }
              if (p > 2) {
                this.dbService.getByID<DivaModule>('divaModule', moduleIds[2]).subscribe(y => x.modulesInfo[2] = y);
              }
            });
          }
        });
      },
      error => this.messageService.notice(error)
    );
  }

}
