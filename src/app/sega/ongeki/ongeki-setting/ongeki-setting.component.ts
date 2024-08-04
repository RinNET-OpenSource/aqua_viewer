import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {MessageService} from '../../../message.service';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DisplayOngekiProfile} from '../model/OngekiProfile';
import {environment} from '../../../../environments/environment';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {OngekiNameSettingComponent} from './ongeki-name-setting/ongeki-name-setting.component';
import {UserService} from 'src/app/user.service';
import {AccountService} from 'src/app/auth/account.service';
import {OngekiVersionSettingComponent} from './ongeki-version-setting/ongeki-version-setting.component';

@Component({
  selector: 'app-ongeki-setting',
  templateUrl: './ongeki-setting.component.html',
  styleUrls: ['./ongeki-setting.component.css']
})
export class OngekiSettingComponent implements OnInit {

  profile: DisplayOngekiProfile;

  aimeId: string;
  apiServer: string;
  version: string;

  dialogOptions: NgbModalOptions = {
    centered: true,
  };

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private http: HttpClient,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    this.apiServer = environment.apiServer;
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/ongeki/profile', param).subscribe(
      data => {
        this.profile = data;
      },
      error => this.messageService.notice(error)
    );
  }

  downloadFile(): void {
    const url = this.apiServer + 'api/game/ongeki/export';
    const headers = {Authorization: `Bearer ${this.accountService.currentAccountValue.accessToken}`};
    this.http.get(url, {headers, responseType: 'blob'}).subscribe(blob => {
      const objectUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'ongeki_' + this.aimeId + '_exported.json';
      a.click();
      document.body.appendChild(a);
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);
      this.messageService.notice('Ongeki Download Over');
    }, error => this.messageService.notice(error));
  }

  userName() {
    const dialogRef = this.modalService.open(OngekiNameSettingComponent, this.dialogOptions);
    dialogRef.componentInstance.data = {userName: this.profile.userName};
    dialogRef.componentInstance.parentComponent = this;
  }

  handleUserNameApplyClick(data: { userName: string }) {
    if (data.userName) {
      this.api.post('api/game/ongeki/profile/userName', {userName: data.userName}).subscribe(
        x => {
          this.profile = x;
          this.messageService.notice('Successfully changed');
          this.modalService.dismissAll();
        }, error => this.messageService.notice(error)
      );
    }
  }

  dataVersion() {
    const dialogRef = this.modalService.open(OngekiVersionSettingComponent, this.dialogOptions);
    console.log(this.profile);
    dialogRef.componentInstance.data = { version: this.profile.lastDataVersion, type: 1 };
    dialogRef.componentInstance.parentComponent = this;
  }

  handleVersionApplyClick(data: { version: string, type: number }) {
    if (data.version && data.type) {
      console.log(data.version, data.type);
      console.log(this.aimeId);
      this.api.put('api/game/ongeki/profile/dataversion', { dataVersion: data.version }).subscribe(
        x => {
          console.log(x);
          this.profile = x;
          this.messageService.notice('Updated Ongeki Version OK');
          this.modalService.dismissAll();
        }, error => this.messageService.notice(error)
      );
    }
  }
}
