import {Component} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {ChusanProfile, ChusanRival} from '../model/ChusanRival';
import {ApiService} from '../../../../api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {HttpParams} from '@angular/common/http';
import {StatusCode} from '../../../../status-code';

@Component({
  selector: 'app-v2-rival-list',
  templateUrl: './v2-rival-list.component.html',
  styleUrls: ['./v2-rival-list.component.css']
})
export class V2RivalListComponent {
  host = environment.assetsHost;
  rivalList: ChusanRival[] = [];
  chusanProfile: ChusanProfile;
  loadingProfile = true;
  loadingRival = true;
  aimeId: string;

  inputAddRivalUserId = '';

  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    protected auth: AuthenticationService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.aimeId = String(this.auth.currentAccountValue.currentCard.extId);
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/chuni/v2/rival', param).subscribe(
      this.refreshFrom.bind(this),
      error => {
        this.messageService.notice(`get rival list failed : ${error}`);
        this.loadingRival = false;
      }
    );

    this.api.get('api/user/profiles').subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK && resp.data) {
            this.chusanProfile = resp.data.chusan;
          }
          else {
            this.messageService.notice(resp.status.message);
          }
          this.loadingProfile = false;
        }
      }
    );
  }

  refreshFrom(rivalList: ChusanRival[]) {
    this.rivalList = rivalList;
    this.loadingRival = false;
  }

  addRival() {
    const param = new HttpParams().set('rivalId', (Number).parseInt(this.inputAddRivalUserId)).set('aimeId', this.aimeId);
    this.api.post('api/game/chuni/v2/rival', param).subscribe(
      data => {
        if (data) { this.ngOnInit(); }
      },
      error => this.messageService.notice(`add rival failed : ${error}`)
    );
  }

  removeRival(rivalUserId: string) {
    const param = new HttpParams().set('rivalId', (Number).parseInt(rivalUserId)).set('aimeId', this.aimeId);
    this.api.delete('api/game/chuni/v2/rival', param).subscribe(
      () => {
        const newList = this.rivalList.filter(item => item.rivalId !== rivalUserId);
        this.messageService.notice(`(id:${rivalUserId}) delete successfully.`);
        this.refreshFrom(newList);
      },
      error => this.messageService.notice(`remove rival failed : ${error}`)
    );
  }

  open(content) {
    this.modalService.open(content, {centered: true});
  }
}
