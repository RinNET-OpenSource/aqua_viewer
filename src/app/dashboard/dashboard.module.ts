import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient } from '@angular/common/http';
import {NgIconsModule} from '@ng-icons/core';
import {
  bootstrapBell,
  bootstrapCheckLg,
  bootstrapXLg
} from '@ng-icons/bootstrap-icons';
import { AppRoutingModule } from '../app-routing.module';
import { AnnouncementComponent } from '../announcements/announcement/announcement.component';
import { ToolsModule } from '../util/tools.module';
import {V2Module} from '../sega/chunithm/v2/v2.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
    exports: [],
    declarations: [DashboardComponent, AnnouncementComponent],
    providers: [],
    imports: [
        AppRoutingModule,
        CommonModule,
        NgForOf,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        NgIconsModule.withIcons({
            bootstrapBell,
            bootstrapCheckLg,
            bootstrapXLg
        }),
        ToolsModule,
        V2Module
    ]
})
export class DashboardModule {
}
