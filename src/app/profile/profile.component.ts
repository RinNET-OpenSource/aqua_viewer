import {MessageService} from 'src/app/message.service';
import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {OAuthService} from '../auth/oauth.service';
import {ApiService} from '../api.service';
import {StatusCode} from '../status-code';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  providers: string[];
  linkModal: bootstrap.Modal;

  token: string;
  type: string;
  email: string;

  constructor(
    protected oAuthService: OAuthService,
    protected userService: UserService,
    private api: ApiService,
    private router: Router,
    private messageService: MessageService,
    protected modalService: NgbModal
  ) {
    this.providers = [...this.oAuthService.tokenTypes.keys()];
    const state = this.router.getCurrentNavigation().extras.state;
    if (state) {
      if(this.oAuthService.tokenTypes.has(state.type) && state.token.length === 32){
        this.token = state.token;
        this.type = state.type;
        this.email = state.email;
      }
      history.replaceState({}, document.title);
    }
  }

  ngOnInit(): void {
    this.userService.load();
    if(this.token && this.type && this.email){
      this.showLinkModal();
    }
  }

  showLinkModal(){
    if (!this.linkModal){
      const modalElement = document.getElementById('link-modal');
      this.linkModal = new bootstrap.Modal(modalElement);
    }
    this.linkModal.show();
  }

  hideLinkModal(){
    if (!this.linkModal){
      const modalElement = document.getElementById('link-modal');
      this.linkModal = new bootstrap.Modal(modalElement);
    }
    this.linkModal.hide();
  }

  link(){
    const params = {
      token: this.token
    }
    this.api.post(`api/user/oauth2`, params).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK) {
            this.userService.load();
          }
          else {
            this.messageService.notice(resp.status.message);
          }
        }
        else{
          this.messageService.notice('Link failed.');
        }
      },
      error => {
        this.messageService.notice(error);
      },
      ()=>{
        this.hideLinkModal();
      });
  }

  findOAuth(provider: string){
    return this.userService.currentUser.oauth2s.find(oauth =>{
      return oauth.provider === provider;
    })
  }

  onUnlink(id){
    this.api.delete(`api/user/oauth2/${id}`).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK) {
            this.userService.load();
          }
          else {
            this.messageService.notice(resp.status.message);
          }
        }
        else{
          this.messageService.notice('Unlink failed.');
        }
      },
      error => {
        this.messageService.notice(error);
      });
  }
}
