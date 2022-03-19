import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {MatDialog} from '@angular/material/dialog';
import {V1Profile} from '../model/V1Profile';
import {HttpParams} from '@angular/common/http';
import {V1NameSettingDialog} from './v1-name-setting/v1-name-setting.dialog';

@Component({
  selector: 'app-v1-setting',
  templateUrl: './v1-setting.component.html',
  styleUrls: ['./v1-setting.component.css']
})
export class V1SettingComponent implements OnInit {

  profile: V1Profile;
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
    this.api.get('api/game/chuni/v1/profile', param).subscribe(
      data => {
        this.profile = data;
      },
      error => this.messageService.notice(error)
    );
  }

  userName() {
    const dialogRef = this.dialog.open(V1NameSettingDialog, {
      width: '250px',
      data: {userName: this.profile.userName}
    });

    dialogRef.afterClosed().subscribe(userName => {
      if (userName) {
        this.api.put('api/game/chuni/v1/profile/userName', {aimeId: this.aimeId, userName}).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('Successfully changed');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }
}
