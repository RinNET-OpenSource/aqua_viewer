import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
import {Card, CardExternal, User} from '../model/User';
import {MessageService} from '../message.service';
import {AuthenticationService} from '../auth/authentication.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  user: User;
  addCardForm: FormGroup;
  addAccessCodeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private api: ApiService,
    private modalService: NgbModal,
    protected authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.addCardForm = this.fb.group({
      accessCode: ['', Validators.required]
    });

    this.addAccessCodeForm = this.fb.group({
      accessCode: ['', Validators.required]
    });
    this.loadUser();
  }

  loadUser() {
    this.api.get('api/user/me').subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.messageService.notice(error);
      });
  }

  compareCard(a: Card, b: Card) {
    return a.id - b.id;
  }

  setDefault(card: Card) {
    const account = this.authenticationService.currentUserValue;
    account.currentCard = card.extId;
    this.authenticationService.currentUserValue = account;
  }

  removeExternal(external: CardExternal) {
    const accessCode = external.luid;
    const body = {accessCode};
    this.api.delete('api/sega/aime/removeCardExternal/', null, body).subscribe(
      data => {
        if (data.success) {
          this.loadUser();
        }
        if (data.message) {
          this.messageService.notice(data.message);
        }
      },
      error => {
        this.messageService.notice(error);
      });
  }

  open(content) {
    this.modalService.open(content, {centered: true});
  }

  onAddCard(modal) {
    if (this.addCardForm.invalid) {
      return;
    }
    const accessCode = this.addCardForm.value.accessCode;
    const params = {accessCode};
    this.api.post('api/user/bindCard/', params).subscribe(
      data => {
        if (data.success) {
          this.loadUser();
        }
        if (data.message) {
          this.messageService.notice(data.message);
        }
      },
      error => {
        this.messageService.notice(error);
      });
    modal.dismiss();
  }

  onAddAccessCode(card: Card, modal) {
    if (this.addAccessCodeForm.invalid) {
      return;
    }
    const accessCode = this.addAccessCodeForm.value.accessCode;
    const params = {accessCode, card};
    this.api.post('api/user/addAccessCode/', params).subscribe(
      data => {
        if (data.success) {
          this.loadUser();
        } else if (data.message) {
          this.messageService.notice(data.message);
        }
      },
      error => {
        this.messageService.notice(error);
      });
    modal.dismiss();
  }
}
