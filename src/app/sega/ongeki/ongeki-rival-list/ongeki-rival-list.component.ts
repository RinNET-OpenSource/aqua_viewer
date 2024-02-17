import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { OngekiRival } from '../model/OngekiRival';
import { HttpParams } from '@angular/common/http';
import { AuthenticationService } from '../../../auth/authentication.service';
import { ApiService } from '../../../api.service';
import { MessageService } from '../../../message.service';
import { environment } from '../../../../environments/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StatusCode} from '../../../status-code';
@Component({
  selector: 'app-ongeki-rival-list',
  templateUrl: './ongeki-rival-list.component.html',
  styleUrls: ['./ongeki-rival-list.component.css']
})

export class OngekiRivalListComponent implements OnInit {
  host = environment.assetsHost;
  rivalList: OngekiRival[] = [];
  myProfile: OngekiRival;
  loadingProfile = true;
  loadingRival = true;

  inputAddRivalUserId = '';

  constructor(
    private dbService: NgxIndexedDBService,
    private api: ApiService,
    private modalService: NgbModal,
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
    const param = new HttpParams().set('rivalUserId', rivalUserId);
    this.api.delete(`api/game/ongeki/rival`, param).subscribe(
      () => {
        const newList = this.rivalList.filter(item => item.rivalUserId !== rivalUserId);
        this.messageService.notice(`(id:${rivalUserId}) delete successfully.`);
        this.refreshFrom(newList);
      },
      error => this.messageService.notice(`remove rival failed : ${error}`)
    );
  }

  addRival() {
    const param = new HttpParams().set('rivalUserId', (Number).parseInt(this.inputAddRivalUserId));
    this.api.post(`api/game/ongeki/rival`, param).subscribe(
      (data) => {
        if (data?.status) {
          const statusCode: StatusCode = data.status.code;
          if (statusCode === StatusCode.OK && data.data) {
            this.rivalList.push(data.data);
            this.refreshFrom(this.rivalList);
            this.messageService.notice(`Add rival (id:${data.data.rivalUserId}) successfully.`);
          }
          else if (statusCode === StatusCode.RIVAL_SELF){
            this.messageService.notice(`Can't add your self as an rival`, 'danger');
          }
          else if (statusCode === StatusCode.RIVAL_ALREADY_ADDED){
            this.messageService.notice(`Rival already added`, 'danger');
          }
          else if (statusCode === StatusCode.RIVAL_NOTFOUND){
            this.messageService.notice(`Rival not found`, 'danger');
          }
          else{
            this.messageService.notice(data.status.message, 'danger');
          }
        }
      },
      error => this.messageService.notice(`add rival failed : ${error}`)
    );
  }

  open(content) {
    this.modalService.open(content, {centered: true});
  }
}
