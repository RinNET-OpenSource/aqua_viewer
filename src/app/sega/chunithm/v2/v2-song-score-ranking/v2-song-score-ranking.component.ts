import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../../api.service';
import {MessageService} from '../../../../message.service';

@Component({
  selector: 'app-v2-song-score-ranking',
  templateUrl: './v2-song-score-ranking.component.html',
  styleUrls: ['./v2-song-score-ranking.component.css']
})
export class V2SongScoreRankingComponent {
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
      this.api.get(`api/game/chuni/v2/musicScoreRanking?musicId=${id}&level=${level}`).subscribe(
        res => this.ranking = res
      );
    });
  }
}

interface Ranking {
  username: string;
  score: number;
}
