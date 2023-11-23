import {MessageComponent} from './message/message.component';
import {Injectable} from '@angular/core';
import {ToastService} from "./toast-service";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private messageComponent: MessageComponent,
              public toastService: ToastService) {
  }

  notice(message: string) {
    this.toastService.show(message);
    // this.messageComponent.openSnackBar(message);
  }
}
