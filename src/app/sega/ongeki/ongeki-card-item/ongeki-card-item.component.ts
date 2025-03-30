import {Component, Input, OnInit} from '@angular/core';
import {PlayerCard} from '../model/PlayerCard';
import {environment} from '../../../../environments/environment';
import {NgxIndexedDBService} from 'ngx-indexed-db';

@Component({
  selector: 'app-ongeki-card-item',
  templateUrl: './ongeki-card-item.component.html',
  styleUrls: ['./ongeki-card-item.component.css'],
  inputs: ['item', 'showHolo', 'showElements', 'holoSheetStyle1', 'holoSheetStyle2']
})
export class OngekiCardItemComponent implements OnInit {

  private static specialHoloIDs = [
    100009, 100018, 100027, 100201, 100202, 100203, 100204, 100205, 100206, 100288, 100289, 100290, 100291, 100292, 100293, 100294, 100295,
    100296, 100297, 100298, 100458, 100459, 100460, 100489, 100572, 100613, 100614, 100615, 100616, 100617, 100618, 100729, 100730, 100806,
    100887, 101047, 101048, 101312, 101313, 101314, 101322, 101323, 101324, 101325, 101326, 101327, 101328, 101329, 101330, 101331, 101332,
    101333, 101334, 101335, 101336, 101337, 101338, 101339, 101502];
  private static signHoloIDs = [
    100009, 100018, 100027, 100288, 100289, 100290, 100458, 100459, 100460, 100729, 100730, 101047, 101048, 101312, 101313, 101314, 101322,
    101323, 101324, 101325, 101326, 101327, 101328, 101329, 101330, 101331, 101332, 101333, 101334, 101335, 101336, 101337, 101338, 101339];


  item: PlayerCard;
  showHolo: boolean;
  showElements: boolean;
  holoSheetStyle1: string;
  holoSheetStyle2: string;

  protected readonly Math = Math;
  host = environment.assetsHost;

  constructor(
    private dbService: NgxIndexedDBService) {
  }

