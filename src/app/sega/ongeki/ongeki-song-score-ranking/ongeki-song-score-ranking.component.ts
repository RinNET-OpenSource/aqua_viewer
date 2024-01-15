import {Component} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs';
import {logger} from 'codelyzer/util/logger';
import {ApiService} from '../../../api.service';
import {MessageService} from '../../../message.service';

@Component({
  selector: 'app-ongeki-song-score-ranking',
  templateUrl: './ongeki-song-score-ranking.component.html',
  styleUrls: ['./ongeki-song-score-ranking.component.css']
})
export class OngekiSongScoreRankingComponent {

  ranking: Ranking[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public messageService: MessageService,
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // router ensures that the id and level cannot be null.
      const id = params.get('id');
      const level = params.get('level');
      console.log(level);
      this.api.get(`api/game/ongeki/musicScoreRanking?musicId=${id}&level=${level}`).subscribe(
        res => this.ranking = res
      );
    });
  }
}

interface Ranking {
  username: string;
  score: number;
}
