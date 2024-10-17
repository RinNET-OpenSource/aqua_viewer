import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'ordinal'
})
export class OrdinalPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  transform(value: number): string {
    const locale = this.translateService.currentLang;
    if (locale === 'en') {
      return this.getEnglishOrdinal(value);
    }
    return value.toString();
  }

  private getEnglishOrdinal(value: number): string {
    const ordinalFormatter = new Intl.PluralRules('en', { type: 'ordinal' });
    const suffixes = {
      one: 'st',
      two: 'nd',
      few: 'rd',
      other: 'th'
    };
    const suffix = suffixes[ordinalFormatter.select(value)];
    return `${value}${suffix}`;
  }
}
