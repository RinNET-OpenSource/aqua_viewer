import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../auth/authentication.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '../message.service';
import {StatusCode} from '../status-code';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../environments/environment';
import {OAuthService} from 'src/app/auth/oauth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  token: string;
  type: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public messageService: MessageService,
    private translate: TranslateService,
    protected oauth: OAuthService,
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
    this.route.queryParams.subscribe(params => {
      if(this.oauth.tokenTypes.has(params.type) && params['token'].length ==32){
        this.token = params['token'];
        this.type = params["type"];
      }
      if(params["email"]){
        this.usernameOrEmail.setValue(params["email"]);
      }
      else if(params["username"]){
        this.usernameOrEmail.setValue(params["username"]);
      }
    });
  }

  navigateToSignUp(){
    var queryParams:any = {};
    if(this.usernameOrEmail.value){
      if(!Validators.email(this.usernameOrEmail)){
        queryParams.email = this.usernameOrEmail.value;
      }
      else{
        queryParams.username = this.usernameOrEmail.value;
      }
    }
    if(this.token && this.type){
      queryParams.token = this.token;
      queryParams.type = this.type;
    }
    this.router.navigate(['/sign-up'], {queryParams});
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
