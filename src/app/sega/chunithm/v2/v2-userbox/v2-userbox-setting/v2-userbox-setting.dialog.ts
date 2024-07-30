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
import {ChusanFrame} from '../../model/ChusanFrame';
import { UserService } from 'src/app/user.service';

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
    private userService: UserService,
    private dbService: NgxIndexedDBService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {
  }

  pageChanged(page: number) {
    this.currentPage = page;
  }

  ngOnInit() {
    // if (this.enableImages == true && this.data.itemKind != 2 && this.data.itemKind != 3) {this.dialogRef.updateSize('80%', '80%');}
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    const param = new HttpParams().set('aimeId', this.aimeId);

    // Make all avatar accs available as there is no way to obtain them in game
    if (this.data.itemKind === 11) {
      this.dbService.getAll<ChusanAvatarAcc>('chusanAvatarAcc').subscribe(avatarAccList => {
        this.iList = avatarAccList
          .filter(avatarAcc => avatarAcc.category === this.data.category)
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
    else if(!this.data.showAllItems) {
      this.api.get('api/game/chuni/v2/item/' + this.data.itemKind, param).subscribe(
        (data: V2Item[]) => {
          if (data) {
            if (this.data.itemKind === 1){
              this.dbService.getAll<ChusanNamePlate>('chusanNamePlate').subscribe(list => {
                this.iList = list.
                filter(item => {
                  return data.some(d => d.itemId === item.id);
                }).
                map(item => {
                  return {itemId: item.id, itemKind: 1, name: item.name, stock: 1};
                });
              });
            }
            else if (this.data.itemKind === 2){
              this.dbService.getAll<ChusanFrame>('chusanFrame').subscribe(list => {
                this.iList = list.
                filter(item => {
                  return data.some(d => d.itemId === item.id);
                }).
                map(item => {
                  return {itemId: item.id, itemKind: 2, name: item.name, stock: 1};
                });
              });
            }
            else if (this.data.itemKind === 3){
              this.dbService.getAll<ChusanTrophy>('chusanTrophy').subscribe(list => {
                this.iList = list.
                filter(item => {
                  return data.some(d => d.itemId === item.id);
                }).
                map(item => {
                  return {itemId: item.id, itemKind: 3, name: item.name, stock: 1};
                });
              });
            }
            else if (this.data.itemKind === 8){
              this.dbService.getAll<ChusanMapIcon>('chusanMapIcon').subscribe(list => {
                this.iList = list.
                filter(item => {
                  return data.some(d => d.itemId === item.id);
                }).
                map(item => {
                  return {itemId: item.id, itemKind: 8, name: item.name, stock: 1};
                });
              });
            }
            else if (this.data.itemKind === 9){
              this.dbService.getAll<ChusanSystemVoice>('chusanSystemVoice').subscribe(list => {
                this.iList = list.
                filter(item => {
                  return data.some(d => d.itemId === item.id);
                }).
                map(item => {
                  return {itemId: item.id, itemKind: 9, name: item.name, stock: 1};
                });
              });
            }

            const currentIndex = this.iList.findIndex(item => {
              return item.itemId === this.data.itemId;
            });
            if (currentIndex !== -1) {
              this.pageChanged(Math.floor(currentIndex / 12) + 1);
            }
          }
        },
        error => this.messageService.notice(error)
      );
    }
    else{
      if (this.data.itemKind === 1){
        this.dbService.getAll<ChusanNamePlate>('chusanNamePlate').subscribe(list => {
          this.iList = list.
          map(item => {
            return {itemId: item.id, itemKind: 1, name: item.name, stock: 1};
          });
        });
      }
      else if (this.data.itemKind === 2){
        this.dbService.getAll<ChusanFrame>('chusanFrame').subscribe(list => {
          this.iList = list.
          map(item => {
            return {itemId: item.id, itemKind: 2, name: item.name, stock: 1};
          });
        });
      }
      else if (this.data.itemKind === 3){
        this.dbService.getAll<ChusanTrophy>('chusanTrophy').subscribe(list => {
          this.iList = list.
          map(item => {
            return {itemId: item.id, itemKind: 3, name: item.name, stock: 1};
          });
        });
      }
      else if (this.data.itemKind === 8){
        this.dbService.getAll<ChusanMapIcon>('chusanMapIcon').subscribe(list => {
          this.iList = list.
          map(item => {
            return {itemId: item.id, itemKind: 8, name: item.name, stock: 1};
          });
        });
      }
      else if (this.data.itemKind === 9){
        this.dbService.getAll<ChusanSystemVoice>('chusanSystemVoice').subscribe(list => {
          this.iList = list.
          map(item => {
            return {itemId: item.id, itemKind: 9, name: item.name, stock: 1};
          });
        });
      }

      const currentIndex = this.iList.findIndex(item => {
        return item.itemId === this.data.itemId;
      });
      if (currentIndex !== -1) {
        this.pageChanged(Math.floor(currentIndex / 12) + 1);
      }
    }
  }
}

export interface V2UserBoxSettingData {
  itemKind: number;
  itemId: number;
  category?: number;
  showAllItems: boolean;
}
