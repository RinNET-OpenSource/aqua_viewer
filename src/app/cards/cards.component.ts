import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
import {MessageService} from '../message.service';
import {AuthenticationService} from '../auth/authentication.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Time} from '@angular/common';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  bindCardForm: FormGroup;
  addAccessCodeForm: FormGroup;
  cards: Card[];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private api: ApiService,
    private modalService: NgbModal,
    public authenticationService: AuthenticationService) {
    this.cards = [];
  }

  ngOnInit() {
    this.bindCardForm = this.fb.group({
      accessCode: ['', Validators.required]
    });

    this.addAccessCodeForm = this.fb.group({
      accessCode: ['', Validators.required]
    });
    this.loadCards();
  }

  loadCards() {
    this.api.get('api/user/me').subscribe(
      data => {
        this.authenticationService.currentAccountValue.name = data.name;
        this.cards = data.cards;
        for (const card of this.cards) {
          if (card.default){
            this.authenticationService.currentAccountValue.currentCard = card.extId;
          }
        }
        this.authenticationService.currentAccountValue = this.authenticationService.currentAccountValue;
      },
      error => {
        this.messageService.notice(error);
      });
  }

  compareCard(a: Card, b: Card) {
    return a.id - b.id;
  }

  setDefault(card: Card) {
    const extId = card.extId;
    const body = {extId};
    this.api.post('api/sega/aime/setDefaultCard', body).subscribe(
      data => {
        if (data.success) {
          this.loadCards();
        }
        if (data.message) {
          this.messageService.notice(data.message);
        }
      },
      error => {
        this.messageService.notice(error);
      });
  }

  removeExternal(external: CardExternal) {
    const accessCode = external.luid;
    const body = {accessCode};
    this.api.delete('api/sega/aime/removeCardExternal', null, body).subscribe(
      data => {
        if (data.success) {
          this.loadCards();
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

  onBindCard(modal) {
    if (this.bindCardForm.invalid) {
      return;
    }
    const accessCode = this.bindCardForm.value.accessCode;
    const params = {accessCode};
    this.api.post('api/user/bindCard/', params).subscribe(
      data => {
        if (data.success) {
          this.loadCards();
        } else if (data.message) {
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
          this.loadCards();
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

  onUnbindCard(card: Card, modal) {
    const accessCode = card.luid;
    const params = {accessCode};
    this.api.post('api/user/unbindCard/', params).subscribe(
      data => {
        if (data.success) {
          this.loadCards();
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

export interface Card {
  id: number;
  extId: number;
  luid: string;
  registerTime: Time;
  accessTime: Time;
  cardExternalList: CardExternal[];
  default: boolean;
}

export interface CardExternal {
  id: number;
  luid: string;
}
