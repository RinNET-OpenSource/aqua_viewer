import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'toDate'
})
export class ToDatePipe implements PipeTransform {

  transform(value: string): string {
    return dayjs(value).format('YYYY/MM/DD');
  }

}