  getCardBackground(card: PlayerCard, showHolo: boolean) {
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    if (!card.cardInfo) {
      return 'url(' + this.host + 'assets/ongeki/card-chara-p/UI_Card_Chara_' + cardIdStr + '_P.webp)';
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
        const bg = this.host + 'assets/ongeki/card-bg/UI_Card_BG_Horo_' + card.cardInfo.rarity + '_' + attrCode + '.webp';
        bgUrl = 'url(' + bg + ')';
      } else {
        const bg = this.host + 'assets/ongeki/card-bg/UI_Card_BG_' + card.cardInfo.rarity + '_' + attrCode + '.webp';
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

  getChara(card: PlayerCard) {
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    const charaP = this.host + 'assets/ongeki/card-chara-p/UI_Card_Chara_' + cardIdStr + '_P.webp';
    return 'url(' + charaP + ')';
  }
  getHoloBGMask(card: PlayerCard, showElements: boolean) {
    const isSpecialHolo = this.isSpecialHolo(card.cardId);
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    const charaMask = this.host + 'assets/ongeki/card-chara-mask/UI_Card_Chara_Mask_' + cardIdStr + '.webp';
    const charaMaskUrl = 'url(' + charaMask + ')';
    let bgUrl: string;
    if (card.cardInfo) {
      if (isSpecialHolo) {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-holo/UI_Card_Holo_' + cardIdStr + '.webp' + ')';
      } else if (card.cardInfo.rarity === 'SSR') {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_SSR_00.webp' + ')';
      } else if (card.cardInfo.rarity === 'SR' || card.cardInfo.rarity === 'SRPlus') {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_SR_00.webp' + ')';
      } else if (card.cardInfo.rarity === 'R') {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_R_00.webp' + ')';
      } else if (card.cardInfo.rarity === 'N') {
        bgUrl = 'url(' + this.host + 'assets/ongeki/card-bg/UI_Card_Horo_BG_N_00.webp' + ')';
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

  getHoloFrameMask(card: PlayerCard, showElements: boolean) {
    const cardIdStr = card.cardId.toString().padStart(6, '0');
    let frameUrl: string;
    if (card.cardInfo) {
      if (this.isSignHolo(card.cardId)) {
        if (showElements) {
          frameUrl = 'linear-gradient(transparent, transparent)';
        } else {
          frameUrl = 'url(' + this.host + 'assets/ongeki/card-holo-sign/UI_Card_Holo_Sign_' + cardIdStr + '.webp' + ')';
        }
      } else if (card.cardInfo.rarity === 'SSR') {
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_SSR_00.webp' + ')';
      } else if (card.cardInfo.rarity === 'SR' || card.cardInfo.rarity === 'SRPlus') {
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_SR_01.webp' + ')';
      } else if (card.cardInfo.rarity === 'R') {
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_R_00.webp' + ')';
      } else if (card.cardInfo.rarity === 'N') {
        frameUrl = 'url(' + this.host + 'assets/ongeki/card-frame/UI_Card_Horo_Frame_N_00.webp' + ')';
      } else {
        frameUrl = 'linear-gradient(transparent, transparent)';
      }
    }
    if (card.cardInfo.rarity === 'R' || card.cardInfo.rarity === 'N') {
      const charaMask = this.host + 'assets/ongeki/card-chara-mask/UI_Card_Chara_Mask_' + cardIdStr + '.webp';
      const charaMaskUrl = 'url(' + charaMask + ')';
      return frameUrl + ',' + charaMaskUrl;
    } else {
      return frameUrl;
    }
  }

  isSpecialHolo(id: number) {
    return OngekiCardItemComponent.specialHoloIDs.includes(id);
  }

  isSignHolo(id: number) {
    return OngekiCardItemComponent.signHoloIDs.includes(id);
  }

  getFrameByRarity(rarity: string, attrCode: number) {
    let frame: string;
    if (rarity === 'SSR') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SSR_00.webp';
    } else if (rarity === 'SR') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SR_' + attrCode + '.webp';
    } else if (rarity === 'SRPlus') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SRPlus_00.webp';
    } else {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_' + rarity + '_' + attrCode + '.webp';
    }
    return 'url(' + frame + ')';
  }

  getHoloFrameByRarity(rarity: string, attrCode: number) {
    let frame: string;
    if (rarity === 'SSR') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SSR_00.webp';
    } else if (rarity === 'SR') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_Frame_Horo_SR_' + attrCode + '.webp';
    } else if (rarity === 'SRPlus') {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_SRPlus_00.webp';
    } else {
      frame = this.host + 'assets/ongeki/card-frame/UI_Card_frame_' + rarity + '_' + attrCode + '.webp';
    }
    return 'url(' + frame + ')';
  }


  getStarCount(item: PlayerCard) {
    return (item.maxLevel - (item.kaikaDate === '0000-00-00 00:00:00.0' ? 5 : 45)) / 5;
  }

  getArrayFromNumber(n: number): any[] {
    return new Array(n);
  }
  calculateAtk(level: number, levelParams: number[], isChokaika: boolean): number {
    if (levelParams === null) {
      return null;
    }
    if (isChokaika) {
      return levelParams[levelParams.length - 1];
    }

    const levels = [1, 50, 55, 60, 65, 70, 80, 90, 100];

    if (level < levels[0]) {
      level = 1;
    } else if (level > levels[levels.length - 4]) {
      level = levels[levels.length - 4];
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
    if (str){
      return str.replace('【SR+】', '【SRPlus】').replace(`【${rarity}】`, '').replace(`[${nickName}]`, '');
    }
  }

  getCardBack() {
    const backImg = this.host + 'assets/ongeki/gameUi/UI_CMN_CardBackSide.webp';
    return 'url(' + backImg + ')';
  }

  ngOnInit() {

  }
}
