import {Component, Inject, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {V2SettingComponent} from '../v2-setting.component';

@Component({
  selector: 'v2-name-setting-dialog',
  templateUrl: 'v2-name-setting.html',
  styleUrls: ['v2-name-setting.scss'],
})
export class V2NameSettingDialog {

  parentComponent: any;
  @Input() public data: V2SettingComponent;
  userName: string;
  userNameBtnsSymbol = [
    'Ａ', 'Ｂ', 'Ｃ', 'Ｄ', 'Ｅ', 'Ｆ', 'Ｇ', 'Ｈ', 'Ｉ', 'Ｊ', 'Ｋ', 'Ｌ', 'Ｍ', 'Ｎ', 'Ｏ', 'Ｐ', 'Ｑ', 'Ｒ', 'Ｓ', 'Ｔ', 'Ｕ', 'Ｖ', 'Ｗ', 'Ｘ', 'Ｙ', 'Ｚ',
    '．', '・', '：', '；', '？', '！', '～', '／', '＋', '－', '×', '÷', '＝', '♂', '♀', '∀', '＃', '＆', '＊', '＠', '☆',
    '○', '◎', '◇', '□', '△', '▽', '♪', '†', '‡', 'Σ', 'α', 'β', 'γ', 'θ', 'φ', 'ψ', 'ω', 'Д', 'ё'
  ];
  constructor(
    public modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.userName = this.data.userName as unknown as string;
  }


  insertCharacter(item: string) {
    if (item) {
      const oldUserName = this.userName;
      this.userName = oldUserName + item;
    }
  }

}

export interface V2NameSettingData {
  userName: string;
}
