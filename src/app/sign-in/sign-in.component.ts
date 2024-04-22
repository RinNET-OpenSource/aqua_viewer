import {Router} from '@angular/router';
import {AuthenticationService} from '../auth/authentication.service';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '../message.service';
import {StatusCode} from '../status-code';
import {TranslateService} from '@ngx-translate/core';
import {OAuthService} from 'src/app/auth/oauth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  signInForm: FormGroup;
  token: string;
  type: string;
  name: string;
  username: string;
  email: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public messageService: MessageService,
    private translate: TranslateService,
    protected oauth: OAuthService,
  ) {
    this.signInForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });

    const state = this.router.getCurrentNavigation().extras.state;
    if (state) {
      if(this.oauth.tokenTypes.has(state.type) && state.token.length ==32){
        this.token = state.token;
        this.type = state.type;
      }
      if(state.email){
        this.usernameOrEmail.setValue(state.email);
      }
      else if(state.username){
        this.usernameOrEmail.setValue(state.username);
      }
      this.email = state.email;
      this.username = state.username;
      this.name = state.name;
      history.replaceState({}, document.title);
    }
  }

  get usernameOrEmail() {
    return this.signInForm.get('usernameOrEmail');
  }

  get password() {
    return this.signInForm.get('password');
  }

  navigateToSignUp(){
    var state:any = {};
    if(this.usernameOrEmail.value){
      if(!Validators.email(this.usernameOrEmail)){
        state.email = this.usernameOrEmail.value;
        state.username = this.username;
      }
      else{
        state.username = this.usernameOrEmail.value;
        state.email = this.email;
      }
    }
    else{
      state.username = this.username;
      state.email = this.email;
    }
    if(this.token && this.type){
      state.token = this.token;
      state.type = this.type;
    }
    state.name = this.name;
    this.router.navigate(['/sign-up'], {state});
  }

  navigateToPasswordReset(){
    var state:any = {};
    if(this.usernameOrEmail.value && !Validators.email(this.usernameOrEmail)){
      state.email = this.usernameOrEmail.value;
    }
    if(this.token && this.type){
      state.token = this.token;
      state.type = this.type;
    }
    state.username = this.username;
    state.name = this.name;
    this.router.navigate(['/password-reset'], {state});
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }
    this.signInForm.disable();
    const value = this.signInForm.value;

    this.authenticationService.login(value.usernameOrEmail, value.password, this.token)
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
                this.translate.get("SignInPage.LoginFailedMessage").subscribe((res: string) => {
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

}
