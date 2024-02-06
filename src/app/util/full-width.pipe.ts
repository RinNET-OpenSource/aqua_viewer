import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullWidth'
})
export class FullWidthPipe implements PipeTransform {

  transform(value: string): string {
    return Array.from(value).map((char) => {
      const code = char.charCodeAt(0);
      if (code === 0x20) {
        return String.fromCharCode(0x3000);
      } else if (code >= 0x21 && code <= 0x7e) {
        return String.fromCharCode(code + 0xfee0);
      }
      return char;
    }).join('');
  }

}
