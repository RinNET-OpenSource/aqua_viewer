import {TranslateService} from '@ngx-translate/core';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {first, take} from 'rxjs/operators';
import {MessageService} from '../message.service';
import {AuthenticationService} from '../auth/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {interval, Subscription, timer} from 'rxjs';
import {StatusCode} from '../status-code';
import {OAuthService} from '../auth/oauth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  getVerifyCodeForm: FormGroup;
  isButtonDisabled = false;
  remainingTime = 0;
  private timerSubscription!: Subscription;
  token: string;
  type: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    public router: Router,
    private translate: TranslateService,
    protected oauth: OAuthService) {

  }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      if(this.oauth.tokenTypes.has(params.type) && params['token'].length ==32){
        this.token = params['token'];
        this.type = params["type"];
      }
      this.name.setValue(params['name']);
      this.username.setValue(params["username"]);
      this.email.setValue(params["email"]);
    });
  }

  private initForm(): void {
    this.signUpForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)]],
      username: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_]+$'),
        Validators.minLength(3),
        Validators.maxLength(15)]],
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
        Validators.maxLength(100)]],
      confirmPassword: ['']
    }, {validators: this.checkPasswords});
    this.getVerifyCodeForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(40)]]
    });
    if (localStorage.getItem('email')){
      const email = localStorage.getItem('email');
      localStorage.removeItem('email');
      this.signUpForm.controls.email.setValue(email);
      this.getVerifyCodeForm.controls.email.setValue(email);
      this.signUpForm.controls.email.disable();
      this.getVerifyCodeForm.controls.email.disable();
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get username() {
    return this.signUpForm.get('username');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get verifyCode() {
    return this.signUpForm.get('verifyCode');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  navigateToSignIn(){
    var queryParams:any = {};
    if(this.email.valid){
      queryParams.email = this.email.value;
    }
    else if(this.username.valid){
      queryParams.username = this.username.value;
    }
    if(this.token && this.type){
      queryParams.token = this.token;
      queryParams.type = this.type;
    }
    this.router.navigate(['/sign-in'], {queryParams});
  }

  checkPasswords: ValidatorFn = (g: FormGroup) => {
    const password = g.get('password').value;
    const confirmPass = g.get('confirmPassword').value;
    return password === confirmPass ? null : {notSame: true};
  }

  getVerifyCode() {
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.getVerifyCodeForm.disable();
    const value = this.email.value;

    this.authenticationService.getVerifyCode(value).pipe(first())
      .subscribe(
        {
          next: (resp) => {
            if (resp?.status) {
              const statusCode: StatusCode = resp.status.code;
              if (statusCode === StatusCode.OK){
                this.translate.get("SignUpPage.Messages.SendCodeSuccess").subscribe((res: string) => {
                  this.messageService.notice(res, 'success');
                });
                this.disableButtonForInterval(60);
              }
              else if(statusCode === StatusCode.EMAIL_ALREADY_IN_USE){
                this.translate.get("SignUpPage.Messages.EmailInvailable").subscribe((res: string) => {
                  this.messageService.notice(res, 'danger');
                });
              }
              else if(statusCode === StatusCode.VERIFY_CODE_SEND_TOO_FAST){
                this.translate.get("SignUpPage.Messages.SendCodeTooFast").subscribe((res: string) => {
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
            console.warn('Send verify code fail.', error);
          }
        }
      );
  }

  checkEmail() {
    const email = this.email.value;
    if (email) {
      this.authenticationService.checkEmailAvailability(email).subscribe(
        resp => {
          if (resp?.status) {
            const statusCode: StatusCode = resp.status.code;
            if (statusCode === StatusCode.OK){
              this.translate.get("SignUpPage.Messages.EmailAvailable").subscribe((res: string) => {
                this.messageService.notice(res, 'success');
              });
            }
            else if(statusCode === StatusCode.EMAIL_ALREADY_IN_USE){
              this.translate.get("SignUpPage.Messages.EmailInvailable").subscribe((res: string) => {
                this.messageService.notice(res, 'danger');
              });
            }
            else{
              this.messageService.notice(resp.status.message);
            }
          }
        },
        error => {
          this.messageService.notice('Error checking email availability.');
          console.error('Error checking email', error);
        }
      );
    }
  }

  checkUsername() {
    const username = this.username.value;
    if (username) {
      this.authenticationService.checkUsernameAvailability(username).subscribe(
        resp => {
          if (resp?.status) {
            const statusCode: StatusCode = resp.status.code;
            if (statusCode === StatusCode.OK){
              this.translate.get("SignUpPage.Messages.UsernameAvailable").subscribe((res: string) => {
                this.messageService.notice(res, 'success');
              });
            }
            else if(statusCode === StatusCode.USERNAME_ALREADY_TAKEN){
              this.translate.get("SignUpPage.Messages.UsernameAlreadyTaken").subscribe((res: string) => {
                this.messageService.notice(res, 'danger');
              });
            }
            else{
              this.messageService.notice(resp.status.message);
            }
          }
        },
        error => {
          this.messageService.notice('Error checking username availability.');
          console.error('Error checking username', error);
        }
      );
    }
  }

  private disableButtonForInterval(seconds: number) {
    this.isButtonDisabled = true;
    this.remainingTime = seconds;

    const t = interval(1000).pipe(take(seconds));
    this.timerSubscription = t.subscribe(
      () => this.remainingTime--,
      error => console.error(error),
      () => this.isButtonDisabled = false
    );
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.signUpForm.disable();
    const value = this.signUpForm.value;

    this.authenticationService.signUp(value.name, value.username, value.email, value.verifyCode, value.password, this.token).pipe(first())
      .subscribe(
        {
          next: (resp) => {
            if (resp?.status) {
              const statusCode: StatusCode = resp.status.code;
              if (statusCode === StatusCode.OK){
                this.messageService.notice('Sign up success.');
                location.reload();
              }
              else if(statusCode === StatusCode.EMAIL_ALREADY_IN_USE){
                this.translate.get("SignUpPage.Messages.EmailInvailable").subscribe((res: string) => {
                  this.messageService.notice(res, 'danger');
                });
                this.signUpForm.enable();
              }
              else if(statusCode === StatusCode.USERNAME_ALREADY_TAKEN){
                this.translate.get("SignUpPage.Messages.UsernameAlreadyTaken").subscribe((res: string) => {
                  this.messageService.notice(res, 'danger');
                });
                this.signUpForm.enable();
              }
              else if(statusCode === StatusCode.VERIFY_CODE_NOT_CORRECT){
                this.translate.get("SignUpPage.Messages.CodeIncorrect").subscribe((res: string) => {
                  this.messageService.notice(res, 'danger');
                });
                this.signUpForm.enable();
              }
              else{
                this.messageService.notice(resp.status.message);
                this.signUpForm.enable();
              }
            }
          },
          error: (error) => {
            if (error) {
              this.messageService.notice(error);
            }
            this.signUpForm.enable();
            console.warn('Sign up failed.', error);
          }
        }
      );
  }
}
