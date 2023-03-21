import { Component, OnInit } from '@angular/core';
import {OngekiGameRanking} from '../model/OngekiGameRanking';
import {ApiService} from '../../../api.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-ongeki-music-ranking',
  templateUrl: './ongeki-music-ranking.component.html',
  styleUrls: ['./ongeki-music-ranking.component.css']
})
export class OngekiMusicRankingComponent implements OnInit {
  dataSource = new MatTableDataSource();
  ongekiGameRankings: OngekiGameRanking[] = [];

  displayedColumns: string[] = ['ranking', 'music.name', 'playCount', 'state'];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.api.get('api/game/ongeki/data/musicRanking')
      .subscribe(data => {
        this.ongekiGameRankings = data;
        this.dataSource.data = this.ongekiGameRankings;
      });
  }
}
