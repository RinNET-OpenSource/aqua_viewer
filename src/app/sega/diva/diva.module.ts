import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DivaProfileComponent} from './diva-profile/diva-profile.component';
import {DivaRoutes} from './diva.routing';
import {DivaRecentComponent} from './diva-recent/diva-recent.component';
import {DivaDecimalPipe} from './util/diva-decimal.pipe';
import {DivaSettingComponent} from './diva-setting/diva-setting.component';
import {DivaNameSettingDialog} from './diva-setting/diva-name-setting/diva-name-setting.dialog';
import {DivaTitleSettingDialog} from './diva-setting/diva-title-setting/diva-title-setting.dialog';
import {DivaPlateSettingDialog} from './diva-setting/diva-plate-setting/diva-plate-setting.dialog';
import {DivaMylistSettingDialog} from './diva-setting/diva-mylist-setting/diva-mylist-setting.dialog';
import {DivaSeSettingDialog} from './diva-setting/diva-se-setting/diva-se-setting.dialog';
import {DivaDisplaySettingDialog} from './diva-setting/diva-display-setting/diva-display-setting.dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DivaSkinSettingDialog} from './diva-setting/diva-skin-setting/diva-skin-setting.dialog';
import {DivaPvRecordComponent} from './diva-pv-record/diva-pv-record.component';
import {DivaRecordDetailComponent} from './diva-record-detail/diva-record-detail.component';
import {DivaManagementComponent} from './diva-management/diva-management/diva-management.component';
import {DivaFestaComponent} from './diva-management/diva-festa/diva-festa.component';
import {DivaFestaEditComponent} from './diva-management/diva-festa/diva-festa-edit/diva-festa-edit.component';
import {DivaContestComponent} from './diva-management/diva-contest/diva-contest.component';
import {DivaContestEditComponent} from './diva-management/diva-contest/diva-contest-edit/diva-contest-edit.component';
import {DivaModulesComponent} from './diva-modules/diva-modules.component';
import {DivaNewsComponent} from './diva-management/diva-news/diva-news.component';
import {DivaCustomizeComponent} from './diva-customize/diva-customize.component';
import {DivaRivalSettingDialog} from './diva-setting/diva-rival-setting/diva-rival-setting.dialog';
import {NgxPaginationModule} from 'ngx-pagination';
import {DivaPvlistComponent} from './diva-pvlist/diva-pvlist.component';


@NgModule({
    declarations: [
        DivaProfileComponent,
        DivaPvRecordComponent,
        DivaRecentComponent,
        DivaDecimalPipe,
        DivaSettingComponent,
        DivaRecordDetailComponent,
        DivaNameSettingDialog,
        DivaTitleSettingDialog,
        DivaPlateSettingDialog,
        DivaSkinSettingDialog,
        DivaMylistSettingDialog,
        DivaSeSettingDialog,
        DivaDisplaySettingDialog,
        DivaRivalSettingDialog,
        DivaManagementComponent,
        DivaFestaComponent,
        DivaFestaEditComponent,
        DivaContestComponent,
        DivaContestEditComponent,
        DivaModulesComponent,
        DivaNewsComponent,
        DivaCustomizeComponent,
        DivaPvlistComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        DivaRoutes,
        MatFormFieldModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatDatepickerModule,
        NgxPaginationModule
    ]
})
export class DivaModule {
}
