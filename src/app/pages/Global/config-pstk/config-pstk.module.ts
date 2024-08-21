import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {ConfigPstkComponent} from "./config-pstk.component";
import {DxPopupModule} from 'devextreme-angular/ui/popup';
import {DxDataGridModule} from 'devextreme-angular/ui/data-grid';
import { DxSwitchModule } from 'devextreme-angular/ui/switch';
import {MdbFormsModule} from 'mdb-angular-ui-kit/forms';
import {MdbValidationModule} from 'mdb-angular-ui-kit/validation';
import {DxRadioGroupModule} from 'devextreme-angular';



@NgModule({
  declarations: [
    ConfigPstkComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        DxPopupModule,
        DxDataGridModule,
        DxSwitchModule,
        MdbFormsModule,
        MdbValidationModule,
        DxRadioGroupModule,

    ],
  exports: [
    ConfigPstkComponent
  ]
})
export class ConfigPstkModule { }
