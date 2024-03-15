import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { AuthenticationService } from '../../../auth/authentication.service';
import { MessageService } from '../../../message.service';
import { HttpParams } from '@angular/common/http';
import { DisplayOngekiProfile } from '../model/OngekiProfile';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { OngekiCard } from '../model/OngekiCard';
import { OngekiCharacter } from '../model/OngekiCharacter';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-ongeki-profile',
  templateUrl: './ongeki-profile.component.html',
  styleUrls: ['./ongeki-profile.component.css']
})
export class OngekiProfileComponent implements OnInit {

  profile: DisplayOngekiProfile;
  aimeId: string;
  host = environment.assetsHost;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
    this.aimeId = String(this.auth.currentAccountValue.currentCard.extId);
  }

  ngOnInit() {
    const aimeId = String(this.auth.currentAccountValue.currentCard.extId);
    const param = new HttpParams().set('aimeId', aimeId);
    this.api.get('api/game/ongeki/profile', param).subscribe(
      data => {
        this.profile = data;
        this.dbService.getByID<OngekiCard>('ongekiCard', this.profile.cardId).subscribe(
          x => this.profile.card = x
        );
        this.dbService.getByID<OngekiCharacter>('ongekiCharacter', this.profile.characterId).subscribe(
          x => this.profile.character = x
        );
      },
      error => this.messageService.notice(error)
    );
  }

}
