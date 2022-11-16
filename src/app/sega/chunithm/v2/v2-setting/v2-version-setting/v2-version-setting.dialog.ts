import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'v2-version-setting-dialog',
  templateUrl: 'v2-version-setting.html',
})
export class V2VersionSettingDialog {

  constructor(
    public dialogRef: MatDialogRef<V2VersionSettingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: V2VersionSettingDialog) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface V2VersionSettingDialog {
  version: string;
}
