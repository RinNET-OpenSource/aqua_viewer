import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {TranslateModule} from "@ngx-translate/core";
import {Maimai2RatingComponent} from "./maimai2-rating/maimai2-rating.component";
import {Maimai2RecentComponent} from "./maimai2-recent/maimai2-recent.component";
import {NgbCollapse} from '@ng-bootstrap/ng-bootstrap';
import {Maimai2PhotosComponent} from "./maimai2-photos/maimai2-photos.component";
import { Maimai2DxpassComponent } from './maimai2-dxpass/maimai2-dxpass.component';


@NgModule({
  declarations: [
    Maimai2ProfileComponent,
    Maimai2SettingComponent,
    Maimai2RatingComponent,
    Maimai2RecentComponent,
    Maimai2PhotosComponent,
    Maimai2NameSettingDialog,
    Maimai2DxpassComponent
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
        FlexLayoutModule,
        TranslateModule,
        ReactiveFormsModule,
        NgOptimizedImage,
        NgbCollapse
    ]
})
export class Maimai2Module {
}
