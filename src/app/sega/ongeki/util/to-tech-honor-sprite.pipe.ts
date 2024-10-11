import { Pipe, PipeTransform } from '@angular/core';
import {TechnicalRank} from '../model/OngekiEnums';

@Pipe({
  name: 'toTechHonorSprite'
})
export class ToTechHonorSpritePipe implements PipeTransform {

  transform(value: number): string {
    switch (TechnicalRank[value]) {
      case 'D':
        return 'UI_SLC_MusicSelect_HornorBadge_D.webp';
      case 'C':
        return 'UI_SLC_MusicSelect_HornorBadge_C.webp';
      case 'B':
        return 'UI_SLC_MusicSelect_HornorBadge_B.webp';
      case 'BB':
        return 'UI_SLC_MusicSelect_HornorBadge_BB.webp';
      case 'BBB':
        return 'UI_SLC_MusicSelect_HornorBadge_BBB.webp';
      case 'A':
        return 'UI_SLC_MusicSelect_HornorBadge_A.webp';
      case 'AA':
        return 'UI_SLC_MusicSelect_HornorBadge_AA.webp';
      case 'AAA':
        return 'UI_SLC_MusicSelect_HornorBadge_AAA.webp';
      case 'S':
        return 'UI_SLC_MusicSelect_HornorBadge_S.webp';
      case 'SS':
        return 'UI_SLC_MusicSelect_HornorBadge_SS.webp';
      case 'SSS':
        return 'UI_SLC_MusicSelect_HornorBadge_SSS.webp';
      case 'SSS1':
        return 'UI_SLC_MusicSelect_HornorBadge_SSSplus.webp';
    }
    return null;
  }

}
