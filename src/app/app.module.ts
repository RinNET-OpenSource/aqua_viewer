import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DivaModule} from './sega/diva/diva.module';
import {V1Module} from './sega/chunithm/v1/v1.module';
import {V2Module} from './sega/chunithm/v2/v2.module';
import {DatabaseModule} from './database/database.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {OngekiModule} from './sega/ongeki/ongeki.module';
import {Maimai2Module} from './sega/maimai2/maimai2.module';
import {ErrorInterceptorService} from './auth/error-interceptor.service';
import {LoadingInterceptorService} from './auth/loading-interceptor.service';
import {ImporterModule} from './importer/importer.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {
  Maimai2UploadUserPortraitDialog
} from './sega/maimai2/maimai2-setting/maimai2-upload-user-portrait/maimai2-upload-user-portrait.dialog';

import Aegis from 'aegis-web-sdk';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SignUpComponent} from './home/sign-up/sign-up.component';
import {LoginComponent} from './home/login/login.component';
import {TokenInterceptorService} from './auth/token-interceptor.service';
import {NgIconsModule} from '@ng-icons/core';
import {HomeComponent} from './home/home.component';
import {ToastsContainer} from './toasts-container.component';
import {PasswordResetComponent} from './home/password-reset/password-reset.component';
import {CardsComponent} from './cards/cards.component';
import {
  bootstrapChevronDown,
  bootstrapPerson,
  bootstrapList,
  bootstrapEye,
  bootstrapEyeSlash,
  bootstrapTrash,
  bootstrapPencilSquare,
  bootstrapDatabase,
  bootstrapSunFill,
  bootstrapStars
} from '@ng-icons/bootstrap-icons';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import {APP_INITIALIZER} from '@angular/core';

const aegis = new Aegis({
  id: 'j4KOYFL0VyajP4KjdG', // 上报 id
  uin: 'xxx', // 用户唯一 ID（可选）
  reportApiSpeed: true, // 接口测速
  reportAssetSpeed: true, // 静态资源测速
  spa: true // spa 应用页面跳转的时候开启 pv 计算
});

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function initializeApp(translateService: TranslateService) {
  return () => {
    const supportedLangs = ['en', 'zh'];
    let userLang = 'en';

    const browserLangs = navigator.languages || [navigator.language];
    for (let lang of browserLangs) {
      const baseLang = lang.split('-')[0];
      if (supportedLangs.includes(baseLang)) {
        userLang = baseLang;
        break;
      }
    }
    
    return translateService.use(userLang).toPromise();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    Maimai2UploadUserPortraitDialog,
    SignUpComponent,
    LoginComponent,
    HomeComponent,
    PasswordResetComponent,
    CardsComponent
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
    NgbModule,
    FormsModule,
    ToastsContainer,
    NgIconsModule.withIcons({
      bootstrapChevronDown,
      bootstrapPerson,
      bootstrapList,
      bootstrapEye,
      bootstrapEyeSlash,
      bootstrapTrash,
      bootstrapPencilSquare,
      bootstrapDatabase,
      bootstrapSunFill,
      bootstrapStars
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    {provide: APP_INITIALIZER, useFactory: initializeApp, deps: [TranslateService], multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
