import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {V2Profile} from '../model/V2Profile';
import {HttpParams} from '@angular/common/http';
import {V2UserBoxSettingDialog, V2UserBoxSettingData} from './v2-userbox-setting/v2-userbox-setting.dialog';
import {environment} from '../../../../../environments/environment';
import { ChusanTrophy } from '../model/ChusanTrophy';
import { Observable, Subject } from 'rxjs';
import { ChusanNamePlate } from '../model/ChusanNamePlate';
import { ChusanSystemVoice } from '../model/ChusanSystemVoice';
import { ChusanMapIcon } from '../model/ChusanMapIcon';
import { ChusanAvatarAcc } from '../model/ChusanAvatarAcc';
import {UNKNOWN} from 'aegis-web-sdk/lib/packages/core/src';

@Component({
  selector: 'app-v2-userbox',
  templateUrl: './v2-userbox.component.html',
  styleUrls: ['./v2-userbox.component.css']
})
export class V2UserBoxComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  profile: V2Profile;
  aimeId: string;
  apiServer: string;

  items: Observable<[]>;
  customable = [];

  systemVoicelines = [];
  volume: number;
  currentAvatarAcc: {category: number, accId: number} = {category: 0, accId: 0};

  dialogOptions: NgbModalOptions = {
    centered: true,
    size: 'lg',
  };

  showGuiGui = false;
  private showGuiGuiTimer;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.refreshProfile();
  }

  initCustomable() {
    this.customable = [
      { name: 'Nameplate', value: this.getNamePlateName(this.profile.nameplateId), click: () => this.namePlate() },
      { name: 'Trophy', value: this.getTrophyName(this.profile.trophyId), click: () => this.trophy() },
      { name: 'MapIcon', value: this.getMapIconName(this.profile.mapIconId), click: () => this.mapIcon() },
      { name: 'SystemVoice', value: this.getSystemVoiceName(this.profile.voiceId), click: () => this.systemVoice() },
      { name: 'AvatarWear', value: this.getAvatarAccName(this.profile.avatarWear),
        click: () => this.avatarAcc(1, this.profile.avatarWear) },
      { name: 'AvatarHead', value: this.getAvatarAccName(this.profile.avatarHead),
        click: () => this.avatarAcc(2, this.profile.avatarHead) },
      { name: 'AvatarFace', value: this.getAvatarAccName(this.profile.avatarFace),
        click: () => this.avatarAcc(3, this.profile.avatarFace) },
      // { name: 'AvatarSkin', value: this.getAvatarAccName(this.profile.avatarSkin),
      //   click: () => this.avatarAcc(4, this.profile.avatarSkin) },
      { name: 'AvatarItem', value: this.getAvatarAccName(this.profile.avatarItem),
        click: () => this.avatarAcc(5, this.profile.avatarItem) },
      // { name: 'AvatarFront', value: this.getAvatarAccName(this.profile.avatarFront),
      //   click: () => this.avatarAcc(6, this.profile.avatarFront) },
      { name: 'AvatarBack', value: this.getAvatarAccName(this.profile.avatarBack),
        click: () => this.avatarAcc(7, this.profile.avatarBack) },
      // { name: 'Frame', value: this.getFrameName(this.profile.frameId), click: () => this.frame() },
    ];
  }

  initSounds() {
    this.systemVoicelines = [
      { name: 'SEGA',       click: () => this.playAudio(34)},
      { name: 'FULL COMBO', click: () => this.playAudio(0)},
      { name: 'ALL JUSTICE', click: () => this.playAudio(1)},
      { name: 'NEW RECORD', click: () => this.playAudio(8)},
      { name: 'RANK D',     click: () => this.playAudio(10)},
      { name: 'RANK C',     click: () => this.playAudio(11)},
      { name: 'RANK B',     click: () => this.playAudio(12)},
      { name: 'RANK BB',    click: () => this.playAudio(13)},
      { name: 'RANK BBB',   click: () => this.playAudio(14)},
      { name: 'RANK A',     click: () => this.playAudio(15)},
      { name: 'RANK AA',    click: () => this.playAudio(16)},
      { name: 'RANK AAA',   click: () => this.playAudio(17)},
      { name: 'RANK S',     click: () => this.playAudio(18)},
      { name: 'RANK S+',    click: () => this.playAudio(19)},
      { name: 'RANK SS',    click: () => this.playAudio(20)},
      { name: 'RANK SS+',   click: () => this.playAudio(21)},
      { name: 'RANK SSS',   click: () => this.playAudio(22)},
      { name: 'RANK SSS+',  click: () => this.playAudio(23)},
      { name: 'DUEL INTRO', click: () => this.playAudio(24)},
      { name: 'CONTINUE?',  click: () => this.playAudio(49)},
      { name: 'CONTINUE!',  click: () => this.playAudio(50)},
      { name: 'SEE YOU NEXT PLAY!', click: () => this.playAudio(51)},
    ];
  }

  playAudio(id: number)
  {
    const audio = new Audio();
    // tslint:disable-next-line:max-line-length
    audio.src = this.host + 'assets/chuni/systemVoice/systemvoice' + this.profile.voiceId.toString().padStart(4, '0') + '/000' + id.toString().padStart(2, '0') + '.wav';
    audio.load();
    if (this.volume)
    {
      audio.volume = (this.volume / 100);
    }else{
      audio.volume = 0.20;
    }
    audio.play();
  }

  refreshProfile() {
    this.aimeId = String(this.auth.currentAccountValue.currentCard.extId);
    this.apiServer = environment.apiServer;
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/chuni/v2/profile', param).subscribe(
      data => {
        this.profile = data;
        this.initCustomable();
        this.initSounds();
      },
      error => this.messageService.notice(error)
    );
  }

  getNamePlateName(nameplateId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanNamePlate>('chusanNamePlate', nameplateId).
      subscribe(NamePlate => resolve(NamePlate.name ? NamePlate.name : 'Unknown'));
    });
  }

  getFrameName(frameId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanTrophy>('chusanFrame', frameId).
      subscribe(frame => resolve(frame.name ? frame.name : 'Unknown'));
    });
  }

  getMapIconName(mapiconId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanMapIcon>('chusanMapIcon', mapiconId).
      subscribe(mapicon => resolve(mapicon.name ? mapicon.name : 'Unknown'));
    });
  }

  getSystemVoiceName(sysvoiceId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanSystemVoice>('chusanSystemVoice', sysvoiceId).
      subscribe(sysvoice => resolve(sysvoice.name ? sysvoice.name : 'Unknown'));
    });
  }

  getAvatarAccName(avatarAccId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanAvatarAcc>('chusanAvatarAcc', avatarAccId).
      subscribe(avatarAcc => resolve(avatarAcc.name ? avatarAcc.name : 'Unknown'));
    });
  }

  getTrophyName(trophyId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanTrophy>('chusanTrophy', trophyId).
      subscribe(trophy => resolve(trophy.name ? trophy.name : 'Unknown'));
    });
  }

  openDialog(dialogData: V2UserBoxSettingData) {
    const dialogRef = this.modalService.open(V2UserBoxSettingDialog, this.dialogOptions);
    dialogRef.componentInstance.data = dialogData;
    dialogRef.componentInstance.parentComponent = this;
  }

  handleApplyClick(data) {
    const { itemKind, itemId } = data;
    clearTimeout(this.showGuiGuiTimer);
    let apiURL = '';
    let requestBody = {};
    if (itemKind === 11) {
      const { category, accId } = this.currentAvatarAcc;
      this.api.put('api/game/chuni/v2/profile/avatar', { aimeId: this.aimeId, category, accId: itemId }).subscribe(
        (result) => {
          const random = Math.floor(Math.random() * 10);
          if (random === 5) {
            this.showGuiGui = true;
            this.showGuiGuiTimer = setTimeout(() => this.showGuiGui = false, 10000);
          }
          this.messageService.notice('Successfully changed');
          this.refreshProfile();
          this.modalService.dismissAll();
        }, error => this.messageService.notice(error)
      );
    } else {
      switch (itemKind) {
        case 1: // NamePlate
          apiURL = 'api/game/chuni/v2/profile/plate';
          requestBody = { aimeId: this.aimeId, nameplateId: itemId };
          break;
        case 2: // Frame
          apiURL = 'api/game/chuni/v2/profile/frame';
          requestBody = { aimeId: this.aimeId, frameId: itemId };
          break;
        case 3: // Trophy
          apiURL = 'api/game/chuni/v2/profile/trophy';
          requestBody = { aimeId: this.aimeId, trophyId: itemId };
          break;
        case 8: // MapIcon
          apiURL = 'api/game/chuni/v2/profile/mapicon';
          requestBody = { aimeId: this.aimeId, mapiconId: itemId };
          break;
        case 9: // Voice
          apiURL = 'api/game/chuni/v2/profile/sysvoice';
          requestBody = { aimeId: this.aimeId, voiceId: itemId };
          break;
      }

      this.api.put(apiURL, requestBody).subscribe(() => {
        this.messageService.notice('Successfully changed');
        this.refreshProfile();
        this.modalService.dismissAll();
      }, error => this.messageService.notice(error));
    }
  }

  namePlate() {
    this.openDialog({ itemKind: 1, itemId: this.profile.nameplateId });
  }

  frame() {
    this.openDialog({ itemKind: 2, itemId: this.profile.frameId });
  }

  trophy() {
    this.openDialog({ itemKind: 3, itemId: this.profile.trophyId });
  }

  mapIcon() {
    this.openDialog({ itemKind: 8, itemId: this.profile.mapIconId });
  }

  systemVoice() {
    this.openDialog({ itemKind: 9, itemId: this.profile.voiceId });
  }

  avatarAcc(category: number, accId: number) {
    this.openDialog({ itemKind: 11, itemId: accId, category });
    this.currentAvatarAcc = { category, accId };
  }
}
