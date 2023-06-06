import {NgModule} from '@angular/core';

import {DashboardComponent} from './dashboard.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    MatCardModule,
    MatButtonModule,
    NgForOf,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [],
  declarations: [DashboardComponent],
  providers: [],
})
export class DashboardModule {
}
