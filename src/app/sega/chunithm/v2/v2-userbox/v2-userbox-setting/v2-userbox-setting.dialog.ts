import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../../auth/authentication.service';
import {MessageService} from '../../../../../message.service';
import {ApiService} from '../../../../../api.service';
import {V2Item} from '../../model/V2Item';
import {HttpParams} from '@angular/common/http';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../../../../../environments/environment';
import { ChusanTrophy } from '../../model/ChusanTrophy';
import { ChusanNamePlate } from '../../model/ChusanNamePlate';
import { ChusanSystemVoice } from '../../model/ChusanSystemVoice';
import { ChusanMapIcon } from '../../model/ChusanMapIcon';
import { ChusanAvatarAcc } from '../../model/ChusanAvatarAcc';
import {subscribeOn} from 'rxjs';

@Component({
  selector: 'v2-userbox-setting-dialog',
  templateUrl: 'v2-userbox-setting.html',
  styleUrls: ['v2-userbox.setting.css']
})
export class V2UserBoxSettingDialog implements OnInit{

  host = environment.assetsHost;
  enableImages = environment.enableImages;
  aimeId: string;
  iList: V2Item[] = [];
  test: string;
  @Input() public data: V2UserBoxSettingData;

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private auth: AuthenticationService,
    private dbService: NgxIndexedDBService,
    //   @Inject(MAT_DIALOG_DATA) public data: V2UserBoxSettingData,
    // @Input() public data: V2UserBoxSettingData,
  ) {
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
  //
  ngOnInit() {
    // if (this.enableImages == true && this.data.itemKind != 2 && this.data.itemKind != 3) {this.dialogRef.updateSize('80%', '80%');}
    this.aimeId = String(this.auth.currentAccountValue.currentCard);
    const param = new HttpParams().set('aimeId', this.aimeId);

    console.log(this.data);
    // Make all avatar accs available as there is no way to obtain them in game
    if (this.data.itemKind == 11) {
      this.dbService.getAll<ChusanAvatarAcc>('chusanAvatarAcc').subscribe(avatarAccList => {
        avatarAccList.forEach(avatarAcc => {
          console.log(avatarAcc);
          if (avatarAcc.category == this.data.category) {
            const acc: V2Item = {
              itemKind: 11, itemId: avatarAcc.id, stock: 1, name: avatarAcc.id + ': ' + (avatarAcc.name ? avatarAcc.name : 'Unknown')
            };
            this.iList.push(acc);
            this.iList.sort((a, b) => a.itemId - b.itemId);
          }
        });
      });
    } else {
      console.log(11111321321);
      this.api.get('api/game/chuni/v2/item/' + this.data.itemKind, param).subscribe(
        data => {
          data.forEach(x => {
            switch (this.data.itemKind) {
              case 1: // Nameplate
                this.getNamePlateName(x.itemId).then(name => {
                  x.name = name;
                  this.iList.push(x);
                  this.iList.sort((a, b) => a.itemId - b.itemId);
                  this.test = this.iList[0].name;
                  console.log(this.test);
                });
                break;
              case 2: // Frame
                this.getFrameName(x.itemId).then(name => {
                  x.name = name;
                  this.iList.push(x);
                  this.iList.sort((a, b) => a.itemId - b.itemId);
                });
                break;
              case 3: // Trophy
                this.getTrophyName(x.itemId).then(name => {
                  x.name = name;
                  this.iList.push(x);
                  this.iList.sort((a, b) => a.itemId - b.itemId);
                });
                break;
              case 8: // Map Icon
                this.getMapIconName(x.itemId).then(name => {
                  x.name = name;
                  this.iList.push(x);
                  this.iList.sort((a, b) => a.itemId - b.itemId);
                });
                break;
              case 9: // System Voice
                this.getSystemVoiceName(x.itemId).then(name => {
                  x.name = name;
                  this.iList.push(x);
                  this.iList.sort((a, b) => a.itemId - b.itemId);
                });
                break;
              default:
                break;
            }
          });
        },
        error => this.messageService.notice(error)
      );
    }
  }
}

export interface V2UserBoxSettingData {
  itemKind: number;
  itemId: number;
  category?: number;
}
