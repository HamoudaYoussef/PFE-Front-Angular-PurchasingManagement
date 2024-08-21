import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleListComponent } from './example-list/example-list.component';
import { ExampleFormComponent } from './example-form/example-form.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModuleModule} from "../shared-module/shared-module.module";
import {TranslateModule} from "@ngx-translate/core";
import {PsToolsModule} from "../ps-tools/ps-tools.module";
export const routes:Routes = [
{
  path: '',
      pathMatch: 'full',
    component: ExampleListComponent,
},
{
  path: 'edit/:id',
      pathMatch: 'full',
    component: ExampleFormComponent
},
{
  path: 'form',
      pathMatch: 'full',
    component: ExampleFormComponent
},
{path: '**', redirectTo: ''},
];


export interface appElement {

  id: string;
  name: string;
  label: string;
  urlDev: string;
  urlProd: string;


}

@NgModule({
  declarations: [
    ExampleListComponent,
    ExampleFormComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PsToolsModule,
  ]
})
export class ExampleModule { }
