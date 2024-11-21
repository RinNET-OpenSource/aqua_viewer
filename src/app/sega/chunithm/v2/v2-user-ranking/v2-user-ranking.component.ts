import { Component, OnInit } from '@angular/core';
import {V2UserRanking} from '../model/V2UserRanking';
import {ApiService} from '../../../../api.service';
import {V2PcRanking} from '../model/V2PcRanking';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-v2-user-ranking',
  templateUrl: './v2-user-ranking.component.html',
  styleUrls: ['./v2-user-ranking.component.scss']
})
export class V2UserRankingComponent implements OnInit {

  protected RankingType = RankingType;

  chusanUserRankings: V2UserRanking[] = [];
  chusanUserPcRankings: V2PcRanking[] = [];
  tabBarBoolControl = true;
  host = environment.assetsHost;
  type: RankingType;

  constructor(
    private api: ApiService,
    protected route: ActivatedRoute,
    protected router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      if (data.type) {
        if (Object.values(RankingType).includes(data.type.toUpperCase())){
          this.type = data.type.toUpperCase() as RankingType;
        }
        else{
          this.router.navigate([], {
            queryParams: { type: undefined },
            queryParamsHandling: 'merge'
          });
          return;
        }
      }
      else{
        this.type = RankingType.RATING;
      }
      if (this.type === RankingType.RATING){
        this.getChusanUserRankingData();
      }
      else if (this.type === RankingType.ACTIVITY){
        this.getChusanDailyPcRankingData();
      }
    });
  }

  private getChusanUserRankingData() {
    this.api.get('api/game/chuni/v2/data/userRatingRanking')
      .subscribe(data => {
        this.chusanUserRankings = data.data;
      });
  }
  getChusanDailyPcRankingData() {
    this.api.get('api/game/chuni/v2/data/dailyPcRanking')
      .subscribe(data => {
        this.chusanUserPcRankings = data.data;
      });
  }
}

export enum RankingType {
  RATING = 'RATING',
  ACTIVITY = 'ACTIVITY',
}
