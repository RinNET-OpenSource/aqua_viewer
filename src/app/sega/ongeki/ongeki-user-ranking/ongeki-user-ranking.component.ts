import { Component, OnInit } from '@angular/core';
import {OngekiUserRanking} from '../model/OngekiUserRanking';
import {ApiService} from '../../../api.service';
import {OngekiPcRanking} from '../model/OngekiPcRanking';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-ongeki-user-ranking',
  templateUrl: './ongeki-user-ranking.component.html',
  styleUrls: ['./ongeki-user-ranking.component.scss']
})
export class OngekiUserRankingComponent implements OnInit {

  protected RankingType = RankingType;

  ongekiUserRankings: OngekiUserRanking[] = [];
  OngekiPcRankings: OngekiPcRanking[] = [];
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
        this.getUserRankingData();
      }
      else if (this.type === RankingType.ACTIVITY){
        this.getDailyPcRankingData();
      }
    });
  }

  getUserRankingData() {
    this.api.get('api/game/ongeki/data/userRatingRanking')
      .subscribe(data => {
        this.ongekiUserRankings = data;
      });
  }

  getDailyPcRankingData() {
    this.api.get('api/game/ongeki/data/dailyPcRanking')
      .subscribe(data => {
        this.OngekiPcRankings = data.data;
      });
  }
}

export enum RankingType {
  RATING = 'RATING',
  ACTIVITY = 'ACTIVITY',
}
