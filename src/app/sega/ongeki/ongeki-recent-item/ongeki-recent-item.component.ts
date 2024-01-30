import {Component, OnInit} from '@angular/core';
import {PlayerPlaylog} from '../model/PlayerPlaylog';
import {AttributeType, BattleRank, Difficulty, TechnicalRank} from '../model/OngekiEnums';
import {environment} from '../../../../environments/environment';
import {NgbModal, NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {OngekiMusic} from '../model/OngekiMusic';
import {OngekiSongScroeRankingComponent} from '../ongeki-song-list/ongeki-song-score-ranking/ongeki-song-score-ranking.component';

@Component({
  selector: 'app-ongeki-recent-item',
  templateUrl: './ongeki-recent-item.component.html',
  styleUrls: ['./ongeki-recent-item.component.css'],
  inputs: ['playLog']
})
export class OngekiRecentItemComponent implements OnInit {
  playLog: PlayerPlaylog;
  host = environment.assetsHost;
  difficulty = Difficulty;
  battleRank = BattleRank;
  technicalRank = TechnicalRank;
  attributeType = AttributeType;
  isCollapsed = false;
  protected readonly Difficulty = Difficulty;
  protected readonly Math = Math;

  constructor(
    private modalService: NgbModal,
    public router: Router,
    private offcanvasService: NgbOffcanvas,
  ) { }

  ngOnInit(): void {
  }
  open(content) {
    this.modalService.open(content, {  centered: true  });
  }

  showDetail(music: OngekiMusic) {
    this.modalService.dismissAll();
    setTimeout(() => {
      const offcanvasRef = this.offcanvasService.open(OngekiSongScroeRankingComponent, {
        position: 'end',
        scroll: false,
      });
      offcanvasRef.componentInstance.music = music;
    }, 500);
  }
}
