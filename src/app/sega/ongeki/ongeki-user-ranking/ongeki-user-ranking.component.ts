import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {OngekiUserRanking} from '../model/OngekiUserRanking';
import {ApiService} from '../../../api.service';
import {OngekiPcRanking} from '../model/OngekiPcRanking';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-ongeki-user-ranking',
  templateUrl: './ongeki-user-ranking.component.html',
  styleUrls: ['./ongeki-user-ranking.component.css']
})
export class OngekiUserRankingComponent implements OnInit {
  ongekiUserRankings: OngekiUserRanking[] = [];
  OngekiPcRankings: OngekiPcRanking[] = [];
  tabBarBoolControl = true;
  host = environment.assetsHost;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getUserRankingData();
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
