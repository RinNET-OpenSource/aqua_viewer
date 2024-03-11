import {Component, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OngekiSettingComponent} from '../ongeki-setting.component';

@Component({
  selector: 'app-ongeki-name-setting',
  templateUrl: './ongeki-name-setting.component.html',
})
export class OngekiNameSettingComponent {
  parentComponent: any;
  @Input() public data: OngekiSettingComponent;

  constructor(
    public modalService: NgbModal,
  ) {
  }
}

export interface OngekiNameSettingData {
  userName: string;
}
