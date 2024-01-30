import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {DivaProfile} from '../model/DivaProfile';
import {HttpParams} from '@angular/common/http';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';

@Component({
  selector: 'app-diva-profile',
  templateUrl: './diva-profile.component.html',
  styleUrls: ['./diva-profile.component.css']
})
export class DivaProfileComponent implements OnInit {

  profile: DivaProfile;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    const pdId = String(this.auth.currentAccountValue.currentCard.extId);
    const param = new HttpParams().set('pdId', pdId);
    this.api.get('api/game/diva/playerInfo', param).subscribe(
      data => this.profile = data,
      error => this.messageService.notice(error)
    );
  }

}
