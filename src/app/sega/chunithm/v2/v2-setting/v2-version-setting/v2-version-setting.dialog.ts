import {Component, Inject, Input} from '@angular/core';
import {V2SettingComponent} from '../v2-setting.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'v2-version-setting-dialog',
  templateUrl: 'v2-version-setting.html',
})
export class V2VersionSettingDialog {

  parentComponent: any;
  @Input() public data: V2SettingComponent;
  constructor(
    public modalService: NgbModal,
  ) {
  }

}

export interface V2VersionSettingDialog {
  version: string;
}
