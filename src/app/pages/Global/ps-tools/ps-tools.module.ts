import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpServicesComponent} from './http-services/http-services.component';
import {TranslateModule} from "@ngx-translate/core";
import {SelectLevelLoggerComponent} from './select-level-logger/select-level-logger.component';
import {SelectThemeDataGridComponent} from './select-theme-data-grid/select-theme-data-grid.component';
import {DataGridComponent} from './data-grid/data-grid.component';
import {SimplePageComponent} from './simple-page/simple-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModuleModule} from '../shared-module/shared-module.module';
import {SelectComponent} from './select/select.component';
import {CarteVisiteComponent} from './carte-visite/carte-visite.component';
import {CarteVisiteGridComponent} from './carte-visite/carte-visite-grid/carte-visite-grid.component';
import {CardsModule} from "angular-bootstrap-md";


@NgModule({
    declarations: [
        HttpServicesComponent,
        SelectLevelLoggerComponent,
        SelectThemeDataGridComponent,
        DataGridComponent,
        SimplePageComponent,
        SelectComponent,CarteVisiteComponent,CarteVisiteGridComponent
    ],
    imports: [

        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModuleModule,
        CardsModule,
    ],

    exports: [HttpServicesComponent, SelectLevelLoggerComponent, SelectThemeDataGridComponent, DataGridComponent, SimplePageComponent,CarteVisiteComponent]
})
export class PsToolsModule {
}
