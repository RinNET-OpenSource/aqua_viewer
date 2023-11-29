import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageService} from '../message.service';
import {AuthenticationService} from '../auth/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  popupStatus = 0;
  constructor(private modalService: NgbModal,
              public messageService: MessageService,
              public authenticationService: AuthenticationService) {
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
}
