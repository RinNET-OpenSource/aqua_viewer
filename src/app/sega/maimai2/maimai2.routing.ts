import {RouterModule, Routes} from '@angular/router';
import {Maimai2ProfileComponent} from './maimai2-profile/maimai2-profile.component';
import {Maimai2SettingComponent} from './maimai2-setting/maimai2-setting.component';


const routes: Routes = [
  {path: 'profile', component: Maimai2ProfileComponent},
  {path: 'setting', component: Maimai2SettingComponent},
];

export const Maimai2Routes = RouterModule.forChild(routes);
