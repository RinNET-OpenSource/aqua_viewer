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
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {V1Routes} from './v1.routing';
import {V1ProfileComponent} from './v1-profile/v1-profile.component';
import {V1RatingComponent} from './v1-rating/v1-rating.component';
import {ToRatingPipe} from './util/to-rating.pipe';
import {RatingClass} from './util/rating-class.pipe';
import {CourceIdToClassPipe} from './util/cource-id-to-class.pipe';
import {V1RecentComponent} from './v1-recent/v1-recent.component';
import {ToRankPipe} from './util/to-rank.pipe';
import {V1SettingComponent} from './v1-setting/v1-setting.component';
import {V1NameSettingDialog} from './v1-setting/v1-name-setting/v1-name-setting.dialog';
import {V1CharacterComponent} from './v1-character/v1-character.component';
import {V1SonglistComponent} from './v1-songlist/v1-songlist.component';
import {V1SongDetailComponent} from './v1-song-detail/v1-song-detail.component';
import {V1SongPlaylogComponent} from './v1-song-playlog/v1-song-playlog.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ToolsModule} from '../../../util/tools.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        V1Routes,
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
        FlexLayoutModule,
        NgxPaginationModule,
        ToolsModule
    ],
    declarations: [
        V1ProfileComponent,
        V1RatingComponent,
        ToRatingPipe,
        RatingClass,
        CourceIdToClassPipe,
        V1RecentComponent,
        ToRankPipe,
        V1SettingComponent,
        V1NameSettingDialog,
        V1CharacterComponent,
        V1SonglistComponent,
        V1SongDetailComponent,
        V1SongPlaylogComponent
    ]
})
export class V1Module {
}
