import { Component, OnInit } from '@angular/core';
import {OngekiGameRanking} from '../model/OngekiGameRanking';
import {ApiService} from '../../../api.service';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-ongeki-music-ranking',
  templateUrl: './ongeki-music-ranking.component.html',
  styleUrls: ['./ongeki-music-ranking.component.scss']
})
export class OngekiMusicRankingComponent implements OnInit {
  ongekiGameRankings: OngekiGameRanking[] = [];
  host = environment.assetsHost;

  displayedColumns: string[] = ['ranking', 'music.name', 'playCount', 'state'];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.api.get('api/game/ongeki/data/musicRanking')
      .subscribe(data => {
        this.ongekiGameRankings = data;
      });
  }
}
