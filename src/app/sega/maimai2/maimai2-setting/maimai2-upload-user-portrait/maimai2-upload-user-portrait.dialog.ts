import { Component, Inject, OnInit } from '@angular/core';
import Cropper from 'cropperjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { MessageService } from 'src/app/message.service';

const PACKET_LENGTH = 10240;

@Component({
  selector: 'app-maimai2-upload-user-portrait',
  templateUrl: './maimai2-upload-user-portrait.dialog.html',
  styleUrls: ['./maimai2-upload-user-portrait.dialog.css']
})
export class Maimai2UploadUserPortraitDialog implements OnInit {
  cropper: Cropper;
  dialogRef: MatDialogRef<Maimai2UploadUserPortraitDialog>;
  aimeId: string;
  image: HTMLImageElement;
  api: ApiService;
  messageService: MessageService;
  maxUploadFileSize: number;
  usage: number;

  constructor(
    dialogRef: MatDialogRef<Maimai2UploadUserPortraitDialog>,
    api: ApiService,
    messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: { aimeId: string, divMaxLength: number }
  ) {
    this.aimeId = data.aimeId;
    this.dialogRef = dialogRef;
    this.api = api;
    this.messageService = messageService;
    this.maxUploadFileSize = data.divMaxLength * PACKET_LENGTH;
  }

  readSingleFile(e) {
    let file: File = e.target.files[0];
    if (!file) {
      this.dialogRef.close();
      return;
    }

    this.image.src = URL.createObjectURL(file);
    this.cropper = new Cropper(this.image, {
      aspectRatio: 1 / 1,
      viewMode: 2,
      movable: true,
      rotatable: false,
      zoomable: true,
      dragMode: "move",
      scalable: false,
    });
  }

  ngOnInit() {
    let image: any = document.getElementById('image');
    this.image = image;

    let fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (e) => this.readSingleFile(e), false);
    fileInput.click();
  }

  async upload(blob: Blob) {
    let buffer = await blob.arrayBuffer();

    let divLength = Math.floor(buffer.byteLength / PACKET_LENGTH) + 1;
    let remainLength = buffer.byteLength;

    let offset = 0;
    let divNumber = 0;
    let fileName = this.aimeId + ".jpg";

    while (true) {
      let readLength = Math.min(PACKET_LENGTH, remainLength);
      let subBuffer = buffer.slice(offset, offset + readLength);

      let divData = btoa(String.fromCharCode(...new Uint8Array(subBuffer)));

      let param = {
        userPortrait: {
          userId: this.aimeId,
          divLength,
          divNumber,
          divData,
          placeId: 291,
          clientId: "A63E01A2857",
          uploadDate: "2022-12-10 12:31:00.0",
          fileName
        }
      };

      let body: any = JSON.stringify(param);
      var error = await new Promise(rx => this.api.post("Maimai2Servlet/UploadUserPortraitApi", body)
        .subscribe(
          (data) => {
            rx(data.returnCode != 1 ? "File size is too large" : null);
          },
          (error) => {
            rx(error);
          }
        ));

      if (error != null) {
        this.messageService.notice(`change user portrait failed: ${error}`);
        return;
      }

      if (readLength < PACKET_LENGTH)
        break;

      remainLength -= readLength;
      offset += readLength;
      divNumber++;
    }

    this.messageService.notice(`change user portrait successfully.`);
    this.dialogRef.close();
  }

  async onComfirm() {
    let getCropped = (options?: Cropper.GetCroppedCanvasOptions) => new Promise<Blob>(solve => {
      this.cropper.getCroppedCanvas(options).toBlob(blob => solve(blob))
    });

    let tryUpload = async (options?: Cropper.GetCroppedCanvasOptions) => {
      let blob = await getCropped(options);
      if (blob.size > this.maxUploadFileSize) {
        return false;
      } else {
        await this.upload(blob);
        console.log(`upload ${blob.size}bytes crop data with option: ${JSON.stringify(options)}`);
        return true;
      }
    }

    if (
      await tryUpload() ||
      await tryUpload({ imageSmoothingEnabled: true, imageSmoothingQuality: "medium" }) ||
      await tryUpload({ imageSmoothingEnabled: true, imageSmoothingQuality: "low" }))
      return;
    else
      this.messageService.notice(`upload file size is too large.`);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
