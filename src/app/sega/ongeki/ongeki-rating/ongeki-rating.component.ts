import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../../../environments/environment';
import {PlayerRatingItem} from '../model/PlayerRatingItem';
import {AttributeType, Difficulty} from '../model/OngekiEnums';
import {HttpParams} from '@angular/common/http';
import {OngekiMusic} from '../model/OngekiMusic';
import {DisplayOngekiProfile} from '../model/OngekiProfile';
import {firstValueFrom} from 'rxjs';
import {OngekiSongScoreRankingComponent} from '../ongeki-song-score-ranking/ongeki-song-score-ranking.component';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {StatusCode} from '../../../status-code';
import {ClearMarkType, PlayerNewRatingItem} from '../model/PlayerNewRatingItem';
import {NewRatingService, NewRatingType} from '../new-rating.service';

@Component({
  selector: 'app-ongeki-rating',
  templateUrl: './ongeki-rating.component.html',
  styleUrls: ['./ongeki-rating.component.css']
})
export class OngekiRatingComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;
  protected readonly ClearMarkType = ClearMarkType;
  protected readonly NewRatingType = NewRatingType;

  profile: DisplayOngekiProfile;

  ratingV1: RatingV1;
  ratingV2: RatingV2;

  avgRating: string;

  difficulty = Difficulty;
  attribute = AttributeType;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService,
    private offcanvasService: NgbOffcanvas,
    protected newRating: NewRatingService,
  ) {
  }

  ngOnInit() {
    const param = new HttpParams();
    this.api.get('api/game/ongeki/profile', param).subscribe(
      data => this.profile = data,
      error => this.messageService.notice(error)
    );
    this.loadNewRating();
  }

  async loadRating() {
    const newBestList = [];
    const bestList = [];
    const hotBestList = [];
    const avgNew = await this.load('rating_base_new_best', newBestList, (items: PlayerRatingItem[]) => this.getAvgRating(items, 15));
    const avgBest = await this.load('rating_base_best', bestList, (items: PlayerRatingItem[]) => this.getAvgRating(items, 30));
    const avgHot = await this.load('rating_base_hot_best', hotBestList, (items: PlayerRatingItem[]) => this.getAvgRating(items, 10));
    this.ratingV1 = {
      newBestList,
      avgNew,
      bestList,
      avgBest,
      hotBestList,
      avgHot,
    };
    this.avgRating = this.getAvgRating(this.ratingV1.bestList.concat(this.ratingV1.newBestList).concat(this.ratingV1.hotBestList), 55);
  }

  async loadNewRating() {
    try {
      const resp = await firstValueFrom(this.api.get('api/game/ongeki/newRating'));
      if (resp?.status) {
        const statusCode: StatusCode = resp.status.code;
        if (statusCode === StatusCode.OK && resp.data) {
          const data = resp.data;
          const newBestList: PlayerNewRatingItem[] = data.new10;
          const bestList: PlayerNewRatingItem[] = data.old50;
          const platinumList: PlayerNewRatingItem[] = data.pScore;
          for (const item of [...newBestList, ...bestList, ...platinumList]) {
            item.clearMarkType = this.getClearMarkType(item);
            item.musicInfo = await firstValueFrom(this.dbService.getByID<OngekiMusic>('ongekiMusic', item.musicId));
          }
          bestList.forEach(item => item.clearMarkType = this.getClearMarkType(item));
          platinumList.forEach(item => item.clearMarkType = this.getClearMarkType(item));
          const avgNew = this.getAvgNewRating(newBestList, 50, NewRatingType.New);
          const avgBest = this.getAvgNewRating(bestList, 50, NewRatingType.Best);
          const avgPlatinum = this.getAvgNewRating(platinumList, 50, NewRatingType.Platinum);
          this.ratingV2 = {
            newBestList,
            avgNew,
            bestList,
            avgBest,
            platinumList,
            avgPlatinum
          };
        } else if (statusCode === StatusCode.BAD_REQUEST) {
          console.log(resp.status.message);
          await this.loadRating();
        } else if (statusCode === StatusCode.NOT_FOUND) {
          console.log(resp.status.message);
        }
      }
    } catch (error) {
      this.messageService.notice(error);
      console.log(error);
    }
  }

  getClearMarkType(item: PlayerNewRatingItem): ClearMarkType {
    let clearMarkType: ClearMarkType;
    if (item.isAllBreak) {
      if (item.techScoreMax >= 1010000) {
        clearMarkType = ClearMarkType.AllBreakPlus;
      } else {
        clearMarkType = ClearMarkType.AllBreak;
      }
    } else if (item.isFullCombo) {
      clearMarkType = ClearMarkType.FullCombo;
    } else {
      clearMarkType = ClearMarkType.None;
    }
    return clearMarkType;
  }

  async load(key: string, list: PlayerRatingItem[], callback: (items: PlayerRatingItem[]) => string) {
    const param = new HttpParams().set('key', key);
    const data = await firstValueFrom(this.api.get('api/game/ongeki/general', param));
    if (data.propertyValue.indexOf(',') < 0) {
      this.messageService.notice('Can\'t read battle data. Please save again in-game');
    } else {
      const records = data.propertyValue.split(',');
      for (const record of records) {
        const value = record.split(':');
        const item: PlayerRatingItem = {
          musicId: Number(value[0]),
          level: Number(value[1]),
          value: Number(value[2]),
          platinumScoreMax: Number(value[3]),
          platinumScoreStar: Number(value[4]),
        };
        item.musicInfo = await firstValueFrom(this.dbService.getByID<OngekiMusic>('ongekiMusic', item.musicId));
        list.push(item);
      }
    }
    return callback(list);
  }

  getAvgRating(items: PlayerRatingItem[], total: number) {
    let sumRating100 = 0;
    for (const item of items) {
      const level100 = this.getLevel100(item.musicInfo, item.level);
      const rating100 = this.calcRating100(level100, item.value);
      if (!rating100) {
        continue;
      }
      sumRating100 += rating100;
    }
    return (Math.floor(sumRating100 / total) / 100).toFixed(2);
  }

  getAvgNewRating(items: PlayerNewRatingItem[], total: number, newRatingType: NewRatingType) {
    let sumRating1000 = 0;
    for (const item of items) {
      const rating1000 = this.newRating.calcRate1000(item, newRatingType);
      if (!rating1000) {
        continue;
      }
      sumRating1000 += rating1000;
    }
    return (Math.floor(sumRating1000 / total) / 1000).toFixed(3);
  }

  getLevel100(musicInfo: OngekiMusic, level: number) {
    if (!musicInfo) {
      return null;
    }
    let levelData: string;
    if (level === 0) {
      levelData = musicInfo.level0;
    } else if (level === 1) {
      levelData = musicInfo.level1;
    } else if (level === 2) {
      levelData = musicInfo.level2;
    } else if (level === 3) {
      levelData = musicInfo.level3;
    } else if (level === 10) {
      levelData = musicInfo.level4;
    }
    const levelDatas = levelData.split(',');
    if (levelDatas.length !== 2) {
      return null;
    }
    return parseInt(levelDatas[0], 10) * 100 + parseInt(levelDatas[1], 10);
  }

  calcRating100(level100: number, score) {
    let result: number;
    const scoreZero = 500000;
    const rateTbls = [
      [800000, -600],
      [900000, -400],
      [970000, 0],
      [990000, 100],
      [1000000, 150],
      [1007500, 200],
      [1100000, 200]
    ];
    let num = 0;

    if (score <= rateTbls[0][0]) {
      num = (level100 + rateTbls[0][1]) * (score - scoreZero) / (rateTbls[0][0] - scoreZero);
    } else {
      for (let i = 1; i < 7; i++) {
        const rateTbl = rateTbls[i];
        if (score <= rateTbl[0]) {
          const rateTbl2 = rateTbls[i - 1];
          num = level100 + rateTbl2[1];
          num += (rateTbl[1] - rateTbl2[1]) * (score - rateTbl2[0]) / (rateTbl[0] - rateTbl2[0]);
          break;
        }
      }
    }

    num = Math.floor(num);
    result = Math.max(num, 0);
    return result;
  }

  showDetail(music: OngekiMusic) {
    const offcanvasRef = this.offcanvasService.open(OngekiSongScoreRankingComponent, {
      position: 'end',
      scroll: false,
      // panelClass: 'ongeki-song-score-ranking',
    });
    offcanvasRef.componentInstance.music = music;
  }

  setDefaultJacket($event: ErrorEvent) {
    ($event.target as HTMLImageElement).src = this.host + 'assets/ongeki/jacket/UI_Jacket_0000_S.webp';
  }

}

interface RatingV1{
  bestList: PlayerRatingItem[];
  avgBest: string;
  newBestList: PlayerRatingItem[];
  avgNew: string;
  hotBestList: PlayerRatingItem[];
  avgHot: string;
}

interface RatingV2{
  newBestList: PlayerNewRatingItem[];
  avgNew: string;
  bestList: PlayerNewRatingItem[];
  avgBest: string;
  platinumList: PlayerNewRatingItem[];
  avgPlatinum: string;
}
