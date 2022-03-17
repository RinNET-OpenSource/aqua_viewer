import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'courceIdToClass'
})
export class CourceIdToClassPipe implements PipeTransform {

  transform(v: number): number {
    switch (true) {
      case (v === 10):
        return 1;
      case (v === 11):
        return 2;
      case (v === 12):
        return 3;
      case (v === 13):
        return 4;
      case (v === 14):
        return 5;
      case (v === 20):
        return 6; // infinity
      case (v === 21):
        return 7; // class unknown
    }
  }

}
