import {Component, Inject, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {V2SettingComponent} from '../v2-setting.component';

@Component({
  selector: 'v2-name-setting-dialog',
  templateUrl: 'v2-name-setting.html',
})
export class V2NameSettingDialog {

  parentComponent: any;
  @Input() public data: V2SettingComponent;
  constructor(
    public modalService: NgbModal,
  ) {
  }

}

export interface V2NameSettingData {
  userName: string;
}
