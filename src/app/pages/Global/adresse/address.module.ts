import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {PsToolsModule} from '../ps-tools/ps-tools.module';
import {FormeoModule} from '../formeo/formeo.module';
import {AdresseComponent} from "./adresse.component";
import {SharedModuleModule} from "../shared-module/shared-module.module";
import {DxValidatorModule} from "devextreme-angular";
import {TelComponent} from "../tel/tel.component";
import {MatInputModule} from "@angular/material/input";
import {NgxMatIntlTelInputModule} from "ngx-mat-intl-tel-input";




@NgModule({
    declarations: [
        AdresseComponent,
        TelComponent

    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PsToolsModule,
    FormeoModule,
    SharedModuleModule,
    DxValidatorModule,
    MatInputModule,
    NgxMatIntlTelInputModule

  ],
    exports: [
        AdresseComponent,
        TelComponent
    ]

})
export class AddressModule { }
