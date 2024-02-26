import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubOauth2Service {

  constructor() { }

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
