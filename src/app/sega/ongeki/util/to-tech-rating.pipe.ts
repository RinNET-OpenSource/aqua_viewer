import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toTechRating'
})
export class ToTechRatingPipe implements PipeTransform {

  // type: 1 for 13.00 + 2.00, 2 for 15.00
  transform(diff: string, score: number, type: number): string {
    if (diff === null) { return null; }
    const diffNum = parseFloat(diff);
    let result: number;
    const scoreZero = 500000;
    const rateTbls = [
      [800000, -600],
      [900000, -400],
      [970000, 0],
      [990000, 100],
      [1000000, 150],
      [1007500, 200],
      [1100000, 200]
    ];
    const level100 = Math.floor(diffNum * 100.0 + 0.5);
    let num = 0;

    if (score <= rateTbls[0][0]){
      num = (level100 + rateTbls[0][1]) * (score - scoreZero) / (rateTbls[0][0] - scoreZero);
    } else {
      for (let i = 1; i < 7; i++){
        const rateTbl = rateTbls[i];
        if (score <= rateTbl[0]){
          const rateTbl2 = rateTbls[i - 1];
          num = level100 + rateTbl2[1];
          num += (rateTbl[1] - rateTbl2[1]) * (score - rateTbl2[0]) / (rateTbl[0] - rateTbl2[0]);
          break;
        }
      }
    }

    num = Math.floor(num);
    result = Math.max(num, 0) / 100.0;

    if (result === 0) {
      return '0.00';
    } else {
      if (type === 1) {
        return diffNum.toFixed(2).toString() + (result >= diffNum ? '+' : '-') + Math.abs(result - diffNum).toFixed(2).toString();
      } else {
        return result.toFixed(2).toString();
      }
    }
  }
}
