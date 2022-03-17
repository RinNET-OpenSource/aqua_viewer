import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'v1-name-setting-dialog',
  templateUrl: 'v1-name-setting.html',
})
export class V1NameSettingDialog {

  constructor(
    public dialogRef: MatDialogRef<V1NameSettingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: V1NameSettingData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface V1NameSettingData {
  userName: string;
}
