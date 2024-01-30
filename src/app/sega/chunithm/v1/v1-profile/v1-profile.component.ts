import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../../../message.service';
import {V1Profile} from '../model/V1Profile';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-v1-profile',
  templateUrl: './v1-profile.component.html',
  styleUrls: ['./v1-profile.component.css']
})
export class V1ProfileComponent implements OnInit {

  profile: V1Profile;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    const aimeId = String(this.auth.currentAccountValue.currentCard.extId);
    const param = new HttpParams().set('aimeId', aimeId);
    this.api.get('api/game/chuni/v1/profile', param).subscribe(
      data => {
        this.profile = data;
      },
      error => this.messageService.notice(error)
    );
  }

  getRatingRank(s: number): number {
    switch (true) {
      case (s < 2.0):
        return 1;
      case (s < 4.0):
        return 2;
      case (s < 7.0):
        return 3;
      case (s < 10.0):
        return 4;
      case (s < 12.0):
        return 5;
      case (s < 13.0):
        return 6;
      case (s < 14.0):
        return 7;
      case (s < 14.5):
        return 8;
      case (s < 15.0):
        return 9;
      case (s >= 15.0):
        return 10;
    }
  }

  formatNumber(value: number, length?: number): string {
    let str = value.toString();
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

  getClass(v: number): number {
    switch (true) {
      case (v === 10):
        return 1;
      case (v === 11):
        return 2;
      case (v === 12):
        return 3;
      case (v === 13):
        return 4;
      case (v === 14):
        return 5;
      case (v === 20):
        return 6; // infinity
      case (v === 21):
        return 7; // class unknown
    }
  }

}


