import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {OngekiRoutes} from './ongeki.routing';
import {OngekiProfileComponent} from './ongeki-profile/ongeki-profile.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {OngekiCardComponent} from './ongeki-card/ongeki-card.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {OngekiCardListComponent} from './ongeki-card-list/ongeki-card-list.component';
import {OngekiRecentComponent} from './ongeki-recent/ongeki-recent.component';
import {ToolsModule} from '../../util/tools.module';
import {ToAttributeClassPipe} from './util/to-attribute-class.pipe';
import {OngekiSongListComponent} from './ongeki-song-list/ongeki-song-list.component';
import {OngekiRivalListComponent} from './ongeki-rival-list/ongeki-rival-list.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {OngekiBattlePointComponent} from './ongeki-battle-point/ongeki-battle-point.component';
import {OngekiRatingComponent} from './ongeki-rating/ongeki-rating.component';
import {ToLevelDecimalPipe} from './util/to-level-decimal.pipe';
import {ToBattleSpritePipe} from './util/to-battle-sprite.pipe';
import {ToTechSpritePipe} from './util/to-tech-sprite.pipe';
import {OngekiCardGachaComponent} from './ongeki-card-gacha/ongeki-card-gacha.component';
import {OngekiSettingComponent} from './ongeki-setting/ongeki-setting.component';
import {OngekiMusicRankingComponent} from './ongeki-music-ranking/ongeki-music-ranking.component';
import {MatSortModule} from '@angular/material/sort';
import {OngekiUserRankingComponent} from './ongeki-user-ranking/ongeki-user-ranking.component';
import {ToTechRatingPipe} from './util/to-tech-rating.pipe';
import {OngekiRecentItemComponent} from './ongeki-recent-item/ongeki-recent-item.component';
import {ToRaritySpritePipe} from './util/to-rarity-sprite.pipe';
import {NgbAccordionModule, NgbPopoverModule, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {OngekiCardLevelComponent} from './ongeki-card-level/ongeki-card-level.component';

@NgModule({
  declarations: [
    OngekiProfileComponent,
    OngekiCardComponent,
    OngekiCardListComponent,
    OngekiRecentComponent,
    ToAttributeClassPipe,
    OngekiSongListComponent,
    OngekiBattlePointComponent,
    OngekiRatingComponent,
    OngekiRivalListComponent,
    OngekiMusicRankingComponent,
    OngekiUserRankingComponent,
    ToLevelDecimalPipe,
    ToBattleSpritePipe,
    ToTechSpritePipe,
    ToTechRatingPipe,
    OngekiCardGachaComponent,
    OngekiSettingComponent,
    OngekiRecentItemComponent,
    ToRaritySpritePipe,
    OngekiCardLevelComponent
  ],
    exports: [
        OngekiCardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        OngekiRoutes,

        MatCardModule,
        NgxPaginationModule,
        MatButtonModule,
        ToolsModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        FlexLayoutModule,
        MatSortModule,
        NgbAccordionModule,
        NgbCollapseModule,
        NgbPopoverModule
    ]
})
export class OngekiModule {
}
