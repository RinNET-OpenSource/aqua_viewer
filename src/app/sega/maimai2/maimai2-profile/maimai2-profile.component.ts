import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {HttpParams} from '@angular/common/http';
import {DisplayMaimai2Profile} from '../model/Maimai2Profile';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {UdemaeName, ClassName} from '../model/Maimai2Enums';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-maimai2-profile',
  templateUrl: './maimai2-profile.component.html',
  styleUrls: ['./maimai2-profile.component.css']
})
export class Maimai2ProfileComponent implements OnInit {

  profile: DisplayMaimai2Profile;
  udemaeRank = UdemaeName;
  classRank = ClassName;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    const aimeId = String(this.userService.currentUser.defaultCard.extId);
    const param = new HttpParams().set('aimeId', aimeId);
    this.api.get('api/game/maimai2/profile', param).subscribe(
      data => {
        this.profile = data;
      },
      error => this.messageService.notice(error)
    );
  }
  getFormattedNumberByDigit(input: number, digit: number): string {
    return input.toString().padStart(digit, '0');
  }

}
