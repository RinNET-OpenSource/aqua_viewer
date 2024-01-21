import { Component, Input } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { MessageService } from '../../../../message.service';
import {OngekiMusic} from '../../model/OngekiMusic';
import {environment} from '../../../../../environments/environment';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {HttpParams} from '@angular/common/http';

interface Ranking {
  level?: number;
  username: string;
  score: number;
}

interface ISongData {
  musicId: number;
  level: number;
  playCount: number;
  techScoreMax: number;
  techScoreRank: number;
  battleScoreMax: number;
  battleScoreRank: number;
  platinumScoreMax: number;
  maxComboCount: number;
  maxOverKill: number;
  maxTeamOverKill: number;
  clearStatus: number;
  storyWatched: boolean;
  isFullBell: boolean;
  isFullCombo: boolean;
  isAllBreake: boolean;
  isLock: boolean;
  ranking: Ranking;
}

@Component({
  selector: 'app-ongeki-song-score-ranking',
  templateUrl: './ongeki-song-score-ranking.component.html',
  styleUrls: ['./ongeki-song-score-ranking.component.css']
})
export class OngekiSongScroeRankingComponent {
  ranking: Ranking[];
  songData: ISongData[];
  host = environment.assetsHost;
  @Input() public music: OngekiMusic;
  constructor(
    private api: ApiService,
    public messageService: MessageService,
    public offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    const { id } = this.music;
    this.api.get(`api/game/ongeki/song/${id}?aimeId=68705438`).subscribe(
      res => {
        this.songData = res;
        console.log(this.songData);
      }
    );
    const param = new HttpParams().set('musicId', id).set('level', 3);
    this.api.get('api/game/ongeki/musicScoreRanking', param).subscribe(
      res => {
        this.ranking = res;
      }
    );
  }


  handleTabButtonClick(level: number) {
    const { id } = this.music;
    const param = new HttpParams().set('musicId', id).set('level', level);
    this.api.get('api/game/ongeki/musicScoreRanking', param).subscribe(
      res => {
        this.ranking = res;
      }
    );
  }

  battleScoreRank(score: number) {
    switch (true) {
      case (score >= 1007500):
        return 'SSS+';
      case score >= 1000000 && score <= 1007499:
        return 'SSS';
      case score >= 990000 && score <= 999999:
        return 'SS';
      case score >= 970000 && score <= 989999:
        return 'S';
      case score >= 940000 && score <= 969999:
        return 'AAA';
      case score >= 900000 && score <= 939999:
        return 'AA';
      case score >= 850000 && score <= 899999:
        return 'A';
      case score >= 800000 && score <= 849999:
        return 'BBB';
      case score >= 750000 && score <= 799999:
        return 'BB';
      case score >= 700000 && score <= 749999:
        return 'B';
      case score >= 500000 && score <= 699999:
        return 'C';
      case score >= 0 && score <= 499999:
        return 'D';
    }
  }
}
