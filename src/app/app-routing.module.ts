import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuardService} from './auth/auth-guard.service';
import {ChangelogComponent} from './changelog/changelog.component';
import {ImporterComponent} from './importer/importer/importer.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'changelog', component: ChangelogComponent},
  {path: 'import', component: ImporterComponent},
  {path: 'diva', loadChildren: () => import('./sega/diva/diva.module').then(mod => mod.DivaModule), canLoad: [AuthGuardService]},
  {path: 'ongeki', loadChildren: () => import('./sega/ongeki/ongeki.module').then(mod => mod.OngekiModule), canLoad: [AuthGuardService]},
  {
    path: 'v1',
    loadChildren: () => import('./sega/chunithm/v1/v1.module').then(mod => mod.V1Module),
    canLoad: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
