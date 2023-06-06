import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DisplayOngekiProfile} from '../model/OngekiProfile';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-ongeki-setting',
  templateUrl: './ongeki-setting.component.html',
  styleUrls: ['./ongeki-setting.component.css']
})
export class OngekiSettingComponent implements OnInit {

  profile: DisplayOngekiProfile;

  aimeId: string;
  apiServer: string;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.aimeId = String(this.auth.currentUserValue.currentCard);
    this.apiServer = environment.apiServer;
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/ongeki/profile', param).subscribe(
      data => {
        this.profile = data;
      },
      error => this.messageService.notice(error)
    );
  }

}
