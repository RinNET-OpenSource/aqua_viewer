import {Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {OngekiCard} from '../model/OngekiCard';
import {OngekiCharacter} from '../model/OngekiCharacter';
import {PlayerCard} from '../model/PlayerCard';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {OngekiSkill} from '../model/OngekiSkill';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-ongeki-card',
  templateUrl: './ongeki-card.component.html',
  styleUrls: ['./ongeki-card.component.css'],
  animations: [
    trigger('cardAnimation', [
      state('normal', style({
        transform: 'scale(1)',
        position: 'static',
        zIndex: 'auto',
        width: '*',
        height: '*',
        top: '*',
        left: '*'
      })),
      state('expanded', style({
        transform: 'translate(-50%, -50%) translateZ(10000px)',
        position: 'fixed',
        width: '{{expandedWidth}}px',
        height: '{{expandedHeight}}px',
        top: '50%',
        left: '50%',
        zIndex: 1100
      }), {params: {expandedWidth: '182.233', expandedHeight: '259.683'}}),
      transition('* => expanded', [
        style({
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          width: '{{width}}px',
          height: '{{height}}px',
          top: '{{top}}px',
          left: '{{left}}px',
          zIndex: 1100
        }),
        animate('1s ease-in-out')
      ]),
      transition('expanded => normal', [
        animate('1s ease-in-out', style({
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          width: '{{width}}px',
          height: '{{height}}px',
          top: '{{top}}px',
          left: '{{left}}px',
          zIndex: 1100
        }))
      ])
    ])
  ]
})
export class OngekiCardComponent implements OnInit, OnDestroy {
  private specialHoloIDs = [
    100009, 100018, 100027, 100201, 100202, 100203, 100204, 100205, 100206, 100288, 100289, 100290, 100291, 100292, 100293, 100294, 100295,
    100296, 100297, 100298, 100458, 100459, 100460, 100489, 100572, 100613, 100614, 100615, 100616, 100617, 100618, 100729, 100730, 100806,
    100887, 101047, 101048, 101312, 101313, 101314, 101322, 101323, 101324, 101325, 101326, 101327, 101328, 101329, 101330, 101331, 101332,
    101333, 101334, 101335, 101336, 101337, 101338, 101339, 101502];
  private signHoloIDs = [
    100009, 100018, 100027, 100288, 100289, 100290, 100458, 100459, 100460, 100729, 100730, 101047, 101048, 101312, 101313, 101314, 101322,
    101323, 101324, 101325, 101326, 101327, 101328, 101329, 101330, 101331, 101332, 101333, 101334, 101335, 101336, 101337, 101338, 101339];
  protected readonly Math = Math;

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  cardList: Observable<PlayerCard[]>;
  loading = true;
  isSafari = false;
  currentPage = 1;
  totalElements = 0;

  showHolo = false;
  showElements = true;
  pickingCard = false;
  pickedCardId: number = null;
  pickCardParams: {
    left: number;
    top: number;
    width: number;
    height: number;
    expandedWidth: number;
    expandedHeight: number;
  } = {
    left: null,
    top: null,
    width: null,
    height: null,
    expandedWidth: null,
    expandedHeight: null
  };
  private pickedCardParent: HTMLElement;

  pickCard(cardId: number, cardCol: HTMLDivElement): void {
    if (this.pickingCard || this.isSafari) {
      return;
    }
    if (this.pickedCardId) {
      this.onMouseLeaveCard(cardCol);
      return this.unpickCard();
    }
    const rect = cardCol.getBoundingClientRect();
    this.pickCardParams.width = rect.width;
    this.pickCardParams.height = rect.height;
    this.pickCardParams.left = (rect.right + rect.left) / 2;
    this.pickCardParams.top = (rect.bottom + rect.top) / 2;

    let maxWidth = this.Math.min(window.innerHeight * 0.730038022813688, window.innerWidth);
    maxWidth *= 0.9;
    maxWidth = this.Math.min(maxWidth, 768);
    const maxHeight = maxWidth / 0.730038022813688;
    this.pickCardParams.expandedWidth = maxWidth;
    this.pickCardParams.expandedHeight = maxHeight;


    this.onMouseLeaveCard(cardCol);
    cardCol.classList.add('card-picking');
    this.pickedCardId = cardId;
    this.pickedCardParent = cardCol.parentElement;
    document.querySelector('body').classList.add('overflow-hidden');
  }

