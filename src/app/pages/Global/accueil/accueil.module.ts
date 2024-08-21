import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccueilComponent} from './accueil.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {PsToolsModule} from '../ps-tools/ps-tools.module';
import {FormeoModule} from '../formeo/formeo.module';
import {AddressModule} from "../adresse/address.module";
import {AttachmentModule} from "../attachment/attachment.module";




export const routes:Routes = [
    {path: '', component: AccueilComponent, pathMatch: 'full'}

];

@NgModule({
    declarations: [
        AccueilComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        TranslateModule,
        PsToolsModule,
        FormeoModule,
        AddressModule,
        AttachmentModule,

    ]
})
export class AccueilModule { }
