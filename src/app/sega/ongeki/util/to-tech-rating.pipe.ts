import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toTechRating'
})
export class ToTechRatingPipe implements PipeTransform {

  transform(diff: string, score: number): string {
    const diffNum = parseFloat(diff);
    let result: number;
    // if (score < 850000) {
    //   result = 0.0;
    // } else if (score < 900000) {
    //   result = ((score - 850000) / (500 / (diffNum - 4.0))) * 0.01;
    // } else if (score < 940000) {
    //   result = diffNum - 4.00 + ((score - 900000) / 175.0) * 0.01;
    // } else if (score < 970000) {
    //   result = diffNum - (12 / 7) + ((score - 940000) / 175.0) * 0.01;
    // } else if (score < 990000) {
    //   result = diffNum + ((score - 970000) / 200.0) * 0.01;
    // } else if (score < 1000000) {
    //   result = diffNum + 1.0 + ((score - 990000) / 200.0) * 0.01;
    // } else if (score < 1007500) {
    //   result = diffNum + 1.5 + ((score - 1000000) / 150.0) * 0.01;
    // } else {
    //   result = diffNum + 2.0;
    // }

    const scoreZero = 500000;
    const rateTbls = [
      [800000, -600],
      [900000, -400],
      [970000, 0],
      [990000, 100],
      [1000000, 150],
      [1007500, 200]
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
    result = Math.max(num, 0) / 100.0;

    if (result === 0) {
      return '0.00';
    } else {
      return diffNum.toFixed(2).toString() + (result >= diffNum ? '+' : '-') + Math.abs(result - diffNum).toFixed(2).toString();
    }
  }
}
