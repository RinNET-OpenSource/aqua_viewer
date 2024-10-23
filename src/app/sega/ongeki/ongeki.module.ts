import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OngekiRoutes} from './ongeki.routing';
import {OngekiProfileComponent} from './ongeki-profile/ongeki-profile.component';
import {OngekiCardComponent} from './ongeki-card/ongeki-card.component';
import {NgxPaginationModule} from 'ngx-pagination';
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
import {OngekiSettingComponent} from './ongeki-setting/ongeki-setting.component';
import {OngekiMusicRankingComponent} from './ongeki-music-ranking/ongeki-music-ranking.component';
import {OngekiUserRankingComponent} from './ongeki-user-ranking/ongeki-user-ranking.component';
import {ToTechRatingPipe} from './util/to-tech-rating.pipe';
import {OngekiRecentItemComponent} from './ongeki-recent-item/ongeki-recent-item.component';
import {ToRaritySpritePipe} from './util/to-rarity-sprite.pipe';
import {NgbAccordionModule, NgbPopoverModule, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {OngekiCardLevelComponent} from './ongeki-card-level/ongeki-card-level.component';
import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient } from '@angular/common/http';
import { OngekiSongScoreRankingComponent } from './ongeki-song-score-ranking/ongeki-song-score-ranking.component';
import { ToTechHonorSpritePipe } from './util/to-tech-honor-sprite.pipe';
import {NgIconsModule} from '@ng-icons/core';
import {
  bootstrapStopFill
} from '@ng-icons/bootstrap-icons';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    OngekiProfileComponent,
    OngekiCardComponent,
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
    OngekiSettingComponent,
    OngekiRecentItemComponent,
    ToRaritySpritePipe,
    OngekiCardLevelComponent,
    OngekiSongScoreRankingComponent,
    ToTechHonorSpritePipe,
  ],
    exports: [
        OngekiCardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OngekiRoutes,

        NgxPaginationModule,
        ToolsModule,
        FlexLayoutModule,
        NgbAccordionModule,
        NgbCollapseModule,
        NgbPopoverModule,
        NgOptimizedImage,
        TranslateModule.forChild({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        NgIconsModule.withIcons({
          bootstrapStopFill
        }),
    ]
})
export class OngekiModule {
}
