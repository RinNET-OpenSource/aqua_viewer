import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ratingClass'
})
export class RatingClass implements PipeTransform {

  transform(s: number, args?: any): string {
    switch (true) {
      case (s >= 0.00 && s <= 3.99):
        return 'lv0';
      case (s >= 4.00 && s <= 6.99):
        return 'lv6';
      case (s >= 7.00 && s <= 9.99):
        return 'lv2';
      case (s >= 10.00 && s <= 11.99):
        return 'lv12';
      case (s >= 12.00 && s <= 13.24):
        return  'lv10';
      case (s >= 13.25 && s <= 14.99):
        return 'lv14';
      case (s >= 14.50 && s <= 15.24):
        return 'lv15';
      case (s >= 15.25 && s <= 15.99):
        return 'lv16';
      case (s >= 16.0):
        return 'lv17';
    }
  }

}
