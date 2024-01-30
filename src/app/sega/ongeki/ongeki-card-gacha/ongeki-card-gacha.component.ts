import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {OngekiCard} from '../model/OngekiCard';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {animate, style, transition, trigger} from '@angular/animations';
import {Bitmap, Shadow, Shape, Stage, Ticker} from '@createjs/easeljs';
import {Ease, Timeline, Tween} from '@createjs/tweenjs';

@Component({
  selector: 'app-ongeki-card-gacha',
  templateUrl: './ongeki-card-gacha.component.html',
  styleUrls: ['./ongeki-card-gacha.component.css']
})
export class OngekiCardGachaComponent implements OnInit, AfterViewInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  isStarted = false;

  rarity: number[] = [];
  rList: OngekiCard[] = [];
  srList: OngekiCard[] = [];
  ssrList: OngekiCard[] = [];

  cardResultList: CardResult[] = [];
  currentShowedIndex = 0;
  showCurrentCard = false;

  submitSuccessful = 0;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    this.rarity = Array(70).fill(1);
    this.rarity = this.rarity.concat(Array(25).fill(2));
    this.rarity = this.rarity.concat(Array(5).fill(3));
    this.dbService.getAll<OngekiCard>('ongekiCard').subscribe(
      x => {
        x.forEach(y => {
          switch (y.rarity) {
            case 'R':
              this.rList.push(y);
              break;
            case 'SR':
              this.srList.push(y);
              break;
            case 'SSR':
              this.ssrList.push(y);
              break;
          }
        });
      }
    );
  }

  ngAfterViewInit() {
    // this.initAnimation();
  }

  gacha(count: number) {
    this.cardResultList = [];
    this.currentShowedIndex = 0;
    this.isStarted = true;
    this.submitSuccessful = 0;

    for (let i = 0; i < count; i++) {
      const rarity = this.rarity[Math.floor(Math.random() * 99)];
      //console.log('rarity: ' + rarity);
      let card;
      switch (rarity) {
        case 1:
          card = this.rList[Math.floor(Math.random() * this.rList.length)];
          break;
        case 2:
          card = this.srList[Math.floor(Math.random() * this.srList.length)];
          break;
        case 3:
          card = this.ssrList[Math.floor(Math.random() * this.ssrList.length)];
          break;
      }
      //console.log('card: ' + JSON.stringify(card));
      this.cardResultList.push({
        show: false,
        card
      });
    }
    this.submitCardData();
    return;
  }

  submitCardData() {
    const aimeId = this.auth.currentAccountValue.currentCard.extId;
    this.cardResultList.forEach(x => {
      this.api.post('api/game/ongeki/card', {
        aimeId,
        cardId: x.card.id
      }).subscribe(
        data => {
          this.submitSuccessful = this.submitSuccessful + 1;
          return;
        },
        error => this.messageService.notice(error)
      );
    });
  }

  goBack() {
    this.isStarted = false;
  }

  formatNumber(value: number, length?: number): string {
    let str = value.toString();
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

}

interface CardResult {
  show: boolean;
  card: OngekiCard;
}
