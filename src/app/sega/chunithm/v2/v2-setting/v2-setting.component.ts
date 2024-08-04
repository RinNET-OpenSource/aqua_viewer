import {AccountService} from 'src/app/auth/account.service';
import {Component, OnInit, Renderer2} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {V2Profile} from '../model/V2Profile';
import {HttpClient, HttpParams} from '@angular/common/http';
import {V2NameSettingDialog} from './v2-name-setting/v2-name-setting.dialog';
import {V2VersionSettingDialog} from './v2-version-setting/v2-version-setting.dialog';
import {environment} from '../../../../../environments/environment';
import {UserService} from 'src/app/user.service';

@Component({
  selector: 'app-v2-setting',
  templateUrl: './v2-setting.component.html',
  styleUrls: ['./v2-setting.component.css']
})
export class V2SettingComponent implements OnInit {

  profile: V2Profile;
  aimeId: string;
  apiServer: string;
  dialogOptions: NgbModalOptions = {
    centered: true,
  };
  version: string;
  type: number;

  constructor(
    private api: ApiService,
    private accountService: AccountService,
    private messageService: MessageService,
    private modalService: NgbModal,
    private http: HttpClient,
    private userService: UserService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    this.apiServer = environment.apiServer;
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/chuni/v2/profile', param).subscribe(
      data => {
        this.profile = data;
      },
      error => this.messageService.notice(error)
    );
  }

  handleUserNameApplyClick(data: { userName: string }) {
    if (data.userName) {
      this.api.put('api/game/chuni/v2/profile/username', {aimeId: this.aimeId, userName: data.userName}).subscribe(
        x => {
          this.profile = x;
          this.messageService.notice('Successfully changed');
          this.modalService.dismissAll();
        }, error => this.messageService.notice(error)
      );
    }
  }

  handleVersionApplyClick(data: { version: string, type: number }) {
    if (data.version && data.type === 1) {
      this.api.put('api/game/chuni/v2/profile/dataversion', {aimeId: this.aimeId, dataVersion: data.version}).subscribe(
        x => {
          this.profile = x;
          this.messageService.notice('Successfully changed');
          this.modalService.dismissAll();
        }, error => this.messageService.notice(error)
      );
    } else if (data.version && data.type === 2) {
      this.api.put('api/game/chuni/v2/profile/romversion', {aimeId: this.aimeId, romVersion: data.version}).subscribe(
        x => {
          this.profile = x;
          this.messageService.notice('Successfully changed');
          this.modalService.dismissAll();
        }, error => this.messageService.notice(error)
      );
    }
  }

  userName() {
    const dialogRef = this.modalService.open(V2NameSettingDialog, this.dialogOptions);
    dialogRef.componentInstance.data = { userName: this.profile.userName };
    dialogRef.componentInstance.parentComponent = this;
  }

  dataVersion() {
    const dialogRef = this.modalService.open(V2VersionSettingDialog, this.dialogOptions);
    dialogRef.componentInstance.data = { version: this.profile.lastDataVersion, type: 1 };
    dialogRef.componentInstance.parentComponent = this;
  }

  romVersion() {
    const dialogRef = this.modalService.open(V2VersionSettingDialog, this.dialogOptions);
    dialogRef.componentInstance.data = { version: this.profile.lastRomVersion, type: 2 };
    dialogRef.componentInstance.parentComponent = this;
  }

  downloadFile() {
    const url = this.apiServer + 'api/game/chuni/v2/export?aimeId=' + this.aimeId;
    const headers = { Authorization: `Bearer ${this.accountService.currentAccountValue.accessToken}` };
    this.http.get(url, { headers, responseType: 'blob' }).subscribe(blob => {
      const objUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = `chusan_${this.aimeId}_exported.json`;
      a.click();
      document.body.appendChild(a);
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objUrl);
      this.messageService.notice('Chunithm Download Over');
    }, error => this.messageService.notice(error));
  }
}
