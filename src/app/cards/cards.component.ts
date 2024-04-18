import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
import {MessageService} from '../message.service';
import {AuthenticationService} from '../auth/authentication.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Time} from '@angular/common';
import {StatusCode} from '../status-code';
import { UserService } from '../user.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  bindCardForm: FormGroup;
  addAccessCodeForm: FormGroup;
  changeAccessCodeForm: FormGroup;
  luids = new Map();
  loaded = false;

  constructor(
    private fb: FormBuilder,
    protected userService: UserService,
    private messageService: MessageService,
    private api: ApiService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.bindCardForm = this.fb.group({
      accessCode: ['', Validators.required]
    });

    this.addAccessCodeForm = this.fb.group({
      accessCode: ['', Validators.required]
    });

    this.changeAccessCodeForm = this.fb.group({
      accessCode: ['', Validators.required]
    });
    this.loadCards();
  }

  loadCards() {
    this.userService.load().then(resp => {
      const user = this.userService.currentUser;
      user.cards.forEach(card => {
        this.luids.set(card.luid, new Luid(card.luid));
        card.cardExternalList.forEach(cardExt => {
          this.luids.set(cardExt.luid, new Luid(cardExt.luid));
        });
      });
      this.loaded = true;
    })
  }

  toggleLuidVisibility(luid: Luid) {
    luid.hidden = !luid.hidden;
  }

  compareCard(a: Card, b: Card) {
    return a.id - b.id;
  }

  setDefault(card: Card) {
    const extId = card.extId;
    const body = {extId};
    this.api.post('api/user/setDefaultCard', body).subscribe(resp => {
      if (resp?.status) {
        const statusCode: StatusCode = resp.status.code;
        if (statusCode === StatusCode.OK) {
          this.loadCards();
        }
        else {
          this.messageService.notice(resp.status.message);
        }
      }
      else{
        this.messageService.notice('Set default card failed.');
      }
    },
    error => {
      this.messageService.notice(error);
    });
  }

  onRemoveExternal(external: CardExternal, modal) {
    const accessCode = external.luid;
    const body = {accessCode};
    this.api.delete('api/user/removeCardExternal', null, body).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK) {
            this.loadCards();
          }
          else {
            this.messageService.notice(resp.status.message);
          }
        }
        else{
          this.messageService.notice('Remove alias failed.');
        }
      },
      error => {
        this.messageService.notice(error);
      });
    modal.dismiss();
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
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK) {
            this.bindCardForm.reset();
            this.loadCards();
          }
          else {
            this.messageService.notice(resp.status.message);
          }
        }
        else{
          this.messageService.notice('Bind card failed.');
        }
      },
      error => {
        this.messageService.notice(error);
      });
    modal.dismiss();
  }

  onAddAccessCode(extId: number, modal) {
    if (this.addAccessCodeForm.invalid) {
      return;
    }
    const accessCode = this.addAccessCodeForm.value.accessCode;
    const params = {accessCode, extId};
    this.api.post('api/user/addAccessCode/', params).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK) {
            this.addAccessCodeForm.reset();
            this.loadCards();
          }
          else {
            this.messageService.notice(resp.status.message);
          }
        }
        else{
          this.messageService.notice('Add alias failed.');
        }
      },
      error => {
        this.messageService.notice(error);
      });
    modal.dismiss();
  }

  onChangeAccesscode(extId: number, modal) {
    if (this.changeAccessCodeForm.invalid) {
      return;
    }
    const accessCode = this.changeAccessCodeForm.value.accessCode;
    const params = {accessCode, extId};
    this.api.post('api/user/changeProfileAccessCode/', params).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK) {
            this.changeAccessCodeForm.reset();
            this.loadCards();
          }
          else {
            this.messageService.notice(resp.status.message);
          }
        }
        else{
          this.messageService.notice('Change access code failed.');
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
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK) {
            this.loadCards();
          }
          else {
            this.messageService.notice(resp.status.message);
          }
        }
        else{
          this.messageService.notice('Unbind card failed.');
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
  luid: Luid;
  registerTime: Time;
  accessTime: Time;
  cardExternalList: CardExternal[];
  default: boolean;
}

export interface CardExternal {
  id: number;
  luid: Luid;
}

export class Luid {
  public full: string;
  public hidden: boolean;

  get displayValue() {
    if (this.hidden) {
      return this.full.substring(0, 4) + '************' + this.full.substring(16);
    } else {
      return this.full;
    }
  }

  constructor(value: string) {
    this.full = value;
    this.hidden = true;
  }
}
