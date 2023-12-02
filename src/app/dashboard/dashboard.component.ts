import {Component, OnInit} from '@angular/core';
import {PreloadService} from '../database/preload.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {MessageService} from '../message.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Account, AuthenticationService} from '../auth/authentication.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  divaPv = 'Initialize';
  divaModule = 'Initialize';
  divaCustomize = 'Initialize';
  chuniMusic = 'Initialize';
  ongekiCard = 'Initialize';
  ongekiCharacter = 'Initialize';
  ongekiMusic = 'Initialize';
  ongekiSkill = 'Initialize';
  chuniCharacter = 'Initialize';
  chuniSkill = 'Initialize';
  chusanMusic = 'Initialize';
  chusanCharacter = 'Initialize';
  chusanTrophy = 'Initialize';
  chusanNamePlate = 'Initialize';
  chusanSystemVoice = 'Initialize';
  chusanMapIcon = 'Initialize';
  chusanFrame = 'Initialize';
  chusanAvatarAcc = 'Initialize';
  enableImages = environment.enableImages;


  constructor(
    private dbService: NgxIndexedDBService,
    private preload: PreloadService
  ) {
  }

  ngOnInit() {
    this.preload.divaPvState.subscribe(data => this.divaPv = data);
    this.preload.divaModuleState.subscribe(data => this.divaModule = data);
    this.preload.divaCustomizeState.subscribe(data => this.divaCustomize = data);
    this.preload.chuniMusicState.subscribe(data => this.chuniMusic = data);
    this.preload.ongekiCardState.subscribe(data => this.ongekiCard = data);
    this.preload.ongekiCharacterState.subscribe(data => this.ongekiCharacter = data);
    this.preload.ongekiMusicState.subscribe(data => this.ongekiMusic = data);
    this.preload.ongekiSkillState.subscribe(data => this.ongekiSkill = data);
    this.preload.chuniCharacterState.subscribe(data => this.chuniCharacter = data);
    this.preload.chuniSkillState.subscribe(data => this.chuniSkill = data);
    this.preload.chusanMusicState.subscribe(data => this.chusanMusic = data);
    this.preload.chusanCharacterState.subscribe(data => this.chusanCharacter = data);
    this.preload.chusanTrophyState.subscribe(data => this.chusanTrophy = data);
    this.preload.chusanNamePlateState.subscribe(data => this.chusanNamePlate = data);
    this.preload.chusanSystemVoiceState.subscribe(data => this.chusanSystemVoice = data);
    this.preload.chusanMapIconState.subscribe(data => this.chusanMapIcon = data);
    this.preload.chusanFrameState.subscribe(data => this.chusanFrame = data);
    this.preload.chusanAvatarAccState.subscribe(data => this.chusanAvatarAcc = data);
  }

  reload() {
    this.preload.reload();
    this.dbService.deleteDatabase().subscribe(
      () => window.location.reload()
    );
  }

}
