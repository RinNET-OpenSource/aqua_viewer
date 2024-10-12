import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {MessageService} from '../../../message.service';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DisplayOngekiProfile} from '../model/OngekiProfile';
import {environment} from '../../../../environments/environment';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from 'src/app/user.service';
import {AccountService} from 'src/app/auth/account.service';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-ongeki-setting',
  templateUrl: './ongeki-setting.component.html',
  styleUrls: ['./ongeki-setting.component.css']
})
export class OngekiSettingComponent implements OnInit {

  changeUserNameForm: FormGroup;
  changeDataVersionForm: FormGroup;
  changeRomVersionForm: FormGroup;

  profile: DisplayOngekiProfile;

  aimeId: string;
  apiServer: string;
  version: string;

  dialogOptions: NgbModalOptions = {
    centered: true,
  };

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    protected modalService: NgbModal,
    public dialog: MatDialog,
    private http: HttpClient,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);

    this.changeUserNameForm = this.fb.group({
      userName: ['', [Validators.maxLength(8), Validators.required]],
    });
    this.changeUserNameForm.get('userName').valueChanges.subscribe(value => {
      const fullWidthValue = this.toFullWidth(value).substring(0, 8);
      if (value !== fullWidthValue) {
        this.changeUserNameForm.get('userName').setValue(fullWidthValue, { emitEvent: false });
      }
    });

    this.changeDataVersionForm = this.fb.group({
      dataVersion: ['', [Validators.required, this.versionValidator()]],
    });

    this.changeRomVersionForm = this.fb.group({
      romVersion: ['', [Validators.required, this.versionValidator()]],
    });

    this.loadProfile();
  }

  loadProfile(){
    this.apiServer = environment.apiServer;
    const param = new HttpParams();
    this.api.get('api/game/ongeki/profile', param).subscribe(
      data => {
        this.profile = data;
      },
      error => this.messageService.notice(error)
    );
  }

  downloadFile(): void {
    this.translate.get('Ongeki.SettingsPage.DownloadingProfile').subscribe((res: string) => {
      this.messageService.notice(res);
    });

    const url = this.apiServer + 'api/game/ongeki/export';
    const headers = {Authorization: `Bearer ${this.accountService.currentAccountValue.accessToken}`};
    this.http.get(url, {headers, responseType: 'blob'}).subscribe(blob => {
      const objectUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'ongeki_' + this.aimeId + '_exported.json';
      a.click();
      document.body.appendChild(a);
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);
    }, error => this.messageService.notice(error));
  }

  versionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      return this.canMakeVersion(value) ? null : { invalidVersion: true };
    };
  }

  canMakeVersion(src: string): boolean {
    const VersionStringPattern = /^([0-9]+)\.([0-9]+)(\.([0-9]+))?$/;
    const MajorLimit = 0xFFFF;
    const MinorLimit = 0xFF;
    const PatchLimit = 0xFF;
    const match = src.match(VersionStringPattern);
    if (!match) { return false; }

    try {
      const major = parseInt(match[1]);
      const minor = parseInt(match[2]);
      let patch = 0;

      if (match[4]) {
        patch = parseInt(match[4]);
      }

      return major <= MajorLimit && minor < MinorLimit && patch < PatchLimit;
    } catch {
      return false;
    }
  }

  onChangeUserName(modal){
    if (this.changeUserNameForm.invalid) {
      return;
    }
    const param = {userName: this.changeUserNameForm.value.userName};
    this.api.post('api/game/ongeki/profile/userName', param).subscribe(
      resp => {
        if (resp?.userName === param.userName) {
          this.changeUserNameForm.reset();
          this.profile = resp;
          modal.dismiss();
        }
        else{
          this.translate.get('Ongeki.SettingsPage.ChangeUserNameFailed').subscribe((res: string) => {
            this.messageService.notice(res, 'warning');
          });
        }
      },
      error => {
        this.messageService.notice(error);
      });
  }

  onChangeRomVersion(modal){
    if (this.changeRomVersionForm.invalid) {
      return;
    }
    const param = {romVersion: this.changeRomVersionForm.value.romVersion};
    this.api.put('api/game/ongeki/profile/romversion', param).subscribe(
      resp => {
        if (resp?.lastRomVersion === param.romVersion) {
          this.changeRomVersionForm.reset();
          this.profile = resp;
          modal.dismiss();
        }
        else{
          this.translate.get('Ongeki.SettingsPage.ModifyRomVersionFailed').subscribe((res: string) => {
            this.messageService.notice(res, 'warning');
          });
        }
      },
      error => {
        this.messageService.notice(error);
      });
  }

  onChangeDataVersion(modal){
    if (this.changeDataVersionForm.invalid) {
      return;
    }
    const param = {dataVersion: this.changeDataVersionForm.value.dataVersion};
    this.api.put('api/game/ongeki/profile/dataversion', param).subscribe(
      resp => {
        if (resp?.lastDataVersion === param.dataVersion) {
          this.changeDataVersionForm.reset();
          this.profile = resp;
          modal.dismiss();
        }
        else{
          this.translate.get('Ongeki.SettingsPage.ModifyDataVersionFailed').subscribe((res: string) => {
            this.messageService.notice(res, 'warning');
          });
        }
      },
      error => {
        this.messageService.notice(error);
      });
  }

  toFullWidth(input: string): string {
    return input.replace(/[\u0020-\u007E]/g, (char) => {
      return String.fromCharCode(char.charCodeAt(0) + 0xFEE0);
    });
  }
}
