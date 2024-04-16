import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {MessageService} from '../message.service';
import {AuthenticationService} from '../auth/authentication.service';
import {StatusCode} from '../status-code';

@Component({
  selector: 'app-oauth-callback',
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.css']
})
export class OauthCallbackComponent {
  constructor(private route: ActivatedRoute,
              private messageService: MessageService,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  protected type: string;

  ngOnInit(): void {
    // 从URL中获取type、code和state参数
    this.type = this.route.snapshot.paramMap.get('type');
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');

    // 调用登录API
    if (code && this.type && state) {
      this.login(code, this.type, state);
    }
  }

  private login(code: string, type: string, state: string): void {
    const storedState = localStorage.getItem('oauth_state');

    // verify state
    if (state && state === storedState){
      this.authenticationService.loginWithOAuth(code, type)
        .subscribe(
          {
            next: (resp) => {
              if (resp?.status) {
                const statusCode: StatusCode = resp.status.code;
                if (statusCode === StatusCode.OK && resp.data) {
                  localStorage.removeItem('oauth_state');
                  this.messageService.notice(resp.status.message);
                  this.router.navigate(['/']);
                } else if (statusCode === StatusCode.OAUTH_USER_NOT_REGISTERED) {
                  this.messageService.notice(resp.status.message);
                  const token = resp.data.token;
                  const name = resp.data.name;
                  const username = resp.data.userName;
                  const email = resp.data.email;
                  this.router.navigate(['/sign-up'], {queryParams:{token, type, name, username, email}});
                } else {
                  localStorage.removeItem('oauth_state');
                  this.messageService.notice(resp.status.message);
                  this.router.navigate(['/']).then(r => true);
                }
              }
            },
            error: (errorBackend) => {
              localStorage.removeItem('oauth_state');
              this.messageService.notice(errorBackend);
              this.router.navigate(['/']).then(r => true);
            }
          });
    } else {
      this.messageService.notice('Invalid state parameter');
    }
  }
}
