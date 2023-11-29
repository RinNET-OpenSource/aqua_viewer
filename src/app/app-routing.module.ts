import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuardService} from './auth/auth-guard.service';
import {ChangelogComponent} from './changelog/changelog.component';
import {ImporterComponent} from './importer/importer/importer.component';
import {SignUpComponent} from './home/sign-up/sign-up.component';
import {HomeComponent} from './home/home.component';
import {CardsComponent} from './cards/cards.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'cards', component: CardsComponent, canActivate: [AuthGuardService]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'changelog', component: ChangelogComponent},
  {path: 'import', component: ImporterComponent},
  {path: 'diva', loadChildren: () => import('./sega/diva/diva.module').then(mod => mod.DivaModule), canLoad: [AuthGuardService]},
  {path: 'ongeki', loadChildren: () => import('./sega/ongeki/ongeki.module').then(mod => mod.OngekiModule), canLoad: [AuthGuardService]},
  {path: 'mai2', loadChildren: () => import('./sega/maimai2/maimai2.module').then(mod => mod.Maimai2Module), canLoad: [AuthGuardService]},
  {
    path: 'chuni/v1',
    loadChildren: () => import('./sega/chunithm/v1/v1.module').then(mod => mod.V1Module),
    canLoad: [AuthGuardService]
  },
  {
    path: 'chuni/v2',
    loadChildren: () => import('./sega/chunithm/v2/v2.module').then(mod => mod.V2Module),
    canLoad: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
