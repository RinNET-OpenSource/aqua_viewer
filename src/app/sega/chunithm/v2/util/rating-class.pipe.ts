import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ratingClass'
})
export class RatingClass implements PipeTransform {

  transform(s: number, args?: any): string {
    switch (true) {
      case (s < 4.0):
        return 'lv6';
      case (s < 7.0):
        return 'lv2';
      case (s < 10.0):
        return 'lv12';
      case (s < 12.0):
        return 'lv10';
      case (s < 13.25):
        return 'lv14';
      case (s < 14.5):
        return 'lv15';
      case (s < 15.25):
        return 'lv16';
      case (s < 16.0):
        return 'lv0';
      case (s >= 16.0):
        return 'lv17';
    }
  }

}
