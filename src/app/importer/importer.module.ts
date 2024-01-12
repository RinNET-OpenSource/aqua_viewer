import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImporterComponent} from './importer/importer.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
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
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,TranslateModule.forChild({
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
