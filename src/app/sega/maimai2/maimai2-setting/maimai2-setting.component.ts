import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {MessageService} from '../../../message.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DisplayMaimai2Profile} from '../model/Maimai2Profile';
import { Maimai2UploadUserPortraitDialog } from './maimai2-upload-user-portrait/maimai2-upload-user-portrait.dialog';
import {environment} from '../../../../environments/environment';
import { UserService } from 'src/app/user.service';
import {AccountService} from '../../../auth/account.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-maimai2-setting',
  templateUrl: './maimai2-setting.component.html',
  styleUrls: ['./maimai2-setting.component.css']
})
export class Maimai2SettingComponent implements OnInit {

  profile: DisplayMaimai2Profile;
  userNameForm: FormGroup;
  redeemCodeForm: FormGroup;

  aimeId: number;
  apiServer: string;
  divMaxLength: number;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private accountService: AccountService,
    private http: HttpClient,
    private userService: UserService,
    private messageService: MessageService,
    private modalService: NgbModal
  ) {
    this.userNameForm = this.fb.group({
      username: [''],
    });
    this.redeemCodeForm = this.fb.group({
      redeemCode: [''],
    });
  }

  get userNameInput(){
    return this.userNameForm.get('username');
  }

  get redeemCodeInput(){
    return this.redeemCodeForm.get('redeemCode');
  }

  ngOnInit(): void {
    this.aimeId = this.userService.currentUser.defaultCard.extId;
    this.apiServer = environment.apiServer;
    const param = new HttpParams().set('aimeId', this.aimeId);
    this.api.get('api/game/maimai2/profile', param).subscribe(
      data => {
        this.profile = data;
        this.userNameForm.setValue({username: data.userName });
      },
      error => this.messageService.notice(error)
    );


    this.api.get('api/game/maimai2/config/userPhoto/divMaxLength').subscribe(divMaxLength => {
      this.divMaxLength = divMaxLength;
    });
  }

  onSubmit(){

  }

  userName() {
      if (this.userNameForm.touched) {
        this.api.post('api/game/maimai2/profile/username', { aimeId: this.aimeId, userName: this.userNameInput.value }).subscribe(
          x => {
            this.profile = x;
            this.messageService.notice('Successfully changed');
          }, error => this.messageService.notice(error)
        );
      }

  }

  activateRedeemCode() {
    if (this.redeemCodeForm.touched) {
      const param = new HttpParams().set('aimeId', this.aimeId).set('redeemCode', this.redeemCodeInput.value);
      this.api.get('api/game/maimai2/redeem',param).subscribe(
        x => {
          if (x.status.code === 92001){
            this.messageService.notice('Successfully activated ' + x.data);
          }else{
            this.messageService.notice(x.data);
          }
        }, error => this.messageService.notice(error)
      );
    }

  }

  openUploadUserPortraitDialog() {
    const modalRef = this.modalService.open(Maimai2UploadUserPortraitDialog, {scrollable: true, centered: true});
    modalRef.componentInstance.aimeId = String(this.userService.currentUser.defaultCard.extId);
    modalRef.componentInstance.divMaxLength = this.divMaxLength;
  }

  downloadFile() {
    const url = this.apiServer + 'api/game/maimai2/export?aimeId=' + this.aimeId;
    const headers = { Authorization: `Bearer ${this.accountService.currentAccountValue.accessToken}` };
    this.http.get(url, { headers, responseType: 'blob' }).subscribe(blob => {
      const objUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = `maimai2_${this.aimeId}_exported.json`;
      a.click();
      document.body.appendChild(a);
      document.body.removeChild(a);

      window.URL.revokeObjectURL(objUrl);
    });
  }
}
