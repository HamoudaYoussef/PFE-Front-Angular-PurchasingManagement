
import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AppRoutingModule} from './app.routing';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppSettings} from './app.settings';
import {AppComponent} from './app.component';
import {PagesComponent} from './pages/pages.component';
import {HeaderComponent} from './theme/components/header/header.component';
import {FooterComponent} from './theme/components/footer/footer.component';
import {SidebarComponent} from './theme/components/sidebar/sidebar.component';
import {VerticalMenuComponent} from './theme/components/menu/vertical-menu/vertical-menu.component';
import {HorizontalMenuComponent} from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import {BreadcrumbComponent} from './theme/components/breadcrumb/breadcrumb.component';
import {BackTopComponent} from './theme/components/back-top/back-top.component';
import {UserMenuComponent} from './theme/components/user-menu/user-menu.component';
import {NotFoundComponent} from './pages/Global/errors/not-found/not-found.component';
import {FlagsMenuComponent} from './theme/components/flags-menu/flags-menu.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EnvServiceProvider} from '../env.service.provider';
import {CookieService} from 'ngx-cookie-service';
import {LoggerModule} from 'ngx-logger';
import {environment} from '../environments/environment';
import {ProfilesComponent} from './theme/components/profiles/profiles.component';
import {ToastrModule} from 'ngx-toastr';
import {headerComponentsModules} from './pages/Global/header-components/header-components.modules';
import {WsServiceProvider} from "../ws.service.provider";
import {ConfigPstkModule} from "./pages/Global/config-pstk/config-pstk.module";
import {AffectationRoutesModule} from "./pages/Global/affectation-routes/affectation-routes.module";
import {TokenInterceptor} from "./core/auth/token.interceptor";
import { DxBoxModule, DxButtonModule, DxDataGridModule, DxFileUploaderModule, DxFormModule, DxHtmlEditorModule, DxListModule, DxLoadPanelModule, DxPopoverModule, DxPopupModule, DxScrollViewModule, DxSelectBoxModule, DxTemplateHost, DxTemplateModule, DxTextAreaModule, DxTextBoxModule, DxToastModule, DxToolbarModule, DxTooltipModule } from 'devextreme-angular';
import {DxiColumnModule, DxiItemModule, DxiRangeModule, DxoImageUploadModule, DxoPagerModule, DxoPagingModule, DxoScrollingModule} from "devextreme-angular/ui/nested";
import { AddDemandeAchatComponent } from './pages/Achat/demande-achat/add-demande-achat/add-demande-achat.component';
import { GridDemandeAchatComponent } from './pages/Achat/demande-achat/grid-demande-achat/grid-demande-achat.component';
import { WorkflowDecisionComponent } from './pages/Global/workflow-components/decision-component/workflow-decision.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { GridProduitComponent } from './pages/Achat/produit/grid-produit/grid-produit.component';
import { DemandeAchatValidComponent } from './pages/Achat/demande-achat/demande-achat-valid/demande-achat-valid.component';
import { GetDaByIdComponent } from './pages/Achat/demande-achat/get-da-by-id/get-da-by-id.component';
import { GridOffreComponent } from './pages/Achat/offre/grid-offre/grid-offre.component';
import { GridFournisseurComponent } from './pages/Achat/fournisseurs/grid-fournisseur/grid-fournisseur.component';
import { ProduitDaComponent, StringifyProduitsPipe } from './pages/Achat/produit/produit-da/produit-da.component';
import { AddDemandeDevisComponent } from './pages/Achat/demande-devis/add-demande-devis/add-demande-devis.component';
import { GridDemandeDevisComponent } from './pages/Achat/demande-devis/grid-demande-devis/grid-demande-devis.component';
import { ValiderEnvoyerComponent } from './pages/Global/workflow-components/valider-envoyer/valider-envoyer.component';
import { GetOffreByIdComponent } from './pages/Achat/offre/get-offre-by-id/get-offre-by-id.component';
import { JournalComponent } from './pages/Global/workflow-components/journal-component/journal.component';
import { IntsanceViewerComponent } from './pages/Global/workflow-components/instance-viewer-component/instance-viewer.component';
import { EventHistoryComponent } from './pages/Global/workflow-components/journal-component/event-history-component/event-history.component';
import { AccessHistoryComponent } from './pages/Global/workflow-components/journal-component/access-history-component/access-history.component';
import { WorkflowHistoryComponent } from './pages/Global/workflow-components/journal-component/workflow-history-component/workflow-history.component';
import { WorkflowViewerComponent } from './pages/Global/workflow-components/journal-component/workflow-viewer-component/workflow-viewer.component';
import { InstanceViewerTaskComponent } from './pages/Global/workflow-components/instance-viewer-task-component/instance-viewer-task.component';
import { AddProduitComponent } from './pages/Achat/produit/add-produit/add-produit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AddBonCommandeComponent } from './pages/Achat/bon-commande/add-bon-commande/add-bon-commande.component'; // Assurez-vous que l'importation est correcte
import { DemandeDevisDaComponent } from './pages/Achat/demande-devis/demande-devis-da/demande-devis-da.component';
import { AddDemandeDevisDaComponent } from './pages/Achat/demande-devis/add-demande-devis-da/add-demande-devis-da.component';
import { GetBonCommandeByIdComponent } from './pages/Achat/bon-commande/get-bon-commande-by-id/get-bon-commande-by-id.component';
import { GridBonCommandeComponent } from './pages/Achat/bon-commande/grid-bon-commande/grid-bon-commande.component';
import { OffreByDaComponent } from './pages/Achat/offre/offre-by-da/offre-by-da.component';
import { HoverDaComponent } from './pages/Achat/demande-achat/hover-da/hover-da.component';
import { GridProduitDemandeeComponent } from './pages/Achat/produit/grid-produit-demandee/grid-produit-demandee.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HoverOffreComponent } from './pages/Achat/offre/hover-offre/hover-offre.component';
import { StatistiqueComponent } from './pages/Achat/statistique/statistique.component';
import { HoverDemandeDevisComponent } from './pages/Achat/demande-devis/hover-demande-devis/hover-demande-devis.component';
import { GetDdByIdComponent } from './pages/Achat/demande-devis/get-dd-by-id/get-dd-by-id.component';
import { DemandeDevisOffreComponent } from './pages/Achat/demande-devis/demande-devis-offre/demande-devis-offre.component';
import { AddOffreComponent } from './pages/Achat/offre/add-offre/add-offre.component';
import { HoverAddOffreComponent } from './pages/Achat/offre/hover-add-offre/hover-add-offre.component';
import { AddDemandeDevisOffreComponent } from './pages/Achat/demande-devis/add-demande-devis-offre/add-demande-devis-offre.component';
import { DemandeAchatRejeteeComponent } from './pages/Achat/demande-achat/demande-achat-rejetee/demande-achat-rejetee.component';
import { loadMessages } from 'devextreme/localization';

