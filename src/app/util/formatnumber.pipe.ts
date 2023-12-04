import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatnumberPipe implements PipeTransform {

  public transform(value: number, length?: number): string {
    if (value === null) { return null; }
    let str = value.toString();
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

}
