import { Pipe, PipeTransform } from '@angular/core';
import {ChusanMusicLevelInfo} from '../model/ChusanMusic';

@Pipe({
  name: 'toLevelString'
})
export class ToLevelStringPipe implements PipeTransform {

  transform(level: ChusanMusicLevelInfo): string {
    return `${level.level}.${level.levelDecimal.toString().charAt(0)}` ?? '0';
  }

}
