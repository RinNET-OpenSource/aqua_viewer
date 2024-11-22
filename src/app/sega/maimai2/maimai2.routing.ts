import {RouterModule, Routes} from '@angular/router';
import {Maimai2ProfileComponent} from './maimai2-profile/maimai2-profile.component';
import {Maimai2SettingComponent} from './maimai2-setting/maimai2-setting.component';
import {Maimai2RatingComponent} from './maimai2-rating/maimai2-rating.component';
import {Maimai2RecentComponent} from './maimai2-recent/maimai2-recent.component';
import {Maimai2PhotosComponent} from './maimai2-photos/maimai2-photos.component';
import {Maimai2DxpassComponent} from './maimai2-dxpass/maimai2-dxpass.component';


const routes: Routes = [
  {path: 'profile', component: Maimai2ProfileComponent, data: {title: 'Profile'}},
  {path: 'setting', component: Maimai2SettingComponent, data: {title: 'Settings'}},
  {path: 'recent', component: Maimai2RecentComponent, data: {title: 'Recent'}},
  {path: 'rating', component: Maimai2RatingComponent, data: {title: 'Rating'}},
  {path: 'photos', component: Maimai2PhotosComponent, data: {title: 'Photos'}},
  {path: 'dxpass', component: Maimai2DxpassComponent, data: {title: 'DxPass'}}
];

export const Maimai2Routes = RouterModule.forChild(routes);
