import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../../../message.service';
import {ApiService} from '../../../../api.service';
import {HttpParams} from '@angular/common/http';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-v2-rating',
  templateUrl: './v2-rating.component.html',
  styleUrls: ['./v2-rating.component.css']
})
export class V2RatingComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  topRating: RatingItem[] = [];
  recentRating: RatingItem[] = [];
  topTotal = 0;
  recentTotal = 0;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    const aimeId = String(this.auth.currentAccountValue.currentCard);
    const param = new HttpParams().set('aimeId', aimeId);
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

export interface RatingItem {
  musicId: number;
  musicName: string;
  artistName: string;
  level: number;
  score: number;
  ratingBase: number;
  rating: number;
}
