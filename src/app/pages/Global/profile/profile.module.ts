import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileUserComponent} from './profile-user/profile-user.component';
import {RouterModule, Routes} from "@angular/router";
import {DxPopupModule} from "devextreme-angular/ui/popup";
import {SharedModuleModule} from "../shared-module/shared-module.module";
import {DxSwitchModule, DxValidatorModule} from "devextreme-angular";
import {ConfigPstkModule} from '../config-pstk/config-pstk.module';
import {InputUtilitiesModule} from "angular-bootstrap-md";
import {SelectOrgaComponent} from './select-orga/select-orga.component';


export const routes: Routes = [
    {
        path: 'user',
        component: ProfileUserComponent,
        data: {breadcrumb: 'Consultation Profil utilisateur'},
        pathMatch: 'full'
    },

];

@NgModule({
    declarations: [
        ProfileUserComponent, SelectOrgaComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        //  ModuleSelectModule,
        DxPopupModule,
        SharedModuleModule,
        DxSwitchModule,
        InputUtilitiesModule,
        ConfigPstkModule,
        DxValidatorModule
    ]
})
export class ProfileModule {
}
