import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ApiService} from '../../../api.service';
import {UserService} from '../../../user.service';
import {MessageService} from '../../../message.service';
import {HttpParams} from '@angular/common/http';
import {forEach, toNumber} from 'lodash';
import {firstValueFrom} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {OngekiMusic} from '../../ongeki/model/OngekiMusic';
import {Maimai2Music} from '../model/Maimai2Music';

@Component({
  selector: 'app-maimai2-rating',
  templateUrl: './maimai2-rating.component.html',
  styleUrls: ['./maimai2-rating.component.scss']
})
export class Maimai2RatingComponent implements OnInit {
  /*
   Line
   0:S+
   1:SS
   2:SS+
   3:SSS
   4:SSS+
   */

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  host = environment.assetsHost;
  best35Rating: RatingItem[] ;
  best15Rating: RatingItem[];
  playerRating = 0;
  b35rating = 0;
  b15rating = 0;
  recommendTripleSPlus: Record<number, number> = {};
  recommendTripleS: Record<number, number> = {};
  recommendSSPlus: Record<number, number> = {};
  recommendSS: Record<number, number> = {};
  recommendSPlus: Record<number, number> = {};
  displayRatingTableHeader: number[] = [0, 0, 0, 0, 0];
  displayRatingRecommendation: number[][] = [];


  protected readonly toNumber = toNumber;

  async ngOnInit() {
    const aimeId = String(this.userService.currentUser.defaultCard.extId);

    // Download Rating here
    this.loadRating(aimeId, 'rating', (ratings: RatingItem[]) => {
       this.best35Rating = ratings;
       let minRating = 0;
       for (const best35RatingItem of this.best35Rating) {
        best35RatingItem.rating = this.computeRa(best35RatingItem.ratingBase / 10.0, best35RatingItem.score / 10000.0);
        this.b35rating += best35RatingItem.rating;
        if (best35RatingItem.rating > minRating) {
          minRating = best35RatingItem.rating;
        }
        this.playerRating = this.b35rating + this.b15rating;
        const maxRating = minRating + this.getRatingGrowth(minRating);
        this.recommendTripleSPlus = this.get_TargetDs(minRating, maxRating, 100.5);
        this.recommendTripleS = this.get_TargetDs(minRating, maxRating, 100);
        this.recommendSSPlus = this.get_TargetDs(minRating, maxRating, 99.5);
        this.recommendSS = this.get_TargetDs(minRating, maxRating, 99);
        this.recommendSPlus = this.get_TargetDs(minRating, maxRating, 98);

        const ratingBases = Object.keys(this.recommendTripleSPlus).map(Number);

        ratingBases.sort((a: number, b: number) => a - b);

        const percentiles = [0.2, 0.4, 0.6, 0.8, 1.0];
        const preTableHeader = percentiles.map(percentile => {
          const index = Math.ceil(percentile * ratingBases.length) - 1;
          return ratingBases[index];
        });

        let n = 4;
        let lastContent = 0;
        for (let i = 4; i >= 0; i--) {
          if (preTableHeader[i] !== lastContent) {
            this.displayRatingTableHeader[n] = preTableHeader[i];
            lastContent = preTableHeader[i];
            n--;
          }
        }
      }
    });
    this.loadRating(aimeId, 'new_rating', (ratings: RatingItem[]) => {
      this.best15Rating = ratings;
      for (const best15RatingItem of this.best15Rating) {
        best15RatingItem.rating = this.computeRa(best15RatingItem.ratingBase / 10.0, best15RatingItem.score / 10000.0);
        this.b15rating += best15RatingItem.rating;
        this.playerRating = this.b35rating + this.b15rating;
      }
    });



  }

  loadRating(aimeId: string, type: string, callback: (list: RatingItem[]) => void): void {
    const param = new HttpParams().set('aimeId', aimeId);

    const list: RatingItem[] = [];

    this.api.get('api/game/maimai2/' + type, param).subscribe(
      async data => {
        const records = data.data.toString().split(',');
        for (const record of records) {
          const value = record.split(':');
          const musicInfo = await firstValueFrom(this.dbService.getByID<Maimai2Music>('maimai2Music', Number(value[0])));
          if (musicInfo.details[Number(value[1])] == null){
            continue;
          }
          const detail = musicInfo.details[Number(value[1])];
          const item: RatingItem = {
            musicId: Number(value[0]),
            level: Number(value[1]),
            romVersion: Number(value[2]),
            score: Number(value[3]),
            artistName: musicInfo.artistName,
            ratingBase: detail.levelDecimal,
            rating: 0,
            musicName: musicInfo.name,
          };
          list.push(item);
        }
        if (list.length === 0) {
          this.messageService.notice('Warning: Rating is empty!');
        }
        callback(list);
      },
      error => {
        this.messageService.notice(error);
        callback([]);
      }
    );
  }

  getRatingInfoByBase(ratingBase: number, rank: number): string{
    switch (rank){
      case 0:
        if (this.recommendSPlus[ratingBase] !== undefined){
          return String(this.recommendSPlus[ratingBase]);
        }
        break;
      case 1:
        if (this.recommendSS[ratingBase] !== undefined){
          return String(this.recommendSS[ratingBase]);
        }
        break;
      case 2:
        if (this.recommendSSPlus[ratingBase] !== undefined){
          return String(this.recommendSSPlus[ratingBase]);
        }
        break;
      case 3:
        if (this.recommendTripleS[ratingBase] !== undefined){
          return String(this.recommendTripleS[ratingBase]);
        }
        break;
      case 4:
        if (this.recommendTripleSPlus[ratingBase] !== undefined){
          return String(this.recommendTripleSPlus[ratingBase]);
        }
        break;
      default:
        return '';
    }
    return ' ';
  }

  getRatingGrowth(playerRating: number): number{
    if (playerRating <= 200){
      return 50;
    }
    if (playerRating <= 250){
      return 40;
    }
    if (playerRating <= 300){
      return 30;
    }
    return 20;
  }

  computeRa(ds: number, achievement: number): number {
    let baseRa = 22.4;
    if (achievement < 50) {
      baseRa = 7.0;
    } else if (achievement < 60) {
      baseRa = 8.0;
    } else if (achievement < 70) {
      baseRa = 9.6;
    } else if (achievement < 75) {
      baseRa = 11.2;
    } else if (achievement < 80) {
      baseRa = 12.0;
    } else if (achievement < 90) {
      baseRa = 13.6;
    } else if (achievement < 94) {
      baseRa = 15.2;
    } else if (achievement < 97) {
      baseRa = 16.8;
    } else if (achievement < 98) {
      baseRa = 20.0;
    } else if (achievement < 99) {
      baseRa = 20.3;
    } else if (achievement < 99.5) {
      baseRa = 20.8;
    } else if (achievement < 100) {
      baseRa = 21.1;
    } else if (achievement < 100.5) {
      baseRa = 21.6;
    }
    return Math.floor(ds * (Math.min(100.5, achievement) / 100) * baseRa);
  }

  get_TargetDs(ra: number, maxra: number, rank: number): Record<number, number> {
    const result: Record<number, number> = {};
    for (let d = 10; d <= 150; d += 1) {
      const computedRa = this.computeRa(d / 10.0, rank);
      if (computedRa > ra && computedRa <= maxra) {
        result[d] = computedRa;
      }
    }
    return result;
  }

  getJacketId(input: number): string {
    const inputString = input.toString();
    const lastFourDigits = inputString.slice(-4);
    return lastFourDigits.padStart(6, '0');
  }
  imgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.host + 'assets/mai2/jacket/UI_Jacket_000000.webp';
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
  romVersion: number;
}
