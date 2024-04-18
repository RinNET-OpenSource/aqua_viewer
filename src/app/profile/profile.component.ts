import {Component, OnInit} from '@angular/core';
import {UserService, OAuth2} from '../user.service';
import {OAuthService} from '../auth/oauth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  constructor(
    protected oAuthService: OAuthService,
    protected userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.userService.load();
  }

  findMicrosoft(oauth: OAuth2){
    return oauth.provider === 'microsoft';
  }

  findGitHub(oauth: OAuth2){
    return oauth.provider === 'github';
  }

  findGitLab(oauth: OAuth2){
    return oauth.provider === 'gitlab';
  }
}
