import {Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageService} from '../message.service';
import {AuthenticationService} from '../auth/authentication.service';
import {environment} from '../../environments/environment';
import {StatusCode} from '../status-code';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChildren('faultLogo') faultLogos: QueryList<ElementRef>;
  faultTimer = null;
  host = environment.assetsHost;
  popupStatus = 0;
  logoIsShow = true;
  ongekiAvatarIconHeadArr: string[] = ['06202101', '06202201', '06202301', '06202401', '06202501', '06202601', '06202701', '06202801', '06202901', '06203001', '06203101', '06203201'];
  ongekiAvatarHeadId: any;
  ongekiAvatarHeadData = [
    { // Akari
      id: '06202101',
      color: ['#f2bfc6', '#ea81b6', '#bf0477'],
    },
    { // Yuzu
      id: '06202201',
      color: ['#e8daa9', '#efc75b', '#f48a00'],
    },
    { // Aoi
      id: '06202301',
      color: ['#7d7d92', '#2e2f31', '#86a1d7'],
    },
    { // Koboshi
      id: '06202901',
      color: ['#fdfce8', '#66bb66', '#a0d086'],
    },
    { // Saki
      id: '06203001',
      color: ['#fdebdf', '#ced1d9', '#c4e9f4']
    },
    { // Riku
      id: '06202501',
      color: ['#fe99e1', '#434343', '#7dc8d6'],
    },
    { // Tsubaki
      id: '06202601',
      color: ['#90b9b1', '#373737', '#b85366']
    },
    { // Rio
      id: '06202401',
      color: ['#9d99bc', '#1d1f1e', '#4c4d4f']
    },
    { // Ayaka
      id: '06202801',
      color: ['#f7c274', '#9161aa', '#554f5b']
    },
    { // Haruna
      id: '06202701',
      color: ['#fcecd3', '#ffffff', '#fad0d1']
    },
    { // Kaede
      id: '06203101',
      color: ['#7d7e81', '#4b4b6f', '#ffffff']
    },
    { // Akane
      id: '06203201',
      color: ['#cf4d67', '#535154', '#eecb78']
    },
    { // Arisu
      id: '06203301',
      color: ['#fdeada', '#aedef8', '#587ebc']
    },
    { // Mia
      id: '06203401',
      color: ['#e9c98b', '#ffffff', '#f5afca']
    },
    { // Chinatsu
      id: '06203501',
      color: ['#ed817b', '#e05663', '#f4e683']
    },
    { // Tsumugi
      id: '06203601',
      color: ['#f0948f', '#444547', '#4e96a4']
    },
    { // Setsuna
      id: '06203701',
      color: ['#bea9f2', '#444444', '#f8f8f8']
    },
  ];

  constructor(private modalService: NgbModal,
              public messageService: MessageService,
              public authenticationService: AuthenticationService,
              private renderer: Renderer2,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.ongekiAvatarHeadId = this.ongekiAvatarHeadData[Math.floor(Math.random() * this.ongekiAvatarHeadData.length)];
    // this.ongekiAvatarHeadId = this.ongekiAvatarHeadData[6];
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  showPopup(content) {
    this.modalService.open(content, { centered: true, size: 'md'});
  }

  forgotPassword() {
    this.popupStatus = 2;
  }

  fault(e: MouseEvent): void {
    clearInterval(this.faultTimer);
    if (this.logoIsShow) {
      this.faultTimer = setInterval(() => {
        this.faultLogos.forEach((img) => {
          this.renderer.setStyle(img.nativeElement, 'transform', `translate(${Math.random() * 60 - 30}%, ${Math.random() * 60 - 30}%)`);
          this.renderer.addClass(img.nativeElement, 'logo-img_fault');
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const h = Math.random() * 50 + 50;
          const w = Math.random() * 40 + 10;
          this.renderer.setStyle(img.nativeElement, 'clipPath', `
        polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`);
        });
      }, 30);
      setTimeout(() => this.faultStop(), 3000);
    }
  }

  handleRegistrationComplete(loginInfo: {email: string, password: string}) {
    this.authenticationService.login(loginInfo.email, loginInfo.password)
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
                this.translate.get('HomePage.SignInModal.LoginFailedMessage').subscribe((res: string) => {
                  this.messageService.notice(res, 'danger');
                });
              }
              else{
                this.messageService.notice(resp.status.message);
              }
            }
          }
        }
      );
  }

  faultStop(): void {
    clearInterval(this.faultTimer);
    this.faultLogos.forEach((img) => {
      this.renderer.removeClass(img.nativeElement, 'logo-img_fault');
      this.renderer.setStyle(img.nativeElement, 'transform', '');
      this.renderer.setStyle(img.nativeElement, 'clipPath', '');
    });
    this.logoIsShow = false;
  }
}
