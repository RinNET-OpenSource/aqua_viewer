import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toRank'
})
export class ToRankPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) {
      return 'D';
    }
    if (value === 1) {
      return 'C';
    }
    if (value === 2) {
      return 'B';
    }
    if (value === 3) {
      return 'BB';
    }
    if (value === 4) {
      return 'BBB';
    }
    if (value === 5) {
      return 'A';
    }
    if (value === 6) {
      return 'AA';
    }
    if (value === 7) {
      return 'AAA';
    }
    if (value === 8) {
      return 'S';
    }
    if (value === 9) {
      return 'S+';
    }
    if (value === 10) {
      return 'SS';
    }
    if (value === 11) {
      return 'SS+';
    }
    if (value === 12) {
      return 'SSS';
    }
    if (value > 12) {
      return 'SSS+';
    }
  }

}
