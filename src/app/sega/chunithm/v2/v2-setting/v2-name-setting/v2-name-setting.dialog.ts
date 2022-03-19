import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'v2-name-setting-dialog',
  templateUrl: 'v2-name-setting.html',
})
export class V2NameSettingDialog {

  constructor(
    public dialogRef: MatDialogRef<V2NameSettingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: V2NameSettingData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface V2NameSettingData {
  userName: string;
}
