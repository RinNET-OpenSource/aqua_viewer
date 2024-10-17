import { Component, Inject, OnInit } from '@angular/core';
import Cropper from 'cropperjs';
import { ApiService } from 'src/app/api.service';
import { MessageService } from 'src/app/message.service';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Modal} from "bootstrap";

const PACKET_LENGTH = 10240;

@Component({
  selector: 'app-maimai2-upload-user-portrait',
  templateUrl: './maimai2-upload-user-portrait.dialog.html',
  styleUrls: ['./maimai2-upload-user-portrait.dialog.css']
})
export class Maimai2UploadUserPortraitDialog implements OnInit {
  cropper: Cropper;
  aimeId: string;
  image: HTMLImageElement;
  api: ApiService;
  messageService: MessageService;
  maxUploadFileSize: number;
  usage: number;

  constructor(
    api: ApiService,
    messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: { aimeId: string, divMaxLength: number }
  ) {
    this.aimeId = data.aimeId;
    this.api = api;
    this.messageService = messageService;
    this.maxUploadFileSize = data.divMaxLength * PACKET_LENGTH;
  }

  readSingleFile(e) {
    let file: File = e.target.files[0];
    if (!file) {
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

    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (e) => this.readSingleFile(e), false);

    // Programmatically open the modal
    const modal = new Modal(document.getElementById('changeUserPortraitModal'));
    modal.show();

    fileInput.click();
  }
  async upload(blob: Blob) {
    const buffer = await blob.arrayBuffer();
    const divLength = Math.floor(buffer.byteLength / PACKET_LENGTH) + 1;
    let remainLength = buffer.byteLength;

    let offset = 0;
    let divNumber = 0;
    const fileName = `${this.aimeId}.jpg`;

    while (true) {
      const readLength = Math.min(PACKET_LENGTH, remainLength);
      const subBuffer = buffer.slice(offset, offset + readLength);
      const divData = btoa(String.fromCharCode(...new Uint8Array(subBuffer)));

      const param = {
        userPortrait: {
          userId: this.aimeId,
          divLength,
          divNumber,
          divData,
          placeId: 291,
          clientId: "A63E01A2857",
          uploadDate: new Date().toISOString(),
          fileName
        }
      };

      const body: any = JSON.stringify(param);
      const error = await new Promise((resolve) => {
        this.api.post("Maimai2Servlet/A63E01C2948/1.40/UploadUserPortraitApi", body).subscribe(
          (data) => {
            resolve(data.returnCode !== 1 ? "File size is too large" : null);
          },
          (error) => {
            resolve(error);
          }
        );
      });

      if (error) {
        this.messageService.notice(`Change user portrait failed: ${error}`);
        return;
      }

      if (readLength < PACKET_LENGTH) break;

      remainLength -= readLength;
      offset += readLength;
      divNumber++;
    }

    this.messageService.notice(`Change user portrait successfully.`);
    const modal = Modal.getInstance(document.getElementById('changeUserPortraitModal'));
    if (modal) {
      modal.hide();
    }
  }

  // Also keep other methods unchanged
  async onComfirm() {
    const getCropped = (options?: Cropper.GetCroppedCanvasOptions) =>
      new Promise<Blob>(resolve => this.cropper.getCroppedCanvas(options).toBlob(resolve));

    const tryUpload = async (options?: Cropper.GetCroppedCanvasOptions) => {
      const blob = await getCropped(options);
      if (blob.size > this.maxUploadFileSize) {
        return false;
      } else {
        await this.upload(blob);
        console.log(`Upload ${blob.size} bytes crop data with option: ${JSON.stringify(options)}`);
        return true;
      }
    };

    if (
      await tryUpload() ||
      await tryUpload({ imageSmoothingEnabled: true, imageSmoothingQuality: "medium" }) ||
      await tryUpload({ imageSmoothingEnabled: true, imageSmoothingQuality: "low" })
    ) {
      return;
    } else {
      this.messageService.notice(`Upload file size is too large.`);
    }
  }
  onCancel() {
    // Close the modal programmatically
    const modal = Modal.getInstance(document.getElementById('changeUserPortraitModal'));
    if (modal) {
      modal.hide();
    }
  }
}
