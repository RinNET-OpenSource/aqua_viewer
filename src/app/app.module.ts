import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MessageModule} from './message/message.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {LoginModule} from './login/login.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DivaModule} from './sega/diva/diva.module';
import {V1Module} from './sega/chunithm/v1/v1.module';
import {V2Module} from './sega/chunithm/v2/v2.module';
import {DatabaseModule} from './database/database.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {OngekiModule} from './sega/ongeki/ongeki.module';
import { Maimai2Module } from './sega/maimai2/maimai2.module';
import {ErrorInterceptorService} from './auth/error-interceptor.service';
import {LoadingInterceptorService} from './auth/loading-interceptor.service';
import {ChangelogComponent} from './changelog/changelog.component';
import {ImporterModule} from './importer/importer.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import { Maimai2UploadUserPortraitDialog } from './sega/maimai2/maimai2-setting/maimai2-upload-user-portrait/maimai2-upload-user-portrait.dialog';
import { ToTechRatingPipe } from './sega/ongeki/util/to-tech-rating.pipe';

import Aegis from 'aegis-web-sdk';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const aegis = new Aegis({
  id: 'j4KOYFL0VyajP4KjdG', // 上报 id
  uin: 'xxx', // 用户唯一 ID（可选）
  reportApiSpeed: true, // 接口测速
  reportAssetSpeed: true, // 静态资源测速
  spa: true // spa 应用页面跳转的时候开启 pv 计算
});

@NgModule({
  declarations: [
    AppComponent,
    ChangelogComponent,
    Maimai2UploadUserPortraitDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    NgxPaginationModule,
    DatabaseModule,

    MessageModule,
    AppRoutingModule,
    DashboardModule,
    LoginModule,
    ImporterModule,
    DivaModule,
    V1Module,
    V2Module,
    OngekiModule,
    Maimai2Module,

    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatCardModule,
    MatDialogModule,
    MatGridListModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    NgbModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
