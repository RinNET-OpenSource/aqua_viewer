import {Component, OnInit} from '@angular/core';
import {DivaProfile} from '../model/DivaProfile';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {HttpParams} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {DivaNameSettingDialog} from './diva-name-setting/diva-name-setting.dialog';
import {DivaTitleSettingDialog} from './diva-title-setting/diva-title-setting.dialog';
import {DivaPlateSettingDialog} from './diva-plate-setting/diva-plate-setting.dialog';
import {DivaMylistSettingDialog} from './diva-mylist-setting/diva-mylist-setting.dialog';
import {DivaSeSettingDialog} from './diva-se-setting/diva-se-setting.dialog';
import {DivaDisplaySettingDialog} from './diva-display-setting/diva-display-setting.dialog';
import {DivaSkinSettingDialog} from './diva-skin-setting/diva-skin-setting.dialog';
import {DivaRivalSettingDialog} from './diva-rival-setting/diva-rival-setting.dialog';

@Component({
  selector: 'app-diva-setting',
  templateUrl: './diva-setting.component.html',
  styleUrls: ['./diva-setting.component.css']
})
export class DivaSettingComponent implements OnInit {

  profile: DivaProfile;

  pdId: number;

  rival = 'Loading...';

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.pdId = this.auth.currentAccountValue.currentCard;
    const param = new HttpParams().set('pdId', String(this.pdId));
    this.api.get('api/game/diva/playerInfo', param).subscribe(
      data => this.profile = data,
      error => this.messageService.notice(error)
    );
    this.loadRival();
  }

  loadRival() {
    const param = new HttpParams().set('pdId', String(this.pdId));
    this.api.get('api/game/diva/playerInfo/rival', param).subscribe(
      data => this.rival = data.rival,
      error => this.messageService.notice(error)
    );
  }

  playerName(): void {
    const dialogRef = this.dialog.open(DivaNameSettingDialog, {
      width: '250px',
      data: {playerName: this.profile.playerName}
    });

    dialogRef.afterClosed().subscribe(playerName => {
      if (playerName) {
        this.api.put('api/game/diva/playerInfo/playerName', {pdId: this.pdId, playerName}).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('OK');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  playerTitle(): void {
    const dialogRef = this.dialog.open(DivaTitleSettingDialog, {
      width: '250px',
      data: {title: this.profile.levelTitle}
    });

    dialogRef.afterClosed().subscribe(title => {
      if (title) {
        this.api.put('api/game/diva/playerInfo/title', {pdId: this.pdId, title}).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('OK');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  playerPlate(): void {
    const dialogRef = this.dialog.open(DivaPlateSettingDialog, {
      width: '250px',
      data: {
        plateId: this.profile.plateId,
        plateEffectId: this.profile.plateEffectId,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.api.put('api/game/diva/playerInfo/plate', {
          pdId: this.pdId,
          plateId: data.plateId,
          plateEffectId: data.plateEffectId
        }).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('OK');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  skin(): void {
    const dialogRef = this.dialog.open(DivaSkinSettingDialog, {
      width: '250px',
      data: {
        skinId: this.profile.commonSkin
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.api.put('api/game/diva/playerInfo/commonSkin', {
          pdId: this.pdId,
          skinId: data.skinId
        }).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('OK');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  myList(): void {
    const dialogRef = this.dialog.open(DivaMylistSettingDialog, {
      width: '250px',
      data: {
        selector: '0',
        myList0: this.profile.myList0,
        myList1: this.profile.myList1,
        myList2: this.profile.myList2,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.api.put('api/game/diva/playerInfo/myList', {
          pdId: this.pdId,
          myListId: Number(data.selector),
          myListData: Number(data.selector) === 0 ? data.myList0 : data.selector === 1 ? data.myList1 : data.myList2
        }).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('OK');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  commonSe(): void {
    const dialogRef = this.dialog.open(DivaSeSettingDialog, {
      width: '250px',
      data: {
        buttonSe: this.profile.buttonSe,
        chainSlideSe: this.profile.chainSlideSe,
        slideSe: this.profile.slideSe,
        sliderTouchSe: this.profile.sliderTouchSe
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.api.put('api/game/diva/playerInfo/se', {
          pdId: this.pdId,
          buttonSe: data.buttonSe,
          chainSlideSe: data.chainSlideSe,
          slideSe: data.slideSe,
          sliderTouchSe: data.sliderTouchSe
        }).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('OK');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  display(): void {
    const dialogRef = this.dialog.open(DivaDisplaySettingDialog, {
      width: '250px',
      data: {
        showInterimRanking: this.profile.showInterimRanking,
        showClearStatus: this.profile.showClearStatus,
        showGreatBorder: this.profile.showGreatBorder,
        showExcellentBorder: this.profile.showExcellentBorder,
        showRivalBorder: this.profile.showRivalBorder,
        showRgoSetting: this.profile.showRgoSetting,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.api.put('api/game/diva/playerInfo/display', {
          pdId: this.pdId,
          showInterimRanking: data.showInterimRanking,
          showClearStatus: data.showClearStatus,
          showGreatBorder: data.showGreatBorder,
          showExcellentBorder: data.showExcellentBorder,
          showRivalBorder: data.showRivalBorder,
          showRgoSetting: data.showRgoSetting,
        }).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('OK');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }

  setRival(): void {
    const dialogRef = this.dialog.open(DivaRivalSettingDialog, {
      width: '250px',
      data: {
        rival: -1,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.api.put('api/game/diva/playerInfo/rival', {
          pdId: this.pdId,
          rivalId: data.rivalId
        }).subscribe(
          x => {
            this.profile = x;
            this.loadRival();
            this.messageService.notice('OK');
          }, error => this.messageService.notice(error)
        );
      }
    });
  }
}
