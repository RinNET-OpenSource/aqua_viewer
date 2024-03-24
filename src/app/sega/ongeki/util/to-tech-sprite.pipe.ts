import {Pipe, PipeTransform} from '@angular/core';
import {TechnicalRank} from '../model/OngekiEnums';

@Pipe({
  name: 'toTechSprite'
})
export class ToTechSpritePipe implements PipeTransform {

  transform(value: number): string {
    switch (TechnicalRank[value]) {
      case 'D':
        return 'SB_RES_ScoreRank_D.png';
      case 'C':
        return 'SB_RES_ScoreRank_C.png';
      case 'B':
        return 'SB_RES_ScoreRank_B.png';
      case 'BB':
        return 'SB_RES_ScoreRank_BB.png';
      case 'BBB':
        return 'SB_RES_ScoreRank_BBB.png';
      case 'A':
        return 'SB_RES_ScoreRank_A.png';
      case 'AA':
        return 'SB_RES_ScoreRank_AA.png';
      case 'AAA':
        return 'SB_RES_ScoreRank_AAA.png';
      case 'S':
        return 'SB_RES_ScoreRank_S.png';
      case 'SS':
        return 'SB_RES_ScoreRank_SS.png';
      case 'SSS':
        return 'SB_RES_ScoreRank_SSS.png';
      case 'SSS1':
        return 'SB_RES_ScoreRank_SSS%2B.png';
    }
    return null;
  }

}
