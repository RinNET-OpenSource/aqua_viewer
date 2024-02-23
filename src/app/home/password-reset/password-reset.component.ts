import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, take} from 'rxjs/operators';
import {AuthenticationService} from '../../auth/authentication.service';
import {MessageService} from '../../message.service';
import {interval, Subscription} from 'rxjs';
import {StatusCode} from 'src/app/status-code';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnDestroy {

  resetPasswordForm: FormGroup;
  getVerifyCodeForm: FormGroup;
  isButtonDisabled = false;
  remainingTime = 0;
  private timerSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(40)]],
      verifyCode: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)]]
    });
    this.getVerifyCodeForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(40)]]
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  get email() {
    return this.resetPasswordForm.get('email');
  }

  get verifyCode() {
    return this.resetPasswordForm.get('verifyCode');
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  getVerifyCode() {
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.getVerifyCodeForm.disable();
    const value = this.email.value;

    this.authenticationService.getResetPasswordCode(value).pipe(first())
      .subscribe(
        {
          next: (resp) => {
            if (resp?.status) {
              const statusCode: StatusCode = resp.status.code;
              if (statusCode === StatusCode.OK){
                this.translate.get("HomePage.ResetPasswordModal.Messages.SendCodeSuccess").subscribe((res: string) => {
                  this.messageService.notice(res, 'success');
                });
                this.disableButtonForInterval(60);
              }
              else if(statusCode === StatusCode.VERIFY_CODE_SEND_TOO_FAST){
                this.translate.get("HomePage.ResetPasswordModal.Messages.SendCodeTooFast").subscribe((res: string) => {
                  this.messageService.notice(res, 'warning');
                });
              }
              else{
                this.messageService.notice(resp.status.message);
              }
            }
          }
          ,
          error: (error) => {
            if (error) {
              this.messageService.notice(error);
            }
            this.getVerifyCodeForm.enable();
            console.warn('get reset password code fail', error);
          }
        }
      );
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    this.getVerifyCodeForm.disable();
    this.resetPasswordForm.disable();
    const value = this.resetPasswordForm.value;

    this.authenticationService.resetPassword(value.email, value.verifyCode, value.password).pipe(first())
      .subscribe(
        {
          next: (resp) => {
            if (resp?.status) {
              const statusCode: StatusCode = resp.status.code;
              if (statusCode === StatusCode.OK){
                window.location.reload();
              }
              else if(statusCode === StatusCode.VERIFY_CODE_NOT_CORRECT){
                this.translate.get("HomePage.ResetPasswordModal.Messages.CodeIncorrect").subscribe((res: string) => {
                  this.messageService.notice(res, 'danger');
                });
              }
              else{
                this.messageService.notice(resp.status.message);
              }
              this.resetPasswordForm.enable();
            }
          }
          ,
          error: (error) => {
            if (error) {
              this.messageService.notice(error);
            }
            this.getVerifyCodeForm.enable();
            this.resetPasswordForm.enable();
            console.warn('reset password fail', error);
          }
        }
      );
  }

  private disableButtonForInterval(seconds: number) {
    this.isButtonDisabled = true;
    this.remainingTime = seconds;

    const t = interval(1000).pipe(take(seconds));
    this.timerSubscription = t.subscribe(
      () => this.remainingTime--,
      e => console.error(e),
      () => this.isButtonDisabled = false
    );
  }

}
