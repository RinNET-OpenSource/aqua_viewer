import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '../message.service';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService) { }

  getSignInUrl(type: string) {
    const state = this.generateRandomString();
    localStorage.setItem('oauth_state', state);

    this.http.get(environment.apiServer + `api/auth/signin/oauth2/${type}`).subscribe({
      next: (response: any) => {
        if(response?.data){
          window.location.href = `${response.data}&state=${state}`;
        }
        else{
          console.error('Failed to get OAuth2 response data');
          this.messageService.notice('Failed to get OAuth2 response data');
          this.router.navigate(['/sign-in']);
        }
      },
      error: (error) => {
        console.error('OAuth Sign In Error:', error);
        this.messageService.notice('OAuth2 Sign In Error');
        this.router.navigate(['/sign-in']);
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
