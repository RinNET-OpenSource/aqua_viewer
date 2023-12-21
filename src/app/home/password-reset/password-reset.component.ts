import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, take} from 'rxjs/operators';
import {AuthenticationService} from '../../auth/authentication.service';
import {MessageService} from '../../message.service';
import {interval, Subscription} from 'rxjs';

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
    private messageService: MessageService) {
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
          next: (data) => {
            if (data && data.message) {
              this.messageService.notice(data.message);
            }
            if (data?.success) {
              this.disableButtonForInterval(60);
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
    this.resetPasswordForm.disable();
    const value = this.resetPasswordForm.value;

    this.authenticationService.resetPassword(value.email, value.verifyCode, value.password).pipe(first())
      .subscribe(
        {
          next: (data) => {
            if (data && data.message) {
              this.messageService.notice(data.message);
            }
            if (data && data.success) {
              window.location.reload();
              // login
            }
          }
          ,
          error: (error) => {
            if (error) {
              this.messageService.notice(error);
            }
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
