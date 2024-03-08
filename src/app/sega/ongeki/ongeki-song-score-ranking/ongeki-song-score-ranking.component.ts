import { Component, Input } from '@angular/core';
import { ApiService } from '../../../api.service';
import { MessageService } from '../../../message.service';
import {OngekiMusic} from '../model/OngekiMusic';
import {environment} from '../../../../environments/environment';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {HttpParams} from '@angular/common/http';
import {AuthenticationService} from '../../../auth/authentication.service';

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
  ranking: UserRanking;
}

interface UserRanking {
  rank: number;
  playedCount: number;
}

@Component({
  selector: 'app-ongeki-song-score-ranking',
  templateUrl: './ongeki-song-score-ranking.component.html',
  styleUrls: ['./ongeki-song-score-ranking.component.scss']
})
export class OngekiSongScoreRankingComponent {
  protected readonly Math = Math;
  ranking: Ranking[];
  songData: {[key: number]: ISongData};
  host = environment.assetsHost;
  protected readonly parseFloat = parseFloat;
  @Input() public music: OngekiMusic;
  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    public messageService: MessageService,
    public offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    const { id } = this.music;
    this.api.get(`api/game/ongeki/song/${id}?aimeId=${String(this.auth.currentAccountValue.currentCard.extId)}`).subscribe(
      res => {
        const songData = {};
        for (const data of res) {
          songData[data.level] = data;
        }
        this.songData = songData;
      }
    );
    const param = new HttpParams().set('musicId', id).set('level', 3);
    this.api.get("api/game/ongeki/musicScoreRanking", param).subscribe((res) => {
      if (res.length > 0) {
        this.ranking = res;
      } else {
        const param = new HttpParams().set("musicId", id).set("level", 10);
        this.api.get("api/game/ongeki/musicScoreRanking", param).subscribe((res) => {
            this.ranking = res;
          });
      }
    });
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


  getLevelString(song: OngekiMusic, level: number) {
    if (!song) { return '0'; }
    if (level === 0){
      return song.level0;
    }
    else if (level === 1){
      return song.level1;
    }
    else if (level === 2){
      return song.level2;
    }
    else if (level === 3){
      return song.level3;
    }
    else if (level === 10){
      return song.level4;
    }
    else { return '0'; }
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
