import {Pipe, PipeTransform} from '@angular/core';
import {BattleRank} from '../model/OngekiEnums';

@Pipe({
  name: 'toBattleSprite'
})
export class ToBattleSpritePipe implements PipeTransform {


  transform(value: number): string {
    switch (BattleRank[value]) {
      case 'Yu':
        return 'SB_RES_ScoreStamp_Great.webp';
      case 'Ryo':
        return 'SB_RES_ScoreStamp_Good.webp';
      case 'Fuka':
        return 'SB_RES_ScoreStamp_NoGood.webp';
      case 'Shu':
        return 'SB_RES_ScoreStamp_Excellent.webp';
      case 'Ka':
        return 'SB_RES_ScoreStamp_Usually.webp';
      case 'Goku':
        return 'SB_RES_ScoreStamp_Unbelievable.webp';
      case 'Goku1':
        return 'SB_RES_ScoreStamp_Unbelievable.webp';
      case 'Goku2':
        return 'SB_RES_ScoreStamp_Unbelievable.webp';
      case 'Goku3':
        return 'SB_RES_ScoreStamp_Unbelievable.webp';
      case 'Goku4':
        return 'SB_RES_ScoreStamp_Unbelievable.webp';
      case 'Goku5':
        return 'SB_RES_ScoreStamp_Unbelievable.webp';
    }
    return null;
  }

}
