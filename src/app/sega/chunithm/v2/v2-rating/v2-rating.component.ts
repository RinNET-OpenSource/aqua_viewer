import {Component, OnInit, Version} from '@angular/core';
import {MessageService} from '../../../../message.service';
import {ApiService} from '../../../../api.service';
import {HttpParams} from '@angular/common/http';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {environment} from '../../../../../environments/environment';
import { UserService } from 'src/app/user.service';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-v2-rating',
  templateUrl: './v2-rating.component.html',
  styleUrls: ['./v2-rating.component.scss']
})
export class V2RatingComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  romVersion: Version;
  verseVersion = new Version('2.30.00');
  topRating: RatingItem[] = [];
  newRating: RatingItem[] = [];
  recentRating: RatingItem[] = [];
  topTotal = 0;
  newTotal = 0;
  recentTotal = 0;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService
  ) {
  }

  async ngOnInit() {
    const aimeId = String(this.userService.currentUser.defaultCard.extId);
    const param = new HttpParams().set('aimeId', aimeId);
    const profile = await lastValueFrom(this.api.get('api/game/chuni/v2/profile', param));
    if (!profile) { return; }
    this.romVersion = new Version(profile.lastRomVersion);
    if (this.romVersion >= new Version('2.30.00')){
      // b50
      this.api.get('api/game/chuni/v2/verse-rating', param).subscribe(
        data => {
          this.topRating = data.old;
          if (this.topRating.length === 0) {
            this.messageService.notice('No Data');
          }
          this.newRating = data.new;
          if (this.newRating.length === 0) {
            this.messageService.notice('No Data');
          }
          this.topRating.forEach(item => this.topTotal += item.rating);
          this.newRating.forEach(item => this.newTotal += item.rating);
          this.newRating.forEach(item => console.log(item.rating.toString()));
        },
        error => this.messageService.notice(error)
      );
    }
    else{
      // b30
      this.api.get('api/game/chuni/v2/rating', param).subscribe(
        data => {
          this.topRating = data;
          if (this.topRating.length === 0) {
            this.messageService.notice('No Data');
          }
          this.topRating.forEach(item => this.topTotal += item.rating);
        },
        error => this.messageService.notice(error)
      );
      this.api.get('api/game/chuni/v2/rating/recent', param).subscribe(
        data => {
          this.recentRating = data;
          if (this.recentRating.length === 0) {
            this.messageService.notice('No Data');
          }
          this.recentRating.forEach(item => this.recentTotal += item.rating);
        },
        error => this.messageService.notice(error)
      );
    }
  }

}

export interface RatingItem {
  musicId: number;
  musicName: string;
  artistName: string;
  level: number;
  score: number;
  ratingBase: number;
  rating: number;
}
