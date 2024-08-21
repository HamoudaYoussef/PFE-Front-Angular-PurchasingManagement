import {NgModule} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {AffectationRoutesComponent} from './affectation-routes.component';
import {DxPopupModule} from 'devextreme-angular/ui/popup';
import {DxDataGridModule} from 'devextreme-angular/ui/data-grid';






@NgModule({
    declarations: [
        AffectationRoutesComponent

    ],
    imports: [
        TranslateModule,
        DxPopupModule,
        DxDataGridModule

    ],
    exports: [
        AffectationRoutesComponent
    ]

})
export class AffectationRoutesModule { }
