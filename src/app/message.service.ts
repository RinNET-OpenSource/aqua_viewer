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

  notice(message: string, color: 'danger' | 'warning' | 'success' = null) {
    if(color === 'danger'){
      this.toastService.show(message, {classname: 'text-bg-danger'});
    }
    else if(color === 'warning'){
      this.toastService.show(message, {classname: 'text-bg-warning'});
    }
    else if(color === 'success'){
      this.toastService.show(message, {classname: 'text-bg-success'});
    }
    else{
      this.toastService.show(message);
    }
    // this.messageComponent.openSnackBar(message);
  }
}
