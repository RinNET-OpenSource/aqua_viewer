import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {V2UserRanking} from '../model/V2UserRanking';
import {ApiService} from '../../../../api.service';

@Component({
  selector: 'app-v2-user-ranking',
  templateUrl: './v2-user-ranking.component.html',
  styleUrls: ['./v2-user-ranking.component.css']
})
export class V2UserRankingComponent implements OnInit {
  v2UserRankings: V2UserRanking[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.api.get('api/game/chuni/v2/data/userRatingRanking')
      .subscribe(data => {
        this.v2UserRankings = data.data;
      });
  }
}
