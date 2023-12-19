import {Component, OnDestroy, OnInit,  ElementRef, QueryList, ViewChildren, Renderer2} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageService} from '../message.service';
import {AuthenticationService} from '../auth/authentication.service';
import {environment} from '../../environments/environment';

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
  constructor(private modalService: NgbModal,
              public messageService: MessageService,
              public authenticationService: AuthenticationService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
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
  }


  faultStop(e: MouseEvent): void {
    clearInterval(this.faultTimer);
    this.faultLogos.forEach((img) => {
      this.renderer.removeClass(img.nativeElement, 'logo-img_fault');
      this.renderer.setStyle(img.nativeElement, 'transform', '');
      this.renderer.setStyle(img.nativeElement, 'clipPath', '');
    });
  }
}
