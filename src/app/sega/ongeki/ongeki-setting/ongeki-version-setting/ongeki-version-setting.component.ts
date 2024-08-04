import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OngekiSettingComponent } from '../ongeki-setting.component';

@Component({
  selector: 'app-ongeki-version-setting',
  templateUrl: './ongeki-version-setting.component.html',
})

export class OngekiVersionSettingComponent {
  parentComponent: any;
  @Input() public data: OngekiSettingComponent;

  constructor(
    public modalService: NgbModal,
  ) {
  }
}

export interface OngekiVersionSettingData {
  version: string;
}
