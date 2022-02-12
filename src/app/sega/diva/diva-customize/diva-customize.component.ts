import {Component, OnInit} from '@angular/core';
import {DivaCustomize} from '../model/DivaCustomize';
import {NgxIndexedDBService} from 'ngx-indexed-db';

@Component({
  selector: 'app-diva-customize',
  templateUrl: './diva-customize.component.html',
  styleUrls: ['./diva-customize.component.css']
})
export class DivaCustomizeComponent implements OnInit {

  p = 0;
  customizes: DivaCustomize[] = [];

  constructor(private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {
    this.dbService.getAll<DivaCustomize>('divaCustomize').subscribe(
      x => x.forEach(y => this.customizes.push(y))
    );
  }

}
