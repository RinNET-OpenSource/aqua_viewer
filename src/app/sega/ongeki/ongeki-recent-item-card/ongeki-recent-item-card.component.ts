import { Component, OnInit } from '@angular/core';
import {PlayerPlaylog} from '../model/PlayerPlaylog';
import {environment} from '../../../../environments/environment';
import {OngekiCard} from '../model/OngekiCard';

@Component({
  selector: 'app-ongeki-recent-item-card',
  templateUrl: './ongeki-recent-item-card.component.html',
  styleUrls: ['./ongeki-recent-item-card.component.css'],
  inputs: ['info', 'level']
})
export class OngekiRecentItemCardComponent implements OnInit {
  protected readonly Math = Math;
  info: OngekiCard;
  level: number;
  host = environment.assetsHost;
  constructor() { }

  ngOnInit(): void {
  }
}
