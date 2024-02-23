import {Router} from '@angular/router';
import {AuthenticationService} from '../../auth/authentication.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '../../message.service';
import {StatusCode} from '../../status-code';
import { TranslateService } from '@ngx-translate/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
  @Output() onForgotPassword = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public messageService: MessageService,
    private translate: TranslateService
  ) {
  }

  get usernameOrEmail() {
    return this.signInForm.get('usernameOrEmail');
  }

  get password() {
    return this.signInForm.get('password');
  }

  ngOnInit() {
    this.signInForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.authenticationService.currentAccountValue) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }
    this.signInForm.disable();
    const value = this.signInForm.value;

    this.authenticationService.login(value.usernameOrEmail, value.password)
      .subscribe(
        {
          next: (resp) => {
            if (resp?.status) {
              const statusCode: StatusCode = resp.status.code;
              if (statusCode === StatusCode.OK && resp.data) {
                this.messageService.notice(resp.status.message);
                location.reload();
              }
              else if (statusCode === StatusCode.LOGIN_FAILED){
                this.translate.get("HomePage.SignInModal.LoginFailedMessage").subscribe((res: string) => {
                  this.messageService.notice(res, 'danger');
                });
              }
              else{
                this.messageService.notice(resp.status.message);
              }
            }
            this.signInForm.enable();
          },
          error: (error) => {
            this.messageService.notice(error);
            this.signInForm.enable();
            console.warn('login fail', error);
          }
        }
      );
  }

  loginWithGitHub() {
    const state = this.generateRandomString();
    localStorage.setItem('oauth_state', state);
    const clientId = environment.oauth.github.client_id;
    const scope = environment.oauth.github.scoop;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&state=${state}`;
  }

  generateRandomString(length: number = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
