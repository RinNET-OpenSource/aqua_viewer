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
  styleUrls: ['./ongeki-card-gacha.component.css'],
  animations: [
    trigger('control', [
      transition(':enter', [
        style({opacity: 0}),
        animate('1s 0.5s ease-out',
          style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('1s ease-in',
          style({opacity: 0}))
      ])
    ])
  ]
})
export class OngekiCardGachaComponent implements OnInit, AfterViewInit {

  @ViewChild('card_animation', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('card_rarity_animation', {static: true})
  rarityCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('card_rarity_animation_container', {static: true})
  rarityCanvasContainer: ElementRef<HTMLDivElement>;


  host = environment.assetsHost;
  assets = environment.assetsHost + 'ongeki/gameUi/';

  isStarted = false;

  rarity: number[] = [];
  rList: OngekiCard[] = [];
  srList: OngekiCard[] = [];
  ssrList: OngekiCard[] = [];

  cardResultList: CardResult[] = [];
  currentShowedIndex = 0;
  showCurrentCard = false;

  submitSuccessful = 0;

  NEW_GET_BANNER: Bitmap;
  currentTimeLine: Timeline;

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
      console.log('rarity: ' + rarity);
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
      console.log('card: ' + JSON.stringify(card));
      this.cardResultList.push({
        show: false,
        card
      });
    }
    this.submitCardData();
    return;
  }

  open() {
    console.log('clicked');
    if (this.currentShowedIndex < this.cardResultList.length) {
      const card = this.cardResultList[this.currentShowedIndex];
      card.show = true;

      this.showCurrentCard = true;

      if (card.card.rarity === 'SR') {
        setTimeout(() => this.showRarityEffect('SR'), 500);
      } else if (card.card.rarity === 'SSR') {
        setTimeout(() => this.showRarityEffect('SSR'), 500);
      } else {
        this.resetRarityEffect();
      }

    } else {
      this.isStarted = false;
    }
  }

  // a global click handler to click on multiple overlay
  clickHandler() {
    if (!this.showCurrentCard) {
      this.open();
      return;
    }

    if (this.currentTimeLine) {
      if (this.currentTimeLine.position < this.currentTimeLine.skipTime) {
        this.currentTimeLine.gotoAndPlay('skip');
        this.currentTimeLine.isSkipable = false;
      }
    }
  }

  resetRarityEffect() {
    this.rarityCanvasContainer.nativeElement.style.opacity = '0';
    this.currentShowedIndex += 1;
    this.showCurrentCard = false;
  }

  showRarityEffect(type: string) {
    // Initialize full screen canvas

    this.rarityCanvasContainer.nativeElement.style.opacity = '1';
    const n = this.rarityCanvas.nativeElement;

    // Render at 2x resolution. as a workaround for canvas low quality image scaling.
    const WIDTH = this.rarityCanvasContainer.nativeElement.clientWidth * 2;
    const HEIGHT = this.rarityCanvasContainer.nativeElement.clientHeight * 2;
    n.width = WIDTH;
    n.height = HEIGHT;
    console.log(n);
    const STAGE = new Stage('card-rarity-animation');
    STAGE.alpha = 0;

    Ticker.on('tick', STAGE);
    Ticker.framerate = 60;

    // BG
    const BACKGROUND = new Shape();
    BACKGROUND.graphics.beginFill('black').drawRect(0, 0, STAGE.canvas.width, STAGE.canvas.height);
    STAGE.addChild(BACKGROUND);

    // Flash
    const FLASH = new Shape();
    FLASH.graphics.beginFill('white').drawRect(0, 0, STAGE.canvas.width, STAGE.canvas.height);

    const CARD_BITMAP = new Bitmap(this.host + 'ongeki/card/UI_Card_' +
      this.formatNumber(this.cardResultList[this.currentShowedIndex].card.id, 6) + '.png');

    // Set anchor point
    CARD_BITMAP.regX = 768 / 2;
    CARD_BITMAP.regY = 1052 / 2;

    const CARD_SMALL_BITMAP = CARD_BITMAP.clone();

    CARD_SMALL_BITMAP.regX = 768 / 2;
    CARD_SMALL_BITMAP.regY = 1052 / 2;

    const SHADOW = new Shadow('#FFFFFF', 0, 0, 15);
    if (type === 'SSR') {
      // Card image size is 768*1052

      // Resize it to 1.8x
      if (HEIGHT > WIDTH) {
        CARD_BITMAP.scale = HEIGHT / 1052 * 2;
      } else {
        CARD_BITMAP.scale = WIDTH / 768 * 2;
      }

      // Initial Position
      CARD_BITMAP.x = WIDTH * 0.8;
      CARD_BITMAP.y = HEIGHT * 0.2;

      CARD_BITMAP.alpha = CARD_SMALL_BITMAP.alpha = 0;

      // Set small card size
      let target = 0;
      if (HEIGHT > WIDTH) {
        CARD_SMALL_BITMAP.scale = WIDTH / 768 * 0.9;
        target = WIDTH / 768 * 0.8;
      } else {
        CARD_SMALL_BITMAP.scale = HEIGHT / 1052 * 0.9;
        target = HEIGHT / 1052 * 0.8;
      }

      CARD_SMALL_BITMAP.x = WIDTH * 0.5;
      CARD_SMALL_BITMAP.y = HEIGHT * 0.5;

      CARD_SMALL_BITMAP.shadow = SHADOW;

      STAGE.addChild(CARD_BITMAP, CARD_SMALL_BITMAP);

      const tweenCard = Tween.get(CARD_BITMAP, {loop: false})
        .wait(100)
        .to({
          alpha: 1
        }, 100)
        .to({
          x: WIDTH * 0.2
        }, 2000, Ease.getPowInOut(2))
        .wait(50)
        .to({
          x: WIDTH * 0.8,
          y: HEIGHT * 0.7
        }, 0) // Reset it to top
        .wait(50)
        .to({
          x: WIDTH * 0.2
        }, 2000, Ease.getPowInOut(2))
        .wait(50)
        .to({
          x: WIDTH * 0.5,
          y: HEIGHT * 0.5
        }, 0) // Reset it to center
        .wait(50)
        .to({
          scale: WIDTH / 768 * 1.3,
          alpha: 0.8
        }, 1700, Ease.getPowInOut(4))
        .wait(100);

      const tweenCardSmall = Tween.get(CARD_SMALL_BITMAP, {loop: false})
        .wait(5500)
        .to({
          alpha: 1,
          scale: target
        }, 500, Ease.getPowInOut(4));

      STAGE.addChild(FLASH);
      const tweenFlash = Tween.get(FLASH)
        .wait(200)
        .to({
          alpha: 0.2
        }, 100)
        .wait(1900)
        // Flash
        .to({alpha: 1}, 80, Ease.getPowOut(4))
        .wait(40)
        .to({alpha: 0.2}, 80, Ease.getPowIn(4))

        .wait(1900)
        // Flash
        .to({alpha: 1}, 80, Ease.getPowOut(4))
        .wait(40)
        .to({alpha: 0.2}, 80, Ease.getPowIn(4))

        .wait(1000)
        // Flash
        .to({alpha: 0.5}, 80, Ease.getPowOut(4))
        .wait(40)
        .to({alpha: 0.2}, 80, Ease.getPowIn(4))

        .wait(2000);
      const tweenStage = Tween.get(STAGE)
        .to({
          alpha: 1
        }, 200)
        .wait(8700)
        .to({
          alpha: 0
        }, 1000);
      this.currentTimeLine = new Timeline();
      this.currentTimeLine.addLabel('skip', 8500);
      this.currentTimeLine.skipTime = 8500;
      this.currentTimeLine.addTween(tweenCard);
      this.currentTimeLine.addTween(tweenCardSmall);
      this.currentTimeLine.addTween(tweenFlash);
      this.currentTimeLine.addTween(tweenStage);
      this.currentTimeLine.isSkipable = true;
      this.currentTimeLine.on('complete', () => this.resetRarityEffect());
      this.currentTimeLine.gotoAndPlay(0);
      console.log(this.currentTimeLine);
    }

    // SR Animation
    if (type === 'SR') {

      // Card image size is 768*1052
      // Resize it to canvas
      if (HEIGHT > WIDTH) {
        CARD_BITMAP.scale = HEIGHT / 1052 * 1.3;
      } else {
        CARD_BITMAP.scale = WIDTH / 768 * 1.2;
      }

      // Initial Position
      CARD_BITMAP.x = WIDTH * 0.5;
      CARD_BITMAP.y = HEIGHT * 0.4;

      CARD_BITMAP.alpha = CARD_SMALL_BITMAP.alpha = 0;

      // Set small card size
      if (HEIGHT > WIDTH) {
        CARD_SMALL_BITMAP.scale = WIDTH / 768 * 0.8;
      } else {
        CARD_SMALL_BITMAP.scale = HEIGHT / 1052 * 0.8;
      }

      CARD_SMALL_BITMAP.x = WIDTH * 0.5;
      CARD_SMALL_BITMAP.y = HEIGHT * 0.5;

      CARD_SMALL_BITMAP.shadow = SHADOW;

      STAGE.addChild(CARD_BITMAP, CARD_SMALL_BITMAP);

      const tweenCard = Tween.get(CARD_BITMAP, {loop: false})
        .wait(100)
        .to({
          alpha: 1
        }, 100)
        .to({
          y: HEIGHT * 0.6
        }, 4000)
        .wait(50)
        .to({
          scale: WIDTH / 768 * 1.3,
          x: WIDTH * 0.5,
          y: HEIGHT * 0.5,
          alpha: 0.8
        }, 0)
        .wait(100);

      const tweenCardSmall = Tween.get(CARD_SMALL_BITMAP, {loop: false})
        .wait(4300)
        .to({
          alpha: 1
        }, 100);

      STAGE.addChild(FLASH);
      const tweenFlash = Tween.get(FLASH)
        .wait(200)
        .to({
          alpha: 0
        }, 4000)
        // Flash
        .to({alpha: 0.8}, 80, Ease.getPowOut(4))
        .wait(40)
        .to({alpha: 0.2}, 80, Ease.getPowIn(4))

        .wait(1500)
        .to({
          alpha: 1
        }, 1000);
      const tweenStage = Tween.get(STAGE)
        .to({
          alpha: 1
        }, 200)
        .wait(5500)
        .to({
          alpha: 0
        }, 1000);
      this.currentTimeLine = new Timeline();
      this.currentTimeLine.addLabel('skip', 4250);
      this.currentTimeLine.skipTime = 4250;
      this.currentTimeLine.addTween(tweenCard);
      this.currentTimeLine.addTween(tweenCardSmall);
      this.currentTimeLine.addTween(tweenFlash);
      this.currentTimeLine.addTween(tweenStage);
      this.currentTimeLine.isSkipable = true;
      this.currentTimeLine.on('complete', () => this.resetRarityEffect());
      this.currentTimeLine.gotoAndPlay(0);
      console.log(this.currentTimeLine);
    }
  }

  submitCardData() {
    const aimeId = this.auth.currentUserValue.extId;
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