  unpickCard() {
    const rect = this.pickedCardParent.getBoundingClientRect();
    this.pickCardParams.width = rect.width;
    this.pickCardParams.height = rect.height;
    this.pickCardParams.left = (rect.right + rect.left) / 2;
    this.pickCardParams.top = (rect.bottom + rect.top) / 2;

    this.pickedCardId = null;
  }

  onPickAnimationStart(cardCol: HTMLDivElement) {
    this.pickingCard = true;
    cardCol.style.setProperty('--rotator-transition', 'all 1s ease-out');
  }

  onPickAnimationEnd(cardCol: HTMLDivElement) {
    this.pickingCard = false;
    cardCol.style.removeProperty('--rotator-transition');
    if (!this.pickedCardId) {
      document.querySelector('body').classList.remove('overflow-hidden');
    }
  }

  onMoveRotator(clientX: number, clientY: number, cardCol: HTMLDivElement) {
    if (this.isSafari){
      return;
    }
    const rect = cardCol.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (centerY - y) / (rect.width / 32);
    const rotateY = (x - centerX) / (rect.height / 32);

    cardCol.style.setProperty('--rotator-rotate-x', `${rotateX}deg`);
    cardCol.style.setProperty('--rotator-rotate-y', `${rotateY}deg`);

    const max = Math.sqrt(centerX * centerX + centerY * centerY);
    const dx = (x - centerX) / max;
    const dy = (y - centerY) / max;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const pseudoLeft = (x / rect.width) * 100 + '%';
    const pseudoTop = (y / rect.height) * 100 + '%';
    cardCol.style.setProperty('--rotator-transition', 'all .1s ease-out');
    cardCol.style.setProperty('--pseudo-left', pseudoLeft.toString());
    cardCol.style.setProperty('--pseudo-top', pseudoTop.toString());
    cardCol.style.setProperty('--pseudo-opacity', Math.min(1, distance).toString());
  }

  onTouchMoveRotator(event: TouchEvent, cardCol: HTMLDivElement) {
    if (!this.pickedCardId || this.pickingCard) {
      return;
    }
    const touch = event.touches[0];
    let clientX = touch.clientX;
    let clientY = touch.clientY;
    const rect = cardCol.getBoundingClientRect();
    if (clientX < rect.left) {
      clientX = rect.left;
    } else if (clientX > rect.right) {
      clientX = rect.right;
    } else if (clientY < rect.top) {
      clientY = rect.top;
    } else if (clientY > rect.bottom) {
      clientY = rect.bottom;
    }
    this.onMoveRotator(clientX, clientY, cardCol);
    event.preventDefault();
  }

  onMouseMoveRotator(event: MouseEvent, cardRotator: HTMLDivElement): void {
    if (this.pickingCard) {
      return;
    }
    this.onMoveRotator(event.clientX, event.clientY, cardRotator);
  }

  onMouseLeaveCard(cardCol: HTMLDivElement): void {
    if (this.isSafari){
      return;
    }

    cardCol.style.removeProperty('--rotator-rotate-x');
    cardCol.style.removeProperty('--rotator-rotate-y');

    cardCol.style.removeProperty('--rotator-transition');
    cardCol.style.setProperty('--pseudo-left', '50%');
    cardCol.style.setProperty('--pseudo-top', '50%');
    cardCol.style.setProperty('--pseudo-opacity', '0');
  }


