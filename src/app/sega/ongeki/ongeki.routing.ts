import {RouterModule, Routes} from '@angular/router';
import {OngekiProfileComponent} from './ongeki-profile/ongeki-profile.component';
import {OngekiCardComponent} from './ongeki-card/ongeki-card.component';
import {OngekiCardListComponent} from './ongeki-card-list/ongeki-card-list.component';
import {OngekiRecentComponent} from './ongeki-recent/ongeki-recent.component';
import {OngekiSongListComponent} from './ongeki-song-list/ongeki-song-list.component';
import {OngekiBattlePointComponent} from './ongeki-battle-point/ongeki-battle-point.component';
import {OngekiRatingComponent} from './ongeki-rating/ongeki-rating.component';
import {OngekiCardGachaComponent} from './ongeki-card-gacha/ongeki-card-gacha.component';
import {OngekiSettingComponent} from './ongeki-setting/ongeki-setting.component';
import {OngekiRivalListComponent} from './ongeki-rival-list/ongeki-rival-list.component';
import {OngekiMusicRankingComponent} from './ongeki-music-ranking/ongeki-music-ranking.component';
import {OngekiUserRankingComponent} from './ongeki-user-ranking/ongeki-user-ranking.component';
import {OngekiSongScoreRankingComponent} from './ongeki-song-score-ranking/ongeki-song-score-ranking.component';


const routes: Routes = [
  {path: 'profile', component: OngekiProfileComponent},
  {path: 'recent', component: OngekiRecentComponent},
  {path: 'song', component: OngekiSongListComponent},
  {path: 'battle', component: OngekiBattlePointComponent},
  {path: 'rating', component: OngekiRatingComponent},
  {path: 'card', component: OngekiCardComponent},
  {path: 'card/all', component: OngekiCardListComponent},
  {path: 'card/gacha', component: OngekiCardGachaComponent},
  {path: 'rival', component: OngekiRivalListComponent},
  {path: 'musicRanking', component: OngekiMusicRankingComponent},
  {path: 'userRanking', component: OngekiUserRankingComponent},
  {path: 'settings', component: OngekiSettingComponent},
  {path: 'song/ranking/:id/:level', component: OngekiSongScoreRankingComponent},
];

export const OngekiRoutes = RouterModule.forChild(routes);
