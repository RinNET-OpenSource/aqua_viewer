import { Component, Input } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { MessageService } from '../../../../message.service';
import {OngekiMusic} from '../../model/OngekiMusic';
import {environment} from '../../../../../environments/environment';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';

interface Ranking {
  level?: number;
  username: string;
  score: number;
}

@Component({
  selector: 'app-ongeki-song-score-ranking',
  templateUrl: './ongeki-song-score-ranking.component.html',
  styleUrls: ['./ongeki-song-score-ranking.component.css']
})
export class OngekiSongScroeRankingComponent {

  ranking: Ranking[];
  songData;
  host = environment.assetsHost;
  @Input() public music: OngekiMusic;
  constructor(
    private api: ApiService,
    public messageService: MessageService,
    public offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    console.log(this.music);
    const { id } = this.music;
    this.api.get(`api/game/ongeki/musicScoreRanking?musicId=${id}&level=${2}`).subscribe(
      res => {
        this.ranking = res;
      }
    );
    this.api.get(`api/game/ongeki/song/${id}?aimeId=68705438`).subscribe(
      res => {
        this.songData = res;
        console.log(res);
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
