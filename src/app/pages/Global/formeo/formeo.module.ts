import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormeoComponent } from './formeo/formeo.component';
import {CardsModule} from "angular-bootstrap-md";
import {TranslateModule} from "@ngx-translate/core";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import {QuicklinkModule} from "ngx-quicklink";
import {AceEditorModule} from "ng2-ace-editor";
import 'brace';
import 'brace/theme/monokai';
import { AceModule } from 'ngx-ace-wrapper';
import 'brace/mode/json';
import 'brace/mode/xml';
import {FormioModule} from "@formio/angular";
import {SharedModuleModule} from '../shared-module/shared-module.module';




@NgModule({
    declarations: [
        FormeoComponent,
    ],
    exports: [
        FormeoComponent
    ],
    imports: [
        CommonModule,
        FormioModule,
        CardsModule,
        TranslateModule,
        RxReactiveFormsModule,
        QuicklinkModule,
        AceModule,
        AceEditorModule,
        SharedModuleModule
    ]
})
export class FormeoModule { }
