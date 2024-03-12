import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {V2PcRanking} from '../model/V2PcRanking';
import {ApiService} from '../../../../api.service';

@Component({
  selector: 'app-v2-pc-ranking',
  templateUrl: './v2-pc-ranking.component.html',
  styleUrls: ['./v2-pc-ranking.component.css']
})
export class V2PcRankingComponent implements OnInit {
  V2PcRankings: V2PcRanking[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.api.get('api/game/chuni/v2/data/dailyPcRanking')
      .subscribe(data => {
        this.V2PcRankings = data.data;
      });
  }
}
