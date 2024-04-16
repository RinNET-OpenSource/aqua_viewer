import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuardService} from './auth/auth-guard.service';
import {ImporterComponent} from './importer/importer/importer.component';
import {HomeComponent} from './home/home.component';
import {CardsComponent} from './cards/cards.component';
import {KeychipComponent} from './keychip/keychip.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {ContributorsComponent} from './contributors/contributors.component';
import {OauthCallbackComponent} from './oauth-callback/oauth-callback.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginGuardService } from './auth/login-guard.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';

const routes: Routes = [
  {path: '', component: HomeComponent, data: { disableSidebar: true }},
  {path: 'cards', component: CardsComponent, canActivate: [AuthGuardService]},
  {path: 'keychip', component: KeychipComponent, canActivate: [AuthGuardService]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'import', component: ImporterComponent, canActivate: [AuthGuardService]},
  {path: 'contributors', component: ContributorsComponent, data: { disableSidebar: true }},
  {path: 'ongeki', loadChildren: () => import('./sega/ongeki/ongeki.module').then(mod => mod.OngekiModule), canLoad: [AuthGuardService]},
  {path: 'mai2', loadChildren: () => import('./sega/maimai2/maimai2.module').then(mod => mod.Maimai2Module), canLoad: [AuthGuardService]},
  {path: 'chuni/v2', loadChildren: () => import('./sega/chunithm/v2/v2.module').then(mod => mod.V2Module), canLoad: [AuthGuardService]},
  {path: 'oauth-callback/:type', component: OauthCallbackComponent, data: { disableSidebar: true }},
  {path: 'sign-in', component: SignInComponent, canActivate: [LoginGuardService], data: { disableSidebar: true }},
  {path: 'sign-up', component: SignUpComponent, canActivate: [LoginGuardService], data: { disableSidebar: true }},
  {path: 'password-reset', component: PasswordResetComponent, canActivate: [LoginGuardService], data: { disableSidebar: true }},
  {path: 'not-found', component: NotFoundComponent, data: { disableSidebar: true }},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
