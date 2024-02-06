import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormatnumberPipe} from './formatnumber.pipe';
import {FullWidthPipe} from './full-width.pipe';
import {ToDatePipe} from './to-date.pipe';


@NgModule({
  declarations: [
    FormatnumberPipe,
    FullWidthPipe,
    ToDatePipe
   ],
  imports: [
    CommonModule
  ],
    exports: [
      FormatnumberPipe,
      FullWidthPipe,
      ToDatePipe
    ]
})
export class ToolsModule {
}
