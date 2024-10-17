import {Pipe, PipeTransform} from '@angular/core';
import {TechnicalRank} from '../model/OngekiEnums';

@Pipe({
  name: 'toTechSprite'
})
export class ToTechSpritePipe implements PipeTransform {

  transform(value: number): string {
    switch (TechnicalRank[value]) {
      case 'D':
        return 'SB_RES_ScoreRank_D.webp';
      case 'C':
        return 'SB_RES_ScoreRank_C.webp';
      case 'B':
        return 'SB_RES_ScoreRank_B.webp';
      case 'BB':
        return 'SB_RES_ScoreRank_BB.webp';
      case 'BBB':
        return 'SB_RES_ScoreRank_BBB.webp';
      case 'A':
        return 'SB_RES_ScoreRank_A.webp';
      case 'AA':
        return 'SB_RES_ScoreRank_AA.webp';
      case 'AAA':
        return 'SB_RES_ScoreRank_AAA.webp';
      case 'S':
        return 'SB_RES_ScoreRank_S.webp';
      case 'SS':
        return 'SB_RES_ScoreRank_SS.webp';
      case 'SSS':
        return 'SB_RES_ScoreRank_SSS.webp';
      case 'SSS1':
        return 'SB_RES_ScoreRank_SSS%2B.webp';
    }
    return null;
  }

}
