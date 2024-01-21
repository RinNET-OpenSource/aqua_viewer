import { Pipe, PipeTransform } from '@angular/core';
import {TechnicalRank} from '../model/OngekiEnums';

@Pipe({
  name: 'toTechHonorSprite'
})
export class ToTechHonorSpritePipe implements PipeTransform {

  transform(value: number): string {
    switch (TechnicalRank[value]) {
      case 'D':
        return 'UI_SLC_MusicSelect_HornorBadge_D.png';
      case 'C':
        return 'UI_SLC_MusicSelect_HornorBadge_C.png';
      case 'B':
        return 'UI_SLC_MusicSelect_HornorBadge_B.png';
      case 'BB':
        return 'UI_SLC_MusicSelect_HornorBadge_BB.png';
      case 'BBB':
        return 'UI_SLC_MusicSelect_HornorBadge_BBB.png';
      case 'A':
        return 'UI_SLC_MusicSelect_HornorBadge_A.png';
      case 'AA':
        return 'UI_SLC_MusicSelect_HornorBadge_AA.png';
      case 'AAA':
        return 'UI_SLC_MusicSelect_HornorBadge_AAA.png';
      case 'S':
        return 'UI_SLC_MusicSelect_HornorBadge_S.png';
      case 'SS':
        return 'UI_SLC_MusicSelect_HornorBadge_SS.png';
      case 'SSS':
        return 'UI_SLC_MusicSelect_HornorBadge_SSS.png';
      case 'SSS1':
        return 'UI_SLC_MusicSelect_HornorBadge_SSSplus.png';
    }
    return null;
  }

}
