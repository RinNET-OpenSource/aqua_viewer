import {Component, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {MessageService} from '../../message.service';

@Component({
  selector: 'app-oauth-button',
  templateUrl: './oauth-button.component.html',
  styleUrls: ['./oauth-button.component.css']
})
export class OauthButtonComponent {
  @Input() type: string;
  @Input() content: string; // 可以是图标的class或者按钮上显示的文字
  @Input() classes: string;

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) {}

  getSignInUrl() {
    const state = this.generateRandomString();
    localStorage.setItem('oauth_state', state);

    this.http.get(environment.apiServer + `api/auth/signin/oauth2/${this.type}`).subscribe({
      next: (response: any) => {
        // 假设response中有一个url字段，表示要跳转的目标
        window.location.href = `${response.data}&state=${state}`;
      },
      error: (error) => {
        console.error('OAuth Sign In Error:', error);
        this.messageService.notice('OAuth2 Sign In Error');
        this.router.navigate(['/']);
      }
    });
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
