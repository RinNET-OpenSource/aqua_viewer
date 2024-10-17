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
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LoginGuardService} from './auth/login-guard.service';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {ProfileComponent} from './profile/profile.component';
import {AnnouncementsComponent} from './announcements/announcements.component';
import {EditComponent} from "./announcements/edit/edit.component";

const routes: Routes = [
  {path: '', component: HomeComponent, data: {title: 'Home', disableSidebar: true }},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], data: {title: 'Profile'}},
  {path: 'cards', component: CardsComponent, canActivate: [AuthGuardService], data: {title: 'Cards'}},
  {path: 'keychip', component: KeychipComponent, canActivate: [AuthGuardService], data: {title: 'Keychip'}},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService], data: {title: 'Dashboard'}},
  {path: 'import', component: ImporterComponent, canActivate: [AuthGuardService], data: {title: 'Import'}},
  {path: 'announcements', component: AnnouncementsComponent, canActivate: [AuthGuardService], data: {title: 'Announcements'}},
  {path: 'announcements/edit', component: EditComponent, canActivate: [AuthGuardService], data: {title: 'EditAnnouncements'}},
  {path: 'contributors', component: ContributorsComponent, data: {title: 'Contributors', disableSidebar: true }},
  {path: 'ongeki', loadChildren: () => import('./sega/ongeki/ongeki.module').then(mod => mod.OngekiModule), canMatch: [AuthGuardService], data: {title: 'Ongeki'}},
  {path: 'mai2', loadChildren: () => import('./sega/maimai2/maimai2.module').then(mod => mod.Maimai2Module), canMatch: [AuthGuardService], data: {title: 'Mai2'}},
  {path: 'chuni/v2', loadChildren: () => import('./sega/chunithm/v2/v2.module').then(mod => mod.V2Module), canMatch: [AuthGuardService], data: {title: 'ChuniV2'}},
  {path: 'oauth-callback/:type', component: OauthCallbackComponent, data: {title: 'OAuthCallback', disableSidebar: true }},
  {path: 'sign-in', component: SignInComponent, canActivate: [LoginGuardService], data: {title: 'SignIn', disableSidebar: true }},
  {path: 'sign-up', component: SignUpComponent, canActivate: [LoginGuardService], data: {title: 'SignUp', disableSidebar: true }},
  {path: 'password-reset', component: PasswordResetComponent, canActivate: [LoginGuardService], data: {title: 'ResetPassword', disableSidebar: true }},
  {path: 'not-found', component: NotFoundComponent, data: {title: 'NotFound', disableSidebar: true }},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
