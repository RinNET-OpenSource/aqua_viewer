import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import {OngekiCard} from '../model/OngekiCard';
import {OngekiSkill} from '../model/OngekiSkill';
import {OngekiCharacter} from '../model/OngekiCharacter';

@Component({
  selector: 'app-ongeki-card-list',
  templateUrl: './ongeki-card-list.component.html',
  styleUrls: ['./ongeki-card-list.component.css']
})
export class OngekiCardListComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  dataSource = new MatTableDataSource<OngekiCard>();
  cardList: OngekiCard[] = [];

  p = 1;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    this.dbService.getAll<OngekiCard>('ongekiCard').subscribe(
      x => x.forEach(y => {
        this.dbService.getByID<OngekiCharacter>('ongekiCharacter', y.charaId).subscribe(z => y.characterInfo = z);
        this.dbService.getByID<OngekiSkill>('ongekiSkill', y.skillId).subscribe(z => y.skillInfo = z);
        this.dbService.getByID<OngekiSkill>('ongekiSkill', y.choKaikaSkillId).subscribe(z => y.choKaikaSkillInfo = z);
        this.cardList.push(y);
      })
    );
    this.dataSource.data = this.cardList
  }

  insertCard(cardId: number) {
    const aimeId = this.auth.currentUserValue.extId;
    this.api.post('api/game/ongeki/card', {
      aimeId,
      cardId
    }).subscribe(
      data => this.messageService.notice('Successful, go to check your card list'),
      error => this.messageService.notice(error)
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue
  }

}