import frMessages from 'devextreme/localization/messages/fr.json';
import dxPopover from 'devextreme/ui/popover';
import { GetFournisseurByIdComponent } from './pages/Achat/fournisseurs/get-fournisseur-by-id/get-fournisseur-by-id.component';
import { GridProduitCommandeeComponent } from './pages/Achat/produit/grid-produit-commandee/grid-produit-commandee.component';
import { GridProduitOffertComponent } from './pages/Achat/produit/grid-produit-offert/grid-produit-offert.component';
import { GetProduitDemandeeByIdComponent } from './pages/Achat/produit/get-produit-demandee-by-id/get-produit-demandee-by-id.component';
import { GetProduitCommandeeByIdComponent } from './pages/Achat/produit/get-produit-commandee-by-id/get-produit-commandee-by-id.component';
import { GetProduitOffertByIdComponent } from './pages/Achat/produit/get-produit-offert-by-id/get-produit-offert-by-id.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        PerfectScrollbarModule,
        AppRoutingModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        LoggerModule
            .forRoot(
                {
                    level: environment.logLevel,
                    serverLogLevel: environment.serverLogLevel,
                    disableConsoleLogging: false
                }),
        BrowserAnimationsModule,
        headerComponentsModules,
        ConfigPstkModule,
        AffectationRoutesModule,
        DxButtonModule,
        DxDataGridModule,
        DxTextAreaModule,
        DxPopupModule,
        DxTemplateModule,
        DxiColumnModule,
        DxoPagerModule,
        DxoPagingModule,
        DxoScrollingModule,
        DxTextBoxModule,
        DxBoxModule,
        ReactiveFormsModule,
        MdbFormsModule,
        DxToolbarModule,
        DxSelectBoxModule,
        DxTooltipModule,
        DxFormModule,
        DxScrollViewModule,
        FormsModule,
        MatFormFieldModule,
        MatButtonModule ,
        MatCardModule,
        DxiItemModule,
        MatDialogModule,
        DxLoadPanelModule,
        DxHtmlEditorModule,
        DxoImageUploadModule,
        DxFileUploaderModule,
        DxScrollViewModule,
        DxPopoverModule,
        DxBoxModule,
        DxToastModule
        
        
        

        
         


    ],
    declarations: [
        AppComponent,
        PagesComponent,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        VerticalMenuComponent,
        HorizontalMenuComponent,
        BreadcrumbComponent,
        BackTopComponent,
        UserMenuComponent,
        NotFoundComponent,
        FlagsMenuComponent,
        ProfilesComponent,
        AddDemandeAchatComponent,
        GridDemandeAchatComponent,
        WorkflowDecisionComponent,
        GridProduitComponent,
        DemandeAchatValidComponent,
        GetDaByIdComponent,
        GridOffreComponent,
        GridFournisseurComponent,
        ProduitDaComponent,
        StringifyProduitsPipe,
        AddDemandeDevisComponent,
        GridDemandeDevisComponent,
        ValiderEnvoyerComponent,
        GetOffreByIdComponent,
        JournalComponent,
        IntsanceViewerComponent,
        EventHistoryComponent,
        AccessHistoryComponent,
        WorkflowHistoryComponent,
        WorkflowViewerComponent,
        InstanceViewerTaskComponent,
        AddProduitComponent,
        AddBonCommandeComponent,
        DemandeDevisDaComponent,
        AddDemandeDevisDaComponent,  
        GetBonCommandeByIdComponent,
        GridBonCommandeComponent,
        OffreByDaComponent,
        HoverDaComponent,
        GridProduitDemandeeComponent,
        HoverOffreComponent,
        StatistiqueComponent,
        HoverDemandeDevisComponent,
        GetDdByIdComponent,
        DemandeDevisOffreComponent,
        AddOffreComponent,
        HoverAddOffreComponent,
        AddDemandeDevisOffreComponent,
        DemandeAchatRejeteeComponent,
        GetFournisseurByIdComponent,
        GridProduitCommandeeComponent, 
        GridProduitOffertComponent,
        GetProduitDemandeeByIdComponent,
        GetProduitCommandeeByIdComponent,
        GetProduitOffertByIdComponent












    ],
    providers: [CookieService,
        AppSettings, EnvServiceProvider,WsServiceProvider,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG},
        DxTemplateHost
    ],
    exports: [
        ToastrModule,


    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {
    constructor() {
        // Charger les messages en français
        loadMessages(frMessages);
    } 
}
