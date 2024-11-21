import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImporterComponent} from './importer/importer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [ImporterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class ImporterModule {
}
