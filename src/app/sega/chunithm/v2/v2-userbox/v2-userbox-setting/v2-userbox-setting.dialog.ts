import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../../auth/authentication.service';
import {MessageService} from '../../../../../message.service';
import {ApiService} from '../../../../../api.service';
import {V2Item} from '../../model/V2Item';
import {HttpParams} from '@angular/common/http';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import { ChusanAvatarAcc } from '../../model/ChusanAvatarAcc';

@Component({
  selector: 'v2-userbox-setting-dialog',
  templateUrl: 'v2-userbox-setting.html',
})
export class V2UserBoxSettingDialog {

  aimeId: string;
  iList: V2Item[] = [];

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<V2UserBoxSettingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: V2UserBoxSettingData,
    private messageService: MessageService,
    private auth: AuthenticationService,
    private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {
    this.aimeId = String(this.auth.currentUserValue.extId);
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/chuni/v2/item/' + this.data.itemKind, param).subscribe(
      data => {
        data.forEach(x => {
          if (this.data.itemKind == 11) {
            this.dbService.getByID<ChusanAvatarAcc>('chusanAvatarAcc', x.itemId).subscribe(avatarAcc => {
              if (avatarAcc.category == this.data.category) {
                this.iList.push(x);
              }
            });
          } else {
            this.iList.push(x);
          }
        });
      },
      error => this.messageService.notice(error)
    );
  }

}

export interface V2UserBoxSettingData {
  itemKind: number;
  itemId: number;
  category: number;
}
