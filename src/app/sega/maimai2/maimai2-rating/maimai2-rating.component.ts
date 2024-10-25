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
        best35RatingItem.rating = this.calcRate(best35RatingItem.ratingBase, best35RatingItem.score);
        this.b35rating += best35RatingItem.rating;
        if (best35RatingItem.rating > minRating) {
          minRating = best35RatingItem.rating;
        }
        this.playerRating = this.b35rating + this.b15rating;
        const maxRating = minRating + this.getRatingGrowth(minRating);
        this.recommendTripleSPlus = this.get_TargetDs(minRating, maxRating, 1005000);
        this.recommendTripleS = this.get_TargetDs(minRating, maxRating, 1000000);
        this.recommendSSPlus = this.get_TargetDs(minRating, maxRating, 995000);
        this.recommendSS = this.get_TargetDs(minRating, maxRating, 990000);
        this.recommendSPlus = this.get_TargetDs(minRating, maxRating, 980000);

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
        best15RatingItem.rating = this.calcRate(best15RatingItem.ratingBase, best15RatingItem.score);
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
          const detail = musicInfo?.details[Number(value[1])];
          const item: RatingItem = {
            musicId: Number(value[0]),
            level: Number(value[1]),
            romVersion: Number(value[2]),
            score: Number(value[3]),
            artistName: musicInfo?.artistName ?? 'Unknown Artist',
            ratingBase: detail?.levelDecimal ?? 'None',
            rating: 0,
            musicName: musicInfo?.name ?? `MusicID: ${value[0]}`,
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

  calcRate(level: number, achive: number): number {
    const records: { achive: number, offset: number}[] = [
      { achive: 0, offset: 0 },
      { achive: 100000, offset: 16 },
      { achive: 200000, offset: 32 },
      { achive: 300000, offset: 48 },
      { achive: 400000, offset: 64 },
      { achive: 500000, offset: 80 },
      { achive: 600000, offset: 96 },
      { achive: 700000, offset: 112 },
      { achive: 750000, offset: 120 },
      { achive: 799999, offset: 128 },
      { achive: 800000, offset: 136 },
      { achive: 900000, offset: 152 },
      { achive: 940000, offset: 168 },
      { achive: 969999, offset: 176 },
      { achive: 970000, offset: 200 },
      { achive: 980000, offset: 203 },
      { achive: 989999, offset: 206 },
      { achive: 990000, offset: 208 },
      { achive: 995000, offset: 211 },
      { achive: 999999, offset: 214 },
      { achive: 1000000, offset: 216 },
      { achive: 1004999, offset: 222 },
      { achive: 1005000, offset: 224 }
    ];

    let num = 0;
    const num2 = Math.min(achive, records[22].achive);

    for (let i = 22; i >= 0; i--) {
      if (records[i].achive <= num2) {
        num = records[i].offset;
        break;
      }
    }

    const scoreRate = level;
    return Math.floor((scoreRate * num2 * num) / 100000000);
  }


  get_TargetDs(ra: number, maxra: number, rank: number): Record<number, number> {
    const result: Record<number, number> = {};
    for (let d = 10; d <= 150; d += 1) {
      const computedRa = this.calcRate(d, rank);
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
