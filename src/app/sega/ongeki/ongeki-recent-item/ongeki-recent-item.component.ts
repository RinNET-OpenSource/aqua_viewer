import {Component, OnInit} from '@angular/core';
import {PlayerPlaylog} from '../model/PlayerPlaylog';
import {AttributeType, BattleRank, Difficulty, TechnicalRank} from '../model/OngekiEnums';
import {environment} from '../../../../environments/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  open(content) {
    this.modalService.open(content, {  centered: true  });
  }
}
