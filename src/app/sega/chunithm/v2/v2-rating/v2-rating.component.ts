import {Component, OnInit, Version} from '@angular/core';
import {MessageService} from '../../../../message.service';
import {ApiService} from '../../../../api.service';
import {HttpParams} from '@angular/common/http';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {environment} from '../../../../../environments/environment';
import { UserService } from 'src/app/user.service';
import {lastValueFrom} from 'rxjs';
import {ChusanMusic} from '../model/ChusanMusic';
import {V2SongScoreRankingComponent} from '../v2-song-score-ranking/v2-song-score-ranking.component';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {compareVersions} from 'compare-versions';

@Component({
  selector: 'app-v2-rating',
  templateUrl: './v2-rating.component.html',
  styleUrls: ['./v2-rating.component.scss']
})
export class V2RatingComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  romVersion: string;
  playerRating: number;
  highestRating: number;
  calcRating: number;
  loadingRating = true;
  loadingRecent = true;
  topRating: RatingItem[] = undefined;
  newRating: RatingItem[] = undefined;
  recentRating: RatingItem[] = undefined;
  topTotal = 0;
  newTotal = 0;
  recentTotal = 0;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    private offcanvasService: NgbOffcanvas,
    private dbService: NgxIndexedDBService,
  ) {
  }

  async ngOnInit() {
    const aimeId = String(this.userService.currentUser.defaultCard.extId);
    const param = new HttpParams().set('aimeId', aimeId);
    const profile = await lastValueFrom(this.api.get('api/game/chuni/v2/profile', param));
    if (!profile) { return; }
    this.romVersion = profile.lastRomVersion;
    this.playerRating = profile.playerRating;
    this.highestRating = profile.highestRating;
    if (compareVersions(this.romVersion, '2.30.00') >= 0){
      // b50
      const data = await lastValueFrom(this.api.get('api/game/chuni/v2/verse-rating', param));
      if (data) {
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
        this.calcRating = (this.topTotal + this.newTotal) / 50;
      }
      this.loadingRating = false;
      this.loadingRecent = false;
    }
    else{
      // b30
      const best = await lastValueFrom(this.api.get('api/game/chuni/v2/rating', param));
      if (best) {
        this.topRating = best;
        if (this.topRating.length === 0) {
          this.messageService.notice('No Data');
        }
        this.topRating.forEach(item => this.topTotal += item.rating);
      }
      this.loadingRating = false;

      const recent = await lastValueFrom(this.api.get('api/game/chuni/v2/rating/recent', param));
      if (recent) {
        this.recentRating = recent;
        if (this.recentRating.length === 0) {
          this.messageService.notice('No Data');
        }
        this.recentRating.forEach(item => this.recentTotal += item.rating);
      }
      this.loadingRecent = false;

      if (best && recent){
        this.calcRating = (this.topTotal + this.recentTotal) / 40;
      }
    }
  }

  showDetail(musicId: number) {
    this.dbService.getByID<ChusanMusic>('chusanMusic', musicId).subscribe({
      next: (music: ChusanMusic) => {
        const offcanvasRef = this.offcanvasService.open(V2SongScoreRankingComponent, {
          position: 'end',
          scroll: false,
        });
        offcanvasRef.componentInstance.music = music;
      },
      error: (err: Error) => {
        this.messageService.notice(err.message, 'danger');
      }
    });
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
