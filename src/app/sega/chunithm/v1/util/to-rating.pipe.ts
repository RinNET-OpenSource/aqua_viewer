import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toRating'
})
export class ToRatingPipe implements PipeTransform {

  transform(value: number): number {
    return Math.floor(value) / 100;
  }

}
