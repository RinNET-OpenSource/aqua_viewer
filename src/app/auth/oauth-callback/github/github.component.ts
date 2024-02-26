import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from '../../../message.service';
import {AuthenticationService} from '../../authentication.service';
import {StatusCode} from '../../../status-code';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SignUpComponent} from '../../../home/sign-up/sign-up.component';
import {LoginComponent} from '../../../home/login/login.component';
import {GithubOauth2Service} from '../../oauth/github-oauth2.service';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit{
  popupStatus = 0;

  constructor(private route: ActivatedRoute,
              private messageService: MessageService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private githubOAuth2Service: GithubOauth2Service) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params.code;
      const state = params.state;
      const error = params.error;
      const storedState = localStorage.getItem('oauth_state');

      // remove stored oauth state
      localStorage.removeItem('oauth_state');

      // verify state
      if (state && state === storedState){
        if (error){
          this.messageService.notice(error);
          this.router.navigate(['/']);
        } else {
          this.authenticationService.loginWithOAuth(code, 'github')
            .subscribe(
              {
                next: (resp) => {
                  if (resp?.status) {
                    const statusCode: StatusCode = resp.status.code;
                    if (statusCode === StatusCode.OK && resp.data) {
                      this.messageService.notice(resp.status.message);
                      this.router.navigate(['/']);
                    } else if (statusCode === StatusCode.OAUTH_USER_NOT_REGISTERED) {
                      // Need More Process To Register A User
                      this.popupStatus = 1;
                      localStorage.setItem('email', resp.data);
                      this.messageService.notice(resp.status.message);
                    } else {
                      this.messageService.notice(resp.status.message);
                      this.router.navigate(['/']);
                    }
                  }
                },
                error: (errorBackend) => {
                  this.messageService.notice(errorBackend);
                  this.router.navigate(['/']);
                }
              });
        }
      } else {
        this.messageService.notice('Invalid state parameter');
      }
    });
  }

  handleRegisterationComplete() {
    this.githubOAuth2Service.loginWithGitHub();
  }
}
