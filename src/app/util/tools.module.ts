import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormatnumberPipe} from './formatnumber.pipe';
import {FullWidthPipe} from './full-width.pipe';


@NgModule({
  declarations: [
    FormatnumberPipe,
    FullWidthPipe
   ],
  imports: [
    CommonModule
  ],
  exports: [
    FormatnumberPipe,
    FullWidthPipe
  ]
})
export class ToolsModule {
}
