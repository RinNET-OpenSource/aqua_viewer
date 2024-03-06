import {Component, Inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
  parentComponent: any;
  currentPage: number;
  @Input() public data: V2UserBoxSettingData;

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private auth: AuthenticationService,
    private dbService: NgxIndexedDBService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {
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

  pageChanged(page: number) {
    this.currentPage = page;
  }

  ngOnInit() {
    // if (this.enableImages == true && this.data.itemKind != 2 && this.data.itemKind != 3) {this.dialogRef.updateSize('80%', '80%');}
    this.aimeId = String(this.auth.currentAccountValue.currentCard.extId);
    const param = new HttpParams().set('aimeId', this.aimeId);

    // Make all avatar accs available as there is no way to obtain them in game
    if (this.data.itemKind === 11) {
      this.dbService.getAll<ChusanAvatarAcc>('chusanAvatarAcc').subscribe(avatarAccList => {
        this.iList = avatarAccList
          .filter(avatarAcc => {
            return avatarAcc.category === this.data.category;
          })
          .map(avatarAcc => {
          return {
            itemKind: 11, itemId: avatarAcc.id, stock: 1, name: avatarAcc.name ? avatarAcc.name : 'Unknown'
          };
        });

        const currentIndex = this.iList.findIndex(item => {
          return item.itemId === this.data.itemId;
        });
        if (currentIndex !== -1){
          this.pageChanged(Math.floor(currentIndex / 12) + 1);
        }
      });
    }
    else {
      this.api.get('api/game/chuni/v2/item/' + this.data.itemKind, param).subscribe(
        data => {
          if (data) {
            this.iList = data;
            const currentIndex = this.iList.findIndex(item => {
              return item.itemId === this.data.itemId;
            });
            if (currentIndex !== -1){
              this.pageChanged(Math.floor(currentIndex / 12) + 1);
            }
            data.forEach(x => {
              switch (this.data.itemKind) {
                case 1: // Nameplate
                  this.getNamePlateName(x.itemId).then(name => {
                    x.name = name;
                  });
                  break;
                case 2: // Frame
                  this.getFrameName(x.itemId).then(name => {
                    x.name = name;
                  });
                  break;
                case 3: // Trophy
                  x.name = this.getTrophyName(x.itemId);
                  break;
                case 8: // Map Icon
                  this.getMapIconName(x.itemId).then(name => {
                    x.name = name;
                  });
                  break;
                case 9: // System Voice
                  this.getSystemVoiceName(x.itemId).then(name => {
                    x.name = name;
                  });
                  break;
                default:
                  break;
              }
            });
          }
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
