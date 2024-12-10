import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {V2Item} from '../../model/V2Item';
import {ApiService} from '../../../../../api.service';
import {MessageService} from '../../../../../message.service';
import {UserService} from '../../../../../user.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {V2UserBoxSettingData} from '../v2-userbox-setting/v2-userbox-setting.dialog';
import {ChusanSymbolChat} from '../../model/ChusanSymbolChat';
import {V2SymbolChat} from '../../model/V2SymbolChat';
import {error} from 'protractor';
import {TranslateService} from '@ngx-translate/core';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-v2-symbol-chat-setting',
  templateUrl: './v2-symbol-chat-setting.component.html',
  styleUrls: ['./v2-symbol-chat-setting.component.css']
})
export class V2SymbolChatSettingComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;
  aimeId: string;
  iList: ChusanSymbolChat[] = [];
  parentComponent: any;
  currentPage: number;
  @Input() public data: V2SymbolChat;
  selectedItem: number;

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private userService: UserService,
    private dbService: NgxIndexedDBService,
    private translateService: TranslateService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
  }

  ngOnInit() {
    this.dbService.getAll<ChusanSymbolChat>('chusanSymbolChat').subscribe(list => {
      this.iList = list.filter(x => x.sceneIds.some(sceneId => this.data.sceneId === sceneId));
    });
    this.selectedItem = this.data.symbolChatId;
  }

  pageChanged(page: number) {
    this.currentPage = page;
  }

  applySymbolChat() {
    const params = {
      aimeId: this.aimeId,
      sceneId: this.data.sceneId.toString(),
      orderId: this.data.orderId.toString(),
      symbolChatId: this.selectedItem.toString()};
    this.api.put('api/game/chuni/v2/profile/symbolChatInfo', params).subscribe({
        next: async result => {
          if (result.symbolChatId.toString() === params.symbolChatId) {
            this.data.symbolChatId = result.symbolChatId;
            this.messageService.notice(await lastValueFrom(this.translateService.get('ChuniV2.UserBoxPage.MessageSuccess')), 'success');
            this.modalService.dismissAll();
          }
          this.messageService.notice(await lastValueFrom(this.translateService.get('ChuniV2.UserBoxPage.MessageFailed')), 'warning');
        },
        error: e => this.messageService.notice(e, 'warning')
      }
    );
  }
}
