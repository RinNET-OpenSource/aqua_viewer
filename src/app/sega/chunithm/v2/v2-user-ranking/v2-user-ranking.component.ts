import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {V2UserRanking} from '../model/V2UserRanking';
import {ApiService} from '../../../../api.service';
import {V2PcRanking} from '../model/V2PcRanking';

@Component({
  selector: 'app-v2-user-ranking',
  templateUrl: './v2-user-ranking.component.html',
  styleUrls: ['./v2-user-ranking.component.css']
})
export class V2UserRankingComponent implements OnInit {
  chusanUserRankings: V2UserRanking[] = [];
  chusanUserPcRankings: V2PcRanking[] = [];
  tabBarBoolControl = true;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getChusanUserRankingData();
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
