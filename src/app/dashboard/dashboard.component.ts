import {Component, OnInit} from '@angular/core';
import {PreloadService} from '../database/preload.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {MessageService} from '../message.service';
import {Card, CardExternal, User} from '../model/User';
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

  user: User;
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

  addCardForm: FormGroup;
  addAccessCodeForm: FormGroup;

  constructor(
    private dbService: NgxIndexedDBService,
    private preload: PreloadService,
    private messageService: MessageService,
    private api: ApiService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    protected authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.addCardForm = this.fb.group({
      accessCode: ['', Validators.required]
    });

    this.addAccessCodeForm = this.fb.group({
      accessCode: ['', Validators.required]
    });
    this.loadUser();
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

  loadUser() {
    this.api.get('api/user/me').subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.messageService.notice(error);
      });
  }

  reload() {
    this.preload.reload();
    this.dbService.deleteDatabase().subscribe(
      () => window.location.reload()
    );
  }

  onAddCard(modal) {
    if (this.addCardForm.invalid) {
      return;
    }
    const accessCode = this.addCardForm.value.accessCode;
    const params = {accessCode};
    this.api.post('api/user/bindCard/', params).subscribe(
      data => {
        if (data.success) {
          this.loadUser();
        }
        if (data.message) {
          this.messageService.notice(data.message);
        }
      },
      error => {
        this.messageService.notice(error);
      });
    modal.dismiss();
  }

  onAddAccessCode(card: Card, modal) {
    if (this.addAccessCodeForm.invalid) {
      return;
    }
    const accessCode = this.addAccessCodeForm.value.accessCode;
    const params = {accessCode, card};
    this.api.post('api/user/addAccessCode/', params).subscribe(
      data => {
        if (data.success) {
          this.loadUser();
        } else if (data.message) {
          this.messageService.notice(data.message);
        }
      },
      error => {
        this.messageService.notice(error);
      });
    modal.dismiss();
  }

  setDefault(card: Card) {
    const account = this.authenticationService.currentUserValue;
    account.currentCard = card.extId;
    this.authenticationService.currentUserValue = account;
  }

  removeExternal(external: CardExternal) {
    const accessCode = external.luid;
    const body = {accessCode};
    this.api.delete('api/sega/aime/removeCardExternal/', null, body).subscribe(
      data => {
        if (data.success) {
          this.loadUser();
        }
        if (data.message) {
          this.messageService.notice(data.message);
        }
      },
      error => {
        this.messageService.notice(error);
      });
  }

  open(content) {
    this.modalService.open(content, {centered: true});
  }

}
