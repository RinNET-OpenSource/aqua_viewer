import { Component, OnInit } from '@angular/core';
import {OngekiGameRanking} from '../model/OngekiGameRanking';
import {ApiService} from '../../../api.service';
import {environment} from '../../../../environments/environment';
import {OngekiMusic} from '../model/OngekiMusic';
import {OngekiSongScoreRankingComponent} from '../ongeki-song-score-ranking/ongeki-song-score-ranking.component';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ongeki-music-ranking',
  templateUrl: './ongeki-music-ranking.component.html',
  styleUrls: ['./ongeki-music-ranking.component.scss']
})
export class OngekiMusicRankingComponent implements OnInit {
  ongekiGameRankings: OngekiGameRanking[] = [];
  host = environment.assetsHost;

  displayedColumns: string[] = ['ranking', 'music.name', 'playCount', 'state'];

  constructor(
    private api: ApiService,
    private offcanvasService: NgbOffcanvas) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.api.get('api/game/ongeki/data/musicRanking')
      .subscribe(data => {
        this.ongekiGameRankings = data;
      });
  }

  showDetail(music: OngekiMusic) {
    const offcanvasRef = this.offcanvasService.open(OngekiSongScoreRankingComponent, {
      position: 'end',
      scroll: false,
      // panelClass: 'ongeki-song-score-ranking',
    });
    offcanvasRef.componentInstance.music = music;
  }
}
