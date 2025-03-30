import {RouterModule, Routes} from '@angular/router';
import {OngekiProfileComponent} from './ongeki-profile/ongeki-profile.component';
import {OngekiRecentComponent} from './ongeki-recent/ongeki-recent.component';
import {OngekiSongListComponent} from './ongeki-song-list/ongeki-song-list.component';
import {OngekiBattlePointComponent} from './ongeki-battle-point/ongeki-battle-point.component';
import {OngekiRatingComponent} from './ongeki-rating/ongeki-rating.component';
import {OngekiSettingComponent} from './ongeki-setting/ongeki-setting.component';
import {OngekiRivalListComponent} from './ongeki-rival-list/ongeki-rival-list.component';
import {OngekiMusicRankingComponent} from './ongeki-music-ranking/ongeki-music-ranking.component';
import {OngekiUserRankingComponent} from './ongeki-user-ranking/ongeki-user-ranking.component';
import {OngekiCardGalleryComponent} from './ongeki-card-gallery/ongeki-card-gallery.component';
import {OngekiCardComponent} from './ongeki-card/ongeki-card.component';


const routes: Routes = [
  {path: 'profile', component: OngekiProfileComponent, data: {title: 'Profile'}},
  {path: 'recent', component: OngekiRecentComponent, data: {title: 'Recent'}},
  {path: 'song', component: OngekiSongListComponent, data: {title: 'MusicList'}},
  {path: 'battle', component: OngekiBattlePointComponent, data: {title: 'Battle'}},
  {path: 'rating', component: OngekiRatingComponent, data: {title: 'Rating'}},
  {path: 'card/gallery', component: OngekiCardGalleryComponent, data: {title: 'CardGallery'}},
  {path: 'card', component: OngekiCardComponent, data: {title: 'Card'}},
  {path: 'rival', component: OngekiRivalListComponent, data: {title: 'Rival'}},
  {path: 'musicRanking', component: OngekiMusicRankingComponent, data: {title: 'MusicRanking'}},
  {path: 'userRanking', component: OngekiUserRankingComponent, data: {title: 'UserRanking'}},
  {path: 'settings', component: OngekiSettingComponent, data: {title: 'Settings'}}
];

export const OngekiRoutes = RouterModule.forChild(routes);
