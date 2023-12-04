import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toLevelDecimal'
})
export class ToLevelDecimalPipe implements PipeTransform {

  transform(value: string): string {
    if (value === null) { return null; }
    value = value.replace(',', '.');
    if (value.charAt(value.length - 1) === '0' && value.charAt(value.length - 2) !== '.') {
      value = value.slice(0, value.length - 1);
    }
    return value;
  }

}
