import {Component} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {ChusanRival} from '../model/ChusanRival';
import {ApiService} from '../../../../api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {HttpParams} from '@angular/common/http';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'app-v2-rival-list',
  templateUrl: './v2-rival-list.component.html',
  styleUrls: ['./v2-rival-list.component.css']
})
export class V2RivalListComponent {
  host = environment.assetsHost;
  rivalList: ChusanRival[] = [];
  myProfile: ChusanRival;
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
    console.log(10000000 + this.auth.currentAccountValue.currentCard.id);
    this.api.get('api/game/chuni/v2/rival', param).subscribe(
      this.refreshFrom.bind(this),
      error => {
        this.messageService.notice(`get rival list failed : ${error}`);
        this.loadingRival = false;
      }
    );

    // this.api.get(`api/game/chuni/v2/rival/${10000000 + this.auth.currentAccountValue.currentCard.id}`).subscribe(
    //   (data: ChusanRival) => {
    //     console.log(data);
    //   },
    //   (err) => {
    //     this.messageService.notice(err);
    //     this.loadingProfile = false;
    //   }
    // );
  }

  refreshFrom(rivalList: ChusanRival[]) {
    this.rivalList = rivalList;
    this.loadingRival = false;
  }

  addRival() {

  }

  removeRival(rivalUserId: number) {

  }

  open(content) {
    this.modalService.open(content, {centered: true});
  }
}
