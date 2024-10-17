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
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-ongeki-rating',
  templateUrl: './ongeki-rating.component.html',
  styleUrls: ['./ongeki-rating.component.css']
})
export class OngekiRatingComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  profile: DisplayOngekiProfile;

  bestList: PlayerRatingItem[] = [];
  avgBest: string;
  newBestList: PlayerRatingItem[] = [];
  avgNew: string;
  hotBestList: PlayerRatingItem[] = [];
  avgHot: string;

  avgRating: string;

  difficulty = Difficulty;
  attribute = AttributeType;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    const param = new HttpParams();
    this.api.get('api/game/ongeki/profile', param).subscribe(
      data => this.profile = data,
      error => this.messageService.notice(error)
    );
    this.loadRating();
  }

  async loadRating(){
    this.avgBest = await this.load('rating_base_best', this.bestList, (items: PlayerRatingItem[]) => this.getAvgRating(items, 30));
    this.avgNew = await this.load('rating_base_new_best', this.newBestList, (items: PlayerRatingItem[]) => this.getAvgRating(items, 15));
    this.avgHot = await this.load('rating_base_hot_best', this.hotBestList, (items: PlayerRatingItem[]) => this.getAvgRating(items, 10));
    this.avgRating = this.getAvgRating(this.bestList.concat(this.newBestList).concat(this.hotBestList), 55);
  }

  async load(key: string, list: PlayerRatingItem[], callback: (items: PlayerRatingItem[]) => string) {
    const param = new HttpParams().set('key', key);
    const data = await firstValueFrom(this.api.get('api/game/ongeki/general', param));
    if (data.propertyValue.indexOf(',') < 0) {
      this.messageService.notice('Can\'t read battle data. Please save again in-game');
    }
    else {
      const records = data.propertyValue.split(',');
      for (const record of records) {
        const value = record.split(':');
        const item: PlayerRatingItem = {
          musicId: Number(value[0]),
          level: Number(value[1]),
          value: Number(value[2]),
        };
        item.musicInfo = await firstValueFrom(this.dbService.getByID<OngekiMusic>('ongekiMusic', item.musicId));
        list.push(item);
      }
    }
    return callback(list);
  }

  getAvgRating(items: PlayerRatingItem[], total: number){
    let sumRating100 = 0;
    for (const item of items) {
      const level100 = this.getLevel100(item.musicInfo, item.level);
      const rating100 = this.calcRating100(level100, item.value)
      if(!rating100) continue;
      sumRating100 += rating100;
    }
    return (Math.floor(sumRating100 / total) / 100).toFixed(2);
  }

  getLevel100(musicInfo: OngekiMusic, level: number){
    if(!musicInfo) return null;
    let levelData: string;
    if(level === 0){
      levelData = musicInfo.level0;
    }
    else if(level === 1){
      levelData = musicInfo.level1;
    }
    else if(level === 2){
      levelData = musicInfo.level2;
    }
    else if(level === 3){
      levelData = musicInfo.level3;
    }
    else if(level === 10){
      levelData = musicInfo.level4;
    }
    const levelDatas = levelData.split(',')
    if(levelDatas.length !== 2) return null;
    return parseInt(levelDatas[0]) * 100 + parseInt(levelDatas[1]);
  }

  calcRating100(level100: number, score){
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

    if (score <= rateTbls[0][0]){
      num = (level100 + rateTbls[0][1]) * (score - scoreZero) / (rateTbls[0][0] - scoreZero);
    } else {
      for (let i = 1; i < 7; i++){
        const rateTbl = rateTbls[i];
        if (score <= rateTbl[0]){
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
}
