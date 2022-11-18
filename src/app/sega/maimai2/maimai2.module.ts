import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Maimai2Routes} from './maimai2.routing';
import {Maimai2ProfileComponent} from './maimai2-profile/maimai2-profile.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {NgxPaginationModule} from 'ngx-pagination';
import {ToolsModule} from '../../util/tools.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Maimai2SettingComponent} from './maimai2-setting/maimai2-setting.component';
import { Maimai2NameSettingDialog } from './maimai2-setting/maimai2-name-setting/maimai2-name-setting.dialog';


@NgModule({
  declarations: [
    Maimai2ProfileComponent,
    Maimai2SettingComponent,
    Maimai2NameSettingDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    Maimai2Routes,

    MatCardModule,
    NgxPaginationModule,
    MatButtonModule,
    ToolsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    FlexLayoutModule
  ]
})
export class Maimai2Module {
}
