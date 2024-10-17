import {RouterModule, Routes} from '@angular/router';
import {Maimai2ProfileComponent} from './maimai2-profile/maimai2-profile.component';
import {Maimai2SettingComponent} from './maimai2-setting/maimai2-setting.component';
import {Maimai2RatingComponent} from './maimai2-rating/maimai2-rating.component';
import {Maimai2RecentComponent} from './maimai2-recent/maimai2-recent.component';


const routes: Routes = [
  {path: 'profile', component: Maimai2ProfileComponent, data: {title: 'Profile'}},
  {path: 'setting', component: Maimai2SettingComponent, data: {title: 'Settings'}},
  {path: 'recent', component: Maimai2RecentComponent, data: {title: 'Recent'}},
  {path: 'rating', component: Maimai2RatingComponent, data: {title: 'Rating'}},
];

export const Maimai2Routes = RouterModule.forChild(routes);
