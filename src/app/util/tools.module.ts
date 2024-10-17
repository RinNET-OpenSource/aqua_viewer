import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormatnumberPipe} from './formatnumber.pipe';
import {FullWidthPipe} from './full-width.pipe';
import {ToDatePipe} from './to-date.pipe';
import { OrdinalPipe } from './ordinal.pipe';


@NgModule({
  declarations: [
    FormatnumberPipe,
    FullWidthPipe,
    ToDatePipe,
    OrdinalPipe
   ],
  imports: [
    CommonModule
  ],
  exports: [
    FormatnumberPipe,
    FullWidthPipe,
    ToDatePipe,
    OrdinalPipe
  ]
})
export class ToolsModule {
}
