import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'maimai2-name-setting-dialog',
  templateUrl: 'maimai2-name-setting.html',
})
export class Maimai2NameSettingDialog {

  constructor(
    public dialogRef: MatDialogRef<Maimai2NameSettingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Maimai2NameSettingData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface Maimai2NameSettingData {
  userName: string;
}
