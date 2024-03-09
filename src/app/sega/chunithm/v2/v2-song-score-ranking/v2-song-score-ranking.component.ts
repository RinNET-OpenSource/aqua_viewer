import {Component, Input} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {ChusanMusic, ChusanMusicLevelInfo, ChusanMusicLevels} from '../model/ChusanMusic';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {HttpParams} from '@angular/common/http';

interface ISongData {
  musicId: number;
  level: number;
  playCount: number;
  scoreMax: number;
  missCount: number;
  maxComboCount: number;
  isFullCombo: boolean;
  isAllJustice: boolean;
  isSuccess: number;
  fullChain: number;
  maxChain: number;
  scoreRank: number;
  isLock: boolean;
  theoryCount: number;
  ext1: number;
  ranking: UserRanking;
}

interface Ranking {
  level?: number;
  username: string;
  score: number;
}

interface UserRanking {
  rank: number;
  playedCount: number;
}

@Component({
  selector: 'app-v2-song-score-ranking',
  templateUrl: './v2-song-score-ranking.component.html',
  styleUrls: ['./v2-song-score-ranking.component.scss']
})
export class V2SongScoreRankingComponent {
  protected readonly Math = Math;
  ranking: Ranking[];
  songData: { [key: number]: ISongData };
  host = environment.assetsHost;
  protected readonly parseFloat = parseFloat;
  @Input() public music: ChusanMusic;
  hasUltima = false;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    public messageService: MessageService,
    public offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    console.log(this.music);
    this.hasUltima = this.music.levels['4'].enable;
    const {musicId} = this.music;
    this.api.get(`api/game/chuni/v2/song/${musicId}?aimeId=${String(this.auth.currentAccountValue.currentCard.extId)}`).subscribe(
      res => {
        const songData = {};
        for (const data of res) {
          songData[data.level] = data;
          console.log(songData);
        }
        this.songData = songData;
      }
    );
    const param = new HttpParams().set('musicId', musicId).set('level', 3);
    this.api.get("api/game/chuni/v2/musicScoreRanking", param).subscribe((res) => {
      if (res.length > 0) {
        this.ranking = res;
      } else {
        const param = new HttpParams().set("musicId", musicId).set("level", 5);
        this.api.get("api/game/chuni/v2/musicScoreRanking", param).subscribe((res) => {
            this.ranking = res;
          });
      }
    });
  }

  handleTabButtonClick(level: number) {
    const {musicId} = this.music;
    const param = new HttpParams().set('musicId', musicId).set('level', level);
    this.api.get('api/game/chuni/v2/musicScoreRanking', param).subscribe(
      res => {
        this.ranking = res;
      }
    );
  }

  getLevelString(song: ChusanMusic, index: number): string {
    const level: ChusanMusicLevelInfo = song.levels[index.toString()];
    return `${level.level}.${level.levelDecimal.toString().charAt(0)}` ?? '0';
  }

}
