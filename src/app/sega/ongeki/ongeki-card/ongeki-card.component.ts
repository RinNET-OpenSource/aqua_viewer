import {Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
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

@Component({
  selector: 'app-ongeki-card',
  templateUrl: './ongeki-card.component.html',
  styleUrls: ['./ongeki-card.component.css']
})
export class OngekiCardComponent implements OnInit {
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

  currentPage = 1;
  totalElements = 0;

  showHolo = false;
  showElements = false;

  isTouchDevice: boolean;

  onMouseMove(event: MouseEvent, cardRotator: HTMLDivElement): void {
    const rect = cardRotator.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (centerY - y) / 10;
    const rotateY = (x - centerX) / 10;

    cardRotator.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(60px)`;


    // 计算伪元素的位置
    const max = Math.sqrt(centerX * centerX + centerY * centerY);
    const dx = (x - centerX) / max;
    const dy = (y - centerY) / max;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 更新伪元素样式
    const pseudoLeft = (x / rect.width) * 100 + '%';
    const pseudoTop = (y / rect.height) * 100 + '%';
    cardRotator.style.setProperty('--pseudo-left', pseudoLeft.toString());
    cardRotator.style.setProperty('--pseudo-top', pseudoTop.toString());
    cardRotator.style.setProperty('--pseudo-opacity', Math.min(1, distance).toString());
  }

  onMouseLeave(cardRotator: HTMLDivElement): void {
    cardRotator.style.transform = 'none';

    cardRotator.style.setProperty('--pseudo-left', '50%');
    cardRotator.style.setProperty('--pseudo-top', '50%');
    cardRotator.style.setProperty('--pseudo-opacity', '0');
  }


  constructor(
    private api: ApiService,
    public route: ActivatedRoute,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService,
    public router: Router,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
      this.load(this.currentPage);
    });
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

  getCharaMask(card: PlayerCard){
    return 'url(' + this.host + 'assets/ongeki/card-chara-mask/UI_Card_Chara_Mask_' + card.cardId + '.png' + ')';
  }

  getHoloFrameMask(card: PlayerCard, showElements: boolean){
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    let frameUrl: string;
    if (card.cardInfo){
      if (this.isSignHolo(card.cardId)){
        if (showElements){
          frameUrl = 'linear-gradient(transparent, transparent)';
        }
        else{
          frameUrl = 'url(' + this.host + 'assets/ongeki/card-holo-sign/UI_Card_Holo_Sign_' + cardIdStr + '.png' + ')';
        }
      }
      else if (card.cardInfo.rarity === 'SSR')
      {
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_SSR_00.png' + ')';
      }
      else if (card.cardInfo.rarity === 'SR' || card.cardInfo.rarity === 'SRPlus'){
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_SR_01.png' + ')';
      }
      else if (card.cardInfo.rarity === 'R'){
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_R_00.png' + ')';
      }
      else if (card.cardInfo.rarity === 'N'){
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_N_00.png' + ')';
      }
      else {
        frameUrl = 'linear-gradient(transparent, transparent)';
      }
    }
    if (card.cardInfo.rarity === 'R' || card.cardInfo.rarity === 'N')
    {
      const charaMask = this.host + 'assets/ongeki/card-chara-mask/UI_Card_Chara_Mask_' + cardIdStr + '.png';
      const charaMaskUrl = 'url(' + charaMask + ')';
      return frameUrl + ',' + charaMaskUrl;
    }
    else{
      return frameUrl;
    }
  }
  isSpecialHolo(id: number){
    return this.specialHoloIDs.includes(id);
  }
  isSignHolo(id: number){
    return this.signHoloIDs.includes(id);
  }

  getHoloBGMask(card: PlayerCard, showElements: boolean){
    const isSpecialHolo = this.isSpecialHolo(card.cardId);
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    const charaMask = this.host + 'assets/ongeki/card-chara-mask/UI_Card_Chara_Mask_' + cardIdStr + '.png';
    const charaMaskUrl = 'url(' + charaMask + ')';
    let bgUrl: string;
    if (card.cardInfo){
      if (isSpecialHolo){
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-holo/UI_Card_Holo_' + cardIdStr + '.png' + ')';
      }
      else if (card.cardInfo.rarity === 'SSR')
      {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_SSR_00.png' + ')';
      }
      else if (card.cardInfo.rarity === 'SR' || card.cardInfo.rarity === 'SRPlus' ){
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_SR_00.png' + ')';
      }
      else if (card.cardInfo.rarity === 'R'){
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_R_00.png' + ')';
      }
      else if (card.cardInfo.rarity === 'N'){
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_N_00.png' + ')';
      }
    }
    else{
      bgUrl = 'linear-gradient(transparent, transparent)';
    }

    if (isSpecialHolo){
      return bgUrl;
    }
    else if (showElements){
      return bgUrl + ',' + charaMaskUrl + ',' + this.getFrame(card);
    }
    else{
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
      if (showHolo){
        const bg = this.host + 'assets/ongeki/card-bg/UI_Card_BG_Horo_' + card.cardInfo.rarity + '_' + attrCode + '.png';
        bgUrl = 'url(' + bg + ')';
      }
      else{
        const bg = this.host + 'assets/ongeki/card-bg/UI_Card_BG_' + card.cardInfo.rarity + '_' + attrCode + '.png';
        bgUrl = 'url(' + bg + ')';
      }
    }
    return bgUrl;
  }
  getFrame(card: PlayerCard){
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
  getHoloFrame(card: PlayerCard){
    let attrCode;

    if (card.cardInfo.attribute === 'Fire') {
      attrCode = '00';
    } else if (card.cardInfo.attribute === 'Aqua') {
      attrCode = '01';
    } else if (card.cardInfo.attribute === 'Leaf') {
      attrCode = '02';
    }
    const frameUrl = this.getHoloFrameByRarity(card.cardInfo.rarity, attrCode);

    if (card.cardInfo.rarity === 'SRPlus'){
      return this.getHoloFrameByRarity('SR', attrCode) + ',' + frameUrl;
    }
    return frameUrl;
  }
  getFrameByRarity(rarity: string, attrCode: number){
    let frame: string;
    if (rarity === 'SSR'){
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SSR_00.png';
    }
    else if (rarity === 'SR'){
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SR_' + attrCode + '.png';
    }
    else if (rarity === 'SRPlus'){
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SRPlus_00.png';
    }
    else{
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_' + rarity + '_' + attrCode + '.png';
    }
    return 'url(' + frame + ')';
  }
  getHoloFrameByRarity(rarity: string, attrCode: number){
    let frame: string;
    if (rarity === 'SSR'){
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SSR_00.png';
    }
    else if (rarity === 'SR'){
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_Frame_Horo_SR_' + attrCode + '.png';
    }
    else if (rarity === 'SRPlus'){
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SRPlus_00.png';
    }
    else{
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_' + rarity + '_' + attrCode + '.png';
    }
    return 'url(' + frame + ')';
  }
  getChara(card: PlayerCard){
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    const charaP = this.host + 'assets/ongeki/card-chara-p/UI_Card_Chara_' + cardIdStr + '_P.png';
    return  'url(' + charaP + ')';
  }
}
