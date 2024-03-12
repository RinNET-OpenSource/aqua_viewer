import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {OngekiPcRanking} from '../model/OngekiPcRanking';
import {ApiService} from '../../../api.service';

@Component({
  selector: 'app-ongeki-pc-ranking',
  templateUrl: './ongeki-pc-ranking.component.html',
  styleUrls: ['./ongeki-pc-ranking.component.css']
})
export class OngekiPcRankingComponent implements OnInit {
  OngekiPcRankings: OngekiPcRanking[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.api.get('api/game/ongeki/data/dailyPcRanking')
      .subscribe(data => {
        this.OngekiPcRankings = data.data;
      });
  }
}
