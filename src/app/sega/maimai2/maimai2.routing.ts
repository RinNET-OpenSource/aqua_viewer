import {RouterModule, Routes} from '@angular/router';
import {Maimai2ProfileComponent} from './maimai2-profile/maimai2-profile.component';
import {Maimai2SettingComponent} from './maimai2-setting/maimai2-setting.component';
import {Maimai2RatingComponent} from './maimai2-rating/maimai2-rating.component';
import {Maimai2RecentComponent} from './maimai2-recent/maimai2-recent.component';


const routes: Routes = [
  {path: 'profile', component: Maimai2ProfileComponent},
  {path: 'setting', component: Maimai2SettingComponent},
  {path: 'recent', component: Maimai2RecentComponent},
  {path: 'rating', component: Maimai2RatingComponent},
];

export const Maimai2Routes = RouterModule.forChild(routes);
