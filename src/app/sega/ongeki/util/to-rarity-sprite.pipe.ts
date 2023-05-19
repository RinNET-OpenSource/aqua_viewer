import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toRaritySprite'
})
export class ToRaritySpritePipe implements PipeTransform {

  transform(value: string): string {
    switch (value){
      case 'N': return'N';
      case 'R': return'R';
      case 'SR': return'SR';
      case 'SRPlus': return'SR_plus';
      case 'SSR': return'SSR';
    }
  }

}
