import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../api.service';
import {AuthenticationService} from '../../../../auth/authentication.service';
import {MessageService} from '../../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {MatDialog} from '@angular/material/dialog';
import {V2Profile} from '../model/V2Profile';
import {HttpParams} from '@angular/common/http';
import {V2UserBoxSettingDialog} from './v2-userbox-setting/v2-userbox-setting.dialog';
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

  profile: V2Profile;
  aimeId: string;
  apiServer: string;

  items: Observable<[]>;
  customable = [];

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    public dialog: MatDialog,
    private dbService: NgxIndexedDBService
  ) { }

  ngOnInit() {
    this.refreshProfile();
  }

  initCustomable() {
    this.customable = [
      { name: 'Nameplate', value: this.getNamePlateName(this.profile.nameplateId), click: () => this.namePlate() },
      { name: 'Frame', value: this.getFrameName(this.profile.frameId), click: () => this.frame() },
      { name: 'Trophy (Title)', value: this.getTrophyName(this.profile.trophyId), click: () => this.trophy() },
      { name: 'Map Icon', value: this.getMapIconName(this.profile.mapIconId), click: () => this.mapIcon() },
      { name: 'System Voice', value: this.getSystemVoiceName(this.profile.voiceId), click: () => this.systemVoice() },
      { name: 'Avatar Wear', value: this.getAvatarAccName(this.profile.avatarWear), click: () => this.avatarAcc(1, this.profile.avatarWear) },
      { name: 'Avatar Head', value: this.getAvatarAccName(this.profile.avatarHead), click: () => this.avatarAcc(2, this.profile.avatarHead) },
      { name: 'Avatar Face', value: this.getAvatarAccName(this.profile.avatarFace), click: () => this.avatarAcc(3, this.profile.avatarFace) },
      { name: 'Avatar Skin', value: this.getAvatarAccName(this.profile.avatarSkin), click: () => this.avatarAcc(4, this.profile.avatarSkin) },
      { name: 'Avatar Item', value: this.getAvatarAccName(this.profile.avatarItem), click: () => this.avatarAcc(5, this.profile.avatarItem) },
      { name: 'Avatar Front', value: this.getAvatarAccName(this.profile.avatarFront), click: () => this.avatarAcc(6, this.profile.avatarFront) },
      { name: 'Avatar Back', value: this.getAvatarAccName(this.profile.avatarBack), click: () => this.avatarAcc(7, this.profile.avatarBack) },
    ];
  }

  refreshProfile() {
    this.aimeId = String(this.auth.currentUserValue.extId);
    this.apiServer = this.auth.currentUserValue.apiServer;
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/chuni/v2/profile', param).subscribe(
      data => {
        this.profile = data;
        this.initCustomable();
      },
      error => this.messageService.notice(error)
    );
  }

  getNamePlateName(nameplateId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanNamePlate>('chusanNamePlate', nameplateId).subscribe(NamePlate => resolve(nameplateId + ': ' + (NamePlate.name ? NamePlate.name : "Unknown")));
    })
  }

  getFrameName(frameId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanTrophy>('chusanFrame', frameId).subscribe(frame => resolve(frameId + ': ' + (frame.name ? frame.name : "Unknown")));
    })
  }

  getMapIconName(mapiconId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanMapIcon>('chusanMapIcon', mapiconId).subscribe(mapicon => resolve(mapiconId + ': ' + (mapicon.name ? mapicon.name : "Unknown")));
    })
  }

  getSystemVoiceName(sysvoiceId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanSystemVoice>('chusanSystemVoice', sysvoiceId).subscribe(sysvoice => resolve(sysvoiceId + ': ' + (sysvoice.name ? sysvoice.name : "Unknown")));
    })
  }

  getAvatarAccName(avatarAccId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanAvatarAcc>('chusanAvatarAcc', avatarAccId).subscribe(avatarAcc => resolve(avatarAccId + ': ' + (avatarAcc.name ? avatarAcc.name : "Unknown")));
    })
  }

  getTrophyName(trophyId: number) {
    return new Promise( resolve => {
      this.dbService.getByID<ChusanTrophy>('chusanTrophy', trophyId).subscribe(trophy => resolve(trophyId + ': ' + (trophy.name ? trophy.name : "Unknown")));
    })
  }

  namePlate() {
    const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
      width: '250px',
      data: {itemKind: 1, itemId: this.profile.nameplateId}
    });

    dialogRef.afterClosed().subscribe(namePlateId => {
      if (typeof namePlateId === "number") {
        this.api.put('api/game/chuni/v2/profile/plate', {aimeId: this.aimeId, nameplateId: namePlateId}).subscribe(
          () => {
            this.messageService.notice('Successfully changed');
            this.refreshProfile();
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  frame() {
    const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
      width: '250px',
      data: {itemKind: 2, itemId: this.profile.frameId}
    });

    dialogRef.afterClosed().subscribe(frameId => {
      if (typeof frameId === "number") {
        this.api.put('api/game/chuni/v2/profile/frame', {aimeId: this.aimeId, frameId: frameId}).subscribe(
          () => {
            this.messageService.notice('Successfully changed');
            this.refreshProfile();
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  trophy() {
    const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
      width: '250px',
      data: {itemKind: 3, itemId: this.profile.trophyId}
    });

    dialogRef.afterClosed().subscribe(trophyId => {
      if (typeof trophyId === "number") {
        this.api.put('api/game/chuni/v2/profile/trophy', {aimeId: this.aimeId, trophyId: trophyId}).subscribe(
          () => {
            this.messageService.notice('Successfully changed');
            this.refreshProfile();
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  mapIcon() {
    const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
      width: '250px',
      data: {itemKind: 8, itemId: this.profile.mapIconId}
    });

    dialogRef.afterClosed().subscribe(mapIconId => {
      if (typeof mapIconId === "number") {
        this.api.put('api/game/chuni/v2/profile/mapicon', {aimeId: this.aimeId, mapiconId: mapIconId}).subscribe(
          () => {
            this.messageService.notice('Successfully changed');
            this.refreshProfile();
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  systemVoice() {
    const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
      width: '250px',
      data: {itemKind: 9, itemId: this.profile.voiceId}
    });

    dialogRef.afterClosed().subscribe(voiceId => {
      if (typeof voiceId === "number") {
        this.api.put('api/game/chuni/v2/profile/sysvoice', {aimeId: this.aimeId, voiceId: voiceId}).subscribe(
          () => {
            this.messageService.notice('Successfully changed');
            this.refreshProfile();
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  avatarAcc(category: number, accId: number) {
    const dialogRef = this.dialog.open(V2UserBoxSettingDialog, {
      width: '250px',
      data: {itemKind: 11, itemId: accId, category: category}
    });

    dialogRef.afterClosed().subscribe(accId => {
      if (typeof accId === "number") {
        this.api.put('api/game/chuni/v2/profile/avatar', {aimeId: this.aimeId, category: category, accId: accId}).subscribe(
          () => {
            this.messageService.notice('Successfully changed');
            this.refreshProfile();
          }, error => this.messageService.notice(error)
        );
      }
    });
  }
}
