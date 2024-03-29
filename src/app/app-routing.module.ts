import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuardService} from './auth/auth-guard.service';
import {ImporterComponent} from './importer/importer/importer.component';
import {SignUpComponent} from './home/sign-up/sign-up.component';
import {HomeComponent} from './home/home.component';
import {CardsComponent} from './cards/cards.component';
import {KeychipComponent} from './keychip/keychip.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {GithubComponent} from './auth/oauth-callback/github/github.component';
import {ContributorsComponent} from './contributors/contributors.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'oauth-callback/github', component: GithubComponent},
  {path: 'cards', component: CardsComponent, canActivate: [AuthGuardService]},
  {path: 'keychip', component: KeychipComponent, canActivate: [AuthGuardService]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'import', component: ImporterComponent, canActivate: [AuthGuardService]},
  {path: 'contributors', component: ContributorsComponent},
  {path: 'ongeki', loadChildren: () => import('./sega/ongeki/ongeki.module').then(mod => mod.OngekiModule), canLoad: [AuthGuardService]},
  {path: 'mai2', loadChildren: () => import('./sega/maimai2/maimai2.module').then(mod => mod.Maimai2Module), canLoad: [AuthGuardService]},
  {
    path: 'chuni/v2',
    loadChildren: () => import('./sega/chunithm/v2/v2.module').then(mod => mod.V2Module),
    canLoad: [AuthGuardService]
  },
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
