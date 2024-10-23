import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessageModule} from './message/message.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
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
import {TokenInterceptorService} from './auth/token-interceptor.service';
import {NgIconsModule} from '@ng-icons/core';
import {HomeComponent} from './home/home.component';
import {ToastsContainer} from './toasts-container.component';
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
  bootstrapSun,
  bootstrapStars,
  bootstrapTranslate,
  bootstrapCircleHalf,
  bootstrapExclamationTriangleFill,
  bootstrapClipboard,
  bootstrapPlusSquareDotted,
  bootstrapInfoCircleFill,
  bootstrapGithub
} from '@ng-icons/bootstrap-icons';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { LanguageService } from './language.service';
import { lastValueFrom } from 'rxjs';
import { KeychipComponent } from './keychip/keychip.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { OauthCallbackComponent } from './oauth-callback/oauth-callback.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ProfileComponent } from './profile/profile.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { EditComponent } from './announcements/edit/edit.component';

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

export function initializeApp(
  translateService: TranslateService,
  languageService: LanguageService) {
    return async () => {
      const userLang = languageService.getCurrentLang();
      await lastValueFrom(translateService.use(userLang));
    };
}

@NgModule({
  declarations: [
    AppComponent,
    Maimai2UploadUserPortraitDialog,
    SignUpComponent,
    HomeComponent,
    PasswordResetComponent,
    CardsComponent,
    NotFoundComponent,
    ContributorsComponent,
    KeychipComponent,
    OauthCallbackComponent,
    SignInComponent,
    ProfileComponent,
    AnnouncementsComponent,
    EditComponent
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
    V2Module,
    OngekiModule,
    Maimai2Module,

    ReactiveFormsModule,
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
      bootstrapSun,
      bootstrapStars,
      bootstrapTranslate,
      bootstrapCircleHalf,
      bootstrapExclamationTriangleFill,
      bootstrapClipboard,
      bootstrapPlusSquareDotted,
      bootstrapInfoCircleFill,
      bootstrapGithub
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),
    ClipboardModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    {provide: APP_INITIALIZER, useFactory: initializeApp, deps: [TranslateService, LanguageService], multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
