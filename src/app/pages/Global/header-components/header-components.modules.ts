import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HeaderComponentsComponent} from './header-components.component';
import {DxPopupModule} from 'devextreme-angular/ui/popup';
import {DxSelectBoxModule} from "devextreme-angular/ui/select-box";
import {DxLoadPanelModule} from "devextreme-angular/ui/load-panel";
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        HeaderComponentsComponent

    ],
    imports: [
        DxPopupModule,
        TranslateModule,
        ReactiveFormsModule,
        DxSelectBoxModule,
        DxLoadPanelModule,
        CommonModule
    ],

    exports: [HeaderComponentsComponent]
})
export class headerComponentsModules {
}