  constructor(
    private api: ApiService,
    public route: ActivatedRoute,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService,
    public router: Router
  ) {
    const userAgent = window.navigator.userAgent;
    const safari = userAgent.indexOf('Safari') > -1;
    const chrome = userAgent.indexOf('Chrome') > -1;
    this.isSafari = safari && !chrome;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
      this.load(this.currentPage);
    });
    if (this.isSafari){
      this.messageService.notice('Warning: Some features of this page are not Safari compatible!');
    }
  }

  ngOnDestroy() {

  }

  load(page: number) {
    const aimeId = String(this.auth.currentAccountValue.currentCard);
    const param = new HttpParams().set('aimeId', aimeId).set('page', String(page - 1)).set('size', 12);
    this.cardList = this.api.get('api/game/ongeki/card', param).pipe(
      tap(
        data => {
          this.totalElements = data.totalElements;
          this.currentPage = page;
        }
      ),
      map(
        data => {
          data.content.forEach(x => {
            this.dbService.getByID<OngekiCard>('ongekiCard', x.cardId).subscribe(
              y => {
                x.cardInfo = y;
                this.dbService.getByID<OngekiCharacter>('ongekiCharacter', y.charaId).subscribe(
                  z =>
                    x.characterInfo = z
                );
                this.dbService.getByID<OngekiSkill>('ongekiSkill', y.skillId).subscribe(
                  z => x.skillInfo = z
                );
              }
            );
          });
          this.loading = false;
          return data.content;
        },
        error => this.messageService.notice(error)
      )
    );
  }

  kaika(cardId: number, type: string) {
    const aimeId = String(this.auth.currentAccountValue.currentCard);
    const param = new HttpParams().set('aimeId', aimeId);
    this.api.post('api/game/ongeki/card/' + cardId + '/' + type, param).subscribe(
      data => {
        this.messageService.notice('Successful');
        this.load(this.currentPage);
      },
      error => this.messageService.notice(error)
    );
  }

  pageChanged(page: number) {
    this.router.navigate(['ongeki/card'], {queryParams: {page}});
  }

  getArrayFromNumber(n: number): any[] {
    return new Array(n);
  }

  getStarCount(item: PlayerCard) {
    return (item.maxLevel - (item.kaikaDate === '0000-00-00 00:00:00.0' ? 5 : 45)) / 5;
  }

  calculateAtk(level: number, levelParams: number[], isChokaika: boolean): number {
    if (levelParams === null) {
      return null;
    }
    if (isChokaika) {
      return levelParams[levelParams.length - 1];
    }

    const levels = [1, 50, 55, 60, 65, 70, 80, 90, 100];

    if (level < levels[0] || level > levels[levels.length - 2]) {
      throw new Error('Invalid level');
    }

    for (let i = 0; i < levels.length - 1; i++) {
      if (level >= levels[i] && level < levels[i + 1]) {
        const diff = levels[i + 1] - levels[i];
        const ratio = (level - levels[i]) / diff;
        const atkDiff = levelParams[i + 1] - levelParams[i];
        return Math.floor(levelParams[i] + ratio * atkDiff);
      }
    }

    throw new Error('Level not found in range');
  }

  convertToNumberArray(input: string): number[] {
    if (input === null) {
      return null;
    }
    return input.split(',').map(str => parseFloat(str.trim()));
  }

  getCardName(str: string, rarity: string, nickName: string): string {
    return str.replace('【SR+】', '【SRPlus】').replace(`【${rarity}】`, '').replace(`[${nickName}]`, '');
  }

  getCharaMask(card: PlayerCard) {
    return 'url(' + this.host + 'assets/ongeki/card-chara-mask/UI_Card_Chara_Mask_' + card.cardId + '.png' + ')';
  }

  getHoloFrameMask(card: PlayerCard, showElements: boolean) {
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    let frameUrl: string;
    if (card.cardInfo) {
      if (this.isSignHolo(card.cardId)) {
        if (showElements) {
          frameUrl = 'linear-gradient(transparent, transparent)';
        } else {
          frameUrl = 'url(' + this.host + 'assets/ongeki/card-holo-sign/UI_Card_Holo_Sign_' + cardIdStr + '.png' + ')';
        }
      } else if (card.cardInfo.rarity === 'SSR') {
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_SSR_00.png' + ')';
      } else if (card.cardInfo.rarity === 'SR' || card.cardInfo.rarity === 'SRPlus') {
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_SR_01.png' + ')';
      } else if (card.cardInfo.rarity === 'R') {
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_R_00.png' + ')';
      } else if (card.cardInfo.rarity === 'N') {
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_N_00.png' + ')';
      } else {
        frameUrl = 'linear-gradient(transparent, transparent)';
      }
    }
    if (card.cardInfo.rarity === 'R' || card.cardInfo.rarity === 'N') {
      const charaMask = this.host + 'assets/ongeki/card-chara-mask/UI_Card_Chara_Mask_' + cardIdStr + '.png';
      const charaMaskUrl = 'url(' + charaMask + ')';
      return frameUrl + ',' + charaMaskUrl;
    } else {
      return frameUrl;
    }
  }

  isSpecialHolo(id: number) {
    return this.specialHoloIDs.includes(id);
  }

  isSignHolo(id: number) {
    return this.signHoloIDs.includes(id);
  }

  getHoloBGMask(card: PlayerCard, showElements: boolean) {
    const isSpecialHolo = this.isSpecialHolo(card.cardId);
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    const charaMask = this.host + 'assets/ongeki/card-chara-mask/UI_Card_Chara_Mask_' + cardIdStr + '.png';
    const charaMaskUrl = 'url(' + charaMask + ')';
    let bgUrl: string;
    if (card.cardInfo) {
      if (isSpecialHolo) {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-holo/UI_Card_Holo_' + cardIdStr + '.png' + ')';
      } else if (card.cardInfo.rarity === 'SSR') {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_SSR_00.png' + ')';
      } else if (card.cardInfo.rarity === 'SR' || card.cardInfo.rarity === 'SRPlus') {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_SR_00.png' + ')';
      } else if (card.cardInfo.rarity === 'R') {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_R_00.png' + ')';
      } else if (card.cardInfo.rarity === 'N') {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_N_00.png' + ')';
      }
    } else {
      bgUrl = 'linear-gradient(transparent, transparent)';
    }

    if (isSpecialHolo) {
      return bgUrl;
    } else if (showElements) {
      return bgUrl + ',' + charaMaskUrl + ',' + this.getFrame(card);
    } else {
      return bgUrl + ',' + charaMaskUrl;
    }
  }

  getCardBackground(card: PlayerCard, showHolo: boolean) {
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    if (!card.cardInfo) {
      return ''; // 'url(' + this.host + 'assets/ongeki/card/UI_Card_' + cardIdStr + '.jpg)';
    }

    let bgUrl: string;
    let attrCode;

    if (card.cardInfo.attribute === 'Fire') {
      attrCode = '00';
    } else if (card.cardInfo.attribute === 'Aqua') {
      attrCode = '01';
    } else if (card.cardInfo.attribute === 'Leaf') {
      attrCode = '02';
    }

    if (card.cardInfo.rarity === 'N' || card.cardInfo.rarity === 'R') {
      if (showHolo) {
        const bg = this.host + 'assets/ongeki/card-bg/UI_Card_BG_Horo_' + card.cardInfo.rarity + '_' + attrCode + '.png';
        bgUrl = 'url(' + bg + ')';
      } else {
        const bg = this.host + 'assets/ongeki/card-bg/UI_Card_BG_' + card.cardInfo.rarity + '_' + attrCode + '.png';
        bgUrl = 'url(' + bg + ')';
      }
    }
    return bgUrl;
  }

  getFrame(card: PlayerCard) {
    let attrCode;

    if (card.cardInfo.attribute === 'Fire') {
      attrCode = '00';
    } else if (card.cardInfo.attribute === 'Aqua') {
      attrCode = '01';
    } else if (card.cardInfo.attribute === 'Leaf') {
      attrCode = '02';
    }
    const frameUrl = this.getFrameByRarity(card.cardInfo.rarity, attrCode);

    return frameUrl;
  }

  getHoloFrame(card: PlayerCard) {
    let attrCode;

    if (card.cardInfo.attribute === 'Fire') {
      attrCode = '00';
    } else if (card.cardInfo.attribute === 'Aqua') {
      attrCode = '01';
    } else if (card.cardInfo.attribute === 'Leaf') {
      attrCode = '02';
    }
    const frameUrl = this.getHoloFrameByRarity(card.cardInfo.rarity, attrCode);

    if (card.cardInfo.rarity === 'SRPlus') {
      return this.getHoloFrameByRarity('SR', attrCode) + ',' + frameUrl;
    }
    return frameUrl;
  }

  getFrameByRarity(rarity: string, attrCode: number) {
    let frame: string;
    if (rarity === 'SSR') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SSR_00.png';
    } else if (rarity === 'SR') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SR_' + attrCode + '.png';
    } else if (rarity === 'SRPlus') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SRPlus_00.png';
    } else {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_' + rarity + '_' + attrCode + '.png';
    }
    return 'url(' + frame + ')';
  }

  getHoloFrameByRarity(rarity: string, attrCode: number) {
    let frame: string;
    if (rarity === 'SSR') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SSR_00.png';
    } else if (rarity === 'SR') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_Frame_Horo_SR_' + attrCode + '.png';
    } else if (rarity === 'SRPlus') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SRPlus_00.png';
    } else {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_' + rarity + '_' + attrCode + '.png';
    }
    return 'url(' + frame + ')';
  }

  getChara(card: PlayerCard) {
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    const charaP = this.host + 'assets/ongeki/card-chara-p/UI_Card_Chara_' + cardIdStr + '_P.png';
    return 'url(' + charaP + ')';
  }

  getCardBack() {
    const backImg = this.host + 'assets/ongeki/gameUi/UI_CMN_CardBackSide.png';
    return 'url(' + backImg + ')';
  }
}
