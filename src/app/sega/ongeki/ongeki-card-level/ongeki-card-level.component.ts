import { Component, OnInit } from '@angular/core';
import {AttributeType} from '../model/OngekiEnums';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-ongeki-card-level',
  templateUrl: './ongeki-card-level.component.html',
  styleUrls: ['./ongeki-card-level.component.css'],
  inputs: ['level', 'attribute']
})
export class OngekiCardLevelComponent implements OnInit {

  protected readonly AttributeType = AttributeType;
  protected readonly Math = Math;
  host = environment.assetsHost;
  level: number;
  attribute: string;
  constructor() { }

  ngOnInit(): void {
  }

}
