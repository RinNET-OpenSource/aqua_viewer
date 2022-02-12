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
import {AmazonRoutes} from './amazon.routing';
import {AmazonProfileComponent} from './amazon-profile/amazon-profile.component';
import {AmazonRatingComponent} from './amazon-rating/amazon-rating.component';
import {ToRatingPipe} from './util/to-rating.pipe';
import {RatingClass} from './util/rating-class.pipe';
import {CourceIdToClassPipe} from './util/cource-id-to-class.pipe';
import {AmazonRecentComponent} from './amazon-recent/amazon-recent.component';
import {ToRankPipe} from './util/to-rank.pipe';
import {AmazonSettingComponent} from './amazon-setting/amazon-setting.component';
import {AmazonNameSettingDialog} from './amazon-setting/amazon-name-setting/amazon-name-setting.dialog';
import {AmazonCharacterComponent} from './amazon-character/amazon-character.component';
import {AmazonSonglistComponent} from './amazon-songlist/amazon-songlist.component';
import {AmazonSongDetailComponent} from './amazon-song-detail/amazon-song-detail.component';
import {AmazonSongPlaylogComponent} from './amazon-song-playlog/amazon-song-playlog.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ToolsModule} from '../../../util/tools.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AmazonRoutes,
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
        AmazonProfileComponent,
        AmazonRatingComponent,
        ToRatingPipe,
        RatingClass,
        CourceIdToClassPipe,
        AmazonRecentComponent,
        ToRankPipe,
        AmazonSettingComponent,
        AmazonNameSettingDialog,
        AmazonCharacterComponent,
        AmazonSonglistComponent,
        AmazonSongDetailComponent,
        AmazonSongPlaylogComponent
    ]
})
export class AmazonModule {
}
