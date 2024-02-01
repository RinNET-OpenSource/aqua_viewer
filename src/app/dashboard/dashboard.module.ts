import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient } from '@angular/common/http';
import {NgIconsModule} from '@ng-icons/core';
import {
  bootstrapBell,
  bootstrapCheckLg,
  bootstrapXLg
} from '@ng-icons/bootstrap-icons';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgIconsModule.withIcons({
      bootstrapBell,
      bootstrapCheckLg,
      bootstrapXLg
    })
  ],
  exports: [],
  declarations: [DashboardComponent],
  providers: [],
})
export class DashboardModule {
}
