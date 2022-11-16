import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {MatDialog} from '@angular/material/dialog';
import {V2Profile} from '../model/V2Profile';
import {HttpParams} from '@angular/common/http';
import {V2NameSettingDialog} from './v2-name-setting/v2-name-setting.dialog';
import {V2VersionSettingDialog} from './v2-version-setting/v2-version-setting.dialog';

@Component({
  selector: 'app-v2-setting',
  templateUrl: './v2-setting.component.html',
  styleUrls: ['./v2-setting.component.css']
})
export class V2SettingComponent implements OnInit {

  profile: V2Profile;
  aimeId: string;
  apiServer: string;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.aimeId = String(this.auth.currentUserValue.extId);
    this.apiServer = this.auth.currentUserValue.apiServer;
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/chuni/v2/profile', param).subscribe(
      data => {
        this.profile = data;
      },
      error => this.messageService.notice(error)
    );
  }

  userName() {
    const dialogRef = this.dialog.open(V2NameSettingDialog, {
      width: '250px',
      data: {userName: this.profile.userName}
    });

    dialogRef.afterClosed().subscribe(userName => {
      if (userName) {
        this.api.put('api/game/chuni/v2/profile/username', {aimeId: this.aimeId, userName: userName}).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('Successfully changed');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  dataVersion() {
    const dialogRef = this.dialog.open(V2VersionSettingDialog, {
      width: '250px',
      data: {version: this.profile.lastDataVersion}
    });

    dialogRef.afterClosed().subscribe(version => {
      if (version) {
        this.api.put('api/game/chuni/v2/profile/dataversion', {aimeId: this.aimeId, dataVersion: version}).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('Successfully changed');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  romVersion() {
    const dialogRef = this.dialog.open(V2VersionSettingDialog, {
      width: '250px',
      data: {version: this.profile.lastRomVersion}
    });

    dialogRef.afterClosed().subscribe(version => {
      if (version) {
        this.api.put('api/game/chuni/v2/profile/romversion', {aimeId: this.aimeId, romVersion: version}).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('Successfully changed');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

}
