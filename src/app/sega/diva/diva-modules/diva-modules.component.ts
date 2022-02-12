import {Component, OnInit} from '@angular/core';
import {DivaModule} from '../model/DivaModule';
import {NgxIndexedDBService} from 'ngx-indexed-db';

@Component({
  selector: 'app-diva-modules',
  templateUrl: './diva-modules.component.html',
  styleUrls: ['./diva-modules.component.css']
})
export class DivaModulesComponent implements OnInit {

  p = 0;
  modules: DivaModule[] = [];

  constructor(private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {
    this.dbService.getAll<DivaModule>('divaModule').subscribe(
      x => x.forEach(y => this.modules.push(y))
    );
  }

}
