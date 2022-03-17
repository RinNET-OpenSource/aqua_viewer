import {RouterModule, Routes} from '@angular/router';
import {V1ProfileComponent} from './v1-profile/v1-profile.component';
import {V1RatingComponent} from './v1-rating/v1-rating.component';
import {V1RecentComponent} from './v1-recent/v1-recent.component';
import {V1SettingComponent} from './v1-setting/v1-setting.component';
import {V1SonglistComponent} from './v1-songlist/v1-songlist.component';
import {V1CharacterComponent} from './v1-character/v1-character.component';
import {V1SongDetailComponent} from './v1-song-detail/v1-song-detail.component';
import {V1SongPlaylogComponent} from './v1-song-playlog/v1-song-playlog.component';

const routes: Routes = [
  {path: 'profile', component: V1ProfileComponent},
  {path: 'rating', component: V1RatingComponent},
  {path: 'recent', component: V1RecentComponent},
  {path: 'song', component: V1SonglistComponent},
  {path: 'song/:id', component: V1SongDetailComponent},
  {path: 'song/:id/:level', component: V1SongPlaylogComponent},
  {path: 'character', component: V1CharacterComponent},
  {path: 'setting', component: V1SettingComponent},
];

export const V1Routes = RouterModule.forChild(routes);
