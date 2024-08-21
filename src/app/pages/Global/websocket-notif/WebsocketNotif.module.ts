import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AppRoutingModule} from '../../../app.routing';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LoggerModule} from 'ngx-logger';
import {environment} from '../../../../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModuleModule} from '../shared-module/shared-module.module';
import {DxSwitchModule} from 'devextreme-angular';
import {headerComponentsModules} from '../header-components/header-components.modules';
import {AppComponent} from '../../../app.component';
import {PagesComponent} from '../../pages.component';
import {HeaderComponent} from '../../../theme/components/header/header.component';
import {FooterComponent} from '../../../theme/components/footer/footer.component';
import {SidebarComponent} from '../../../theme/components/sidebar/sidebar.component';
import {VerticalMenuComponent} from '../../../theme/components/menu/vertical-menu/vertical-menu.component';
import {HorizontalMenuComponent} from '../../../theme/components/menu/horizontal-menu/horizontal-menu.component';
import {BreadcrumbComponent} from '../../../theme/components/breadcrumb/breadcrumb.component';
import {BackTopComponent} from '../../../theme/components/back-top/back-top.component';
import {UserMenuComponent} from '../../../theme/components/user-menu/user-menu.component';
// import {BlankComponent} from '../../blank/blank.component';
import {NotFoundComponent} from '../errors/not-found/not-found.component';
import {FlagsMenuComponent} from '../../../theme/components/flags-menu/flags-menu.component';
import {ProfilesComponent} from '../../../theme/components/profiles/profiles.component';
import {AffectationRoutesComponent} from '../affectation-routes/affectation-routes.component';
import {CookieService} from 'ngx-cookie-service';
import {AppSettings} from '../../../app.settings';
import {EnvServiceProvider} from '../../../../env.service.provider';
import {WsServiceProvider} from '../../../../ws.service.provider';
import {HttpLoaderFactory} from '../../../app.module';
import {WebsocketNotifComponent} from './websocket-notif.component';

@NgModule({
    imports: [
        BrowserModule,
        PerfectScrollbarModule,
        AppRoutingModule,
        HttpClientModule,
    ],
    declarations: [
        WebsocketNotifComponent
    ],
    providers: [
    ],
    exports: [
        ToastrModule,


    ],

})
export class AppModule {
}
