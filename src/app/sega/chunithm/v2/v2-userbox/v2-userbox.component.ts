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

  dialogOptions: NgbModalOptions = {
    centered: true,
  };

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
      { name: 'Map Icon', value: this.getMapIconName(this.profile.mapIconId), click: () => this.mapIcon() },
      { name: 'System Voice', value: this.getSystemVoiceName(this.profile.voiceId), click: () => this.systemVoice() },
      { name: 'Avatar Wear', value: this.getAvatarAccName(this.profile.avatarWear),
        click: () => this.avatarAcc(1, this.profile.avatarWear) },
      { name: 'Avatar Head', value: this.getAvatarAccName(this.profile.avatarHead),
        click: () => this.avatarAcc(2, this.profile.avatarHead) },
      { name: 'Avatar Face', value: this.getAvatarAccName(this.profile.avatarFace),
        click: () => this.avatarAcc(3, this.profile.avatarFace) },
      { name: 'Avatar Skin', value: this.getAvatarAccName(this.profile.avatarSkin),
        click: () => this.avatarAcc(4, this.profile.avatarSkin) },
      { name: 'Avatar Item', value: this.getAvatarAccName(this.profile.avatarItem),
        click: () => this.avatarAcc(5, this.profile.avatarItem) },
      { name: 'Avatar Front', value: this.getAvatarAccName(this.profile.avatarFront),
        click: () => this.avatarAcc(6, this.profile.avatarFront) },
      { name: 'Avatar Back', value: this.getAvatarAccName(this.profile.avatarBack),
        click: () => this.avatarAcc(7, this.profile.avatarBack) },
      { name: 'Trophy (Title)', value: this.getTrophyName(this.profile.trophyId), click: () => this.trophy() },
      { name: 'Frame', value: this.getFrameName(this.profile.frameId), click: () => this.frame() },
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
    this.aimeId = String(this.auth.currentAccountValue.currentCard);
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
      subscribe(NamePlate => resolve(nameplateId + ': ' + (NamePlate.name ? NamePlate.name : 'Unknown')));
    });
  }

  getFrameName(frameId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanTrophy>('chusanFrame', frameId).
      subscribe(frame => resolve(frameId + ': ' + (frame.name ? frame.name : 'Unknown')));
    });
  }

  getMapIconName(mapiconId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanMapIcon>('chusanMapIcon', mapiconId).
      subscribe(mapicon => resolve(mapiconId + ': ' + (mapicon.name ? mapicon.name : 'Unknown')));
    });
  }

  getSystemVoiceName(sysvoiceId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanSystemVoice>('chusanSystemVoice', sysvoiceId).
      subscribe(sysvoice => resolve(sysvoiceId + ': ' + (sysvoice.name ? sysvoice.name : 'Unknown')));
    });
  }

  getAvatarAccName(avatarAccId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanAvatarAcc>('chusanAvatarAcc', avatarAccId).
      subscribe(avatarAcc => resolve(avatarAccId + ': ' + (avatarAcc.name ? avatarAcc.name : 'Unknown')));
    });
  }

  getTrophyName(trophyId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanTrophy>('chusanTrophy', trophyId).
      subscribe(trophy => resolve(trophyId + ': ' + (trophy.name ? trophy.name : 'Unknown')));
    });
  }

  openDislog(dialogData: V2UserBoxSettingData) {
    const dialogRef = this.modalService.open(V2UserBoxSettingDialog, this.dialogOptions);
    dialogRef.componentInstance.data = dialogData;
  }

  namePlate() {
    this.openDislog({itemKind: 1, itemId: this.profile.nameplateId});

    // dialogRef.afterClosed().subscribe(namePlateId => {
    //   if (typeof namePlateId === "number") {
    //     this.api.put('api/game/chuni/v2/profile/plate', {aimeId: this.aimeId, nameplateId: namePlateId}).subscribe(
    //       () => {
    //         this.messageService.notice('Successfully changed');
    //         this.refreshProfile();
    //       }, error => this.messageService.notice(error)
    //     );
    //   }
    // });
  }

  frame() {
    this.openDislog({itemKind: 2, itemId: this.profile.frameId});
    // const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
    //   data: {itemKind: 2, itemId: this.profile.frameId}
    // });
    //
    // dialogRef.afterClosed().subscribe(frameId => {
    //   if (typeof frameId === "number") {
    //     this.api.put('api/game/chuni/v2/profile/frame', {aimeId: this.aimeId, frameId: frameId}).subscribe(
    //       () => {
    //         this.messageService.notice('Successfully changed');
    //         this.refreshProfile();
    //       }, error => this.messageService.notice(error)
    //     );
    //   }
    // });
  }

  trophy() {
    this.openDislog({itemKind: 3, itemId: this.profile.trophyId});
    // const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
    //   data: {itemKind: 3, itemId: this.profile.trophyId}
    // });
    //
    // dialogRef.afterClosed().subscribe(trophyId => {
    //   if (typeof trophyId === "number") {
    //     this.api.put('api/game/chuni/v2/profile/trophy', {aimeId: this.aimeId, trophyId: trophyId}).subscribe(
    //       () => {
    //         this.messageService.notice('Successfully changed');
    //         this.refreshProfile();
    //       }, error => this.messageService.notice(error)
    //     );
    //   }
    // });
  }

  mapIcon() {
    this.openDislog({itemKind: 8, itemId: this.profile.mapIconId});
    // const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
    //   data: {itemKind: 8, itemId: this.profile.mapIconId},
    // });
    //
    // dialogRef.afterClosed().subscribe(mapIconId => {
    //   if (typeof mapIconId === "number") {
    //     this.api.put('api/game/chuni/v2/profile/mapicon', {aimeId: this.aimeId, mapiconId: mapIconId}).subscribe(
    //       () => {
    //         this.messageService.notice('Successfully changed');
    //         this.refreshProfile();
    //       }, error => this.messageService.notice(error)
    //     );
    //   }
    // });
  }

  systemVoice() {
    this.openDislog({itemKind: 9, itemId: this.profile.voiceId});
    // const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
    //   data: {itemKind: 9, itemId: this.profile.voiceId}
    // });
    //
    // dialogRef.afterClosed().subscribe(voiceId => {
    //   if (typeof voiceId === "number") {
    //     this.api.put('api/game/chuni/v2/profile/sysvoice', {aimeId: this.aimeId, voiceId: voiceId}).subscribe(
    //       () => {
    //         this.messageService.notice('Successfully changed');
    //         this.refreshProfile();
    //       }, error => this.messageService.notice(error)
    //     );
    //   }
    // });
  }

  avatarAcc(category: number, accId: number) {
    this.openDislog({itemKind: 11, itemId: accId, category});
    // const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
    //   data: {itemKind: 11, itemId: accId, category: category}
    // });
    //
    // dialogRef.afterClosed().subscribe(accId => {
    //   if (typeof accId === "number") {
    //     this.api.put('api/game/chuni/v2/profile/avatar', {aimeId: this.aimeId, category: category, accId: accId}).subscribe(
    //       () => {
    //         this.messageService.notice('Successfully changed');
    //         this.refreshProfile();
    //       }, error => this.messageService.notice(error)
    //     );
    //   }
    // });
  }
}
