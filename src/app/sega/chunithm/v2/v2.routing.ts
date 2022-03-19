import {RouterModule, Routes} from '@angular/router';
import {V2ProfileComponent} from './v2-profile/v2-profile.component';
import {V2RatingComponent} from './v2-rating/v2-rating.component';
import {V2RecentComponent} from './v2-recent/v2-recent.component';
import {V2SettingComponent} from './v2-setting/v2-setting.component';
import {V2SonglistComponent} from './v2-songlist/v2-songlist.component';
import {V2CharacterComponent} from './v2-character/v2-character.component';
import {V2SongDetailComponent} from './v2-song-detail/v2-song-detail.component';
import {V2SongPlaylogComponent} from './v2-song-playlog/v2-song-playlog.component';
import {V2UserBoxComponent} from './v2-userbox/v2-userbox.component';

const routes: Routes = [
  {path: 'profile', component: V2ProfileComponent},
  {path: 'rating', component: V2RatingComponent},
  {path: 'recent', component: V2RecentComponent},
  {path: 'song', component: V2SonglistComponent},
  {path: 'song/:id', component: V2SongDetailComponent},
  {path: 'song/:id/:level', component: V2SongPlaylogComponent},
  {path: 'character', component: V2CharacterComponent},
  {path: 'setting', component: V2SettingComponent},
  {path: 'userbox', component: V2UserBoxComponent},
];

export const V2Routes = RouterModule.forChild(routes);
