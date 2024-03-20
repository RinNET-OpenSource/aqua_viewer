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
      color: ['#fca2c8', '#ea81b6', '#bf0477'],
    },
    { // Yuzu
      id: '06202201',
      color: ['#ffef5d', '#efc75b', '#f48a00'],
    },
    { // Rio
      id: '06202301',
      color: ['#67667c', '#594f66', '#141219'],
    },
    { // Koboshi
      id: '06202901',
      color: ['#feefd5', '#94F453FF', '#669139'],
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
      color: ['#fee1d2', '#17836b', '#18526b']
    },
    { // Tsubaki
      id: '06202601',
      color: ['#50bfa3', '#3d4750', '#18526b']
    },
    // { // Ayaka
    //   id: '06202401',
    //   color: ['#d169ed']
    // }
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
