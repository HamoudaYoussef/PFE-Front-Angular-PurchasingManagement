import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDemandeAchatComponent } from './grid-demande-achat/grid-demande-achat.component';
import { RouterModule, Routes } from '@angular/router';
import { DxPopupModule } from 'devextreme-angular';
import { AddDemandeAchatComponent } from './add-demande-achat/add-demande-achat.component';
import { DemandeAchatValidComponent } from './demande-achat-valid/demande-achat-valid.component';
import { GetDaByIdComponent } from './get-da-by-id/get-da-by-id.component';
import { HoverDaComponent } from './hover-da/hover-da.component';


export const routes: Routes  = [
  { path: 'allDemandes', component: GridDemandeAchatComponent },
  { path: 'demandeAchat/:id', component: GetDaByIdComponent },
  {  path: 'add/:id',    component:  AddDemandeAchatComponent },
  { path: 'demandesValides', component: DemandeAchatValidComponent }

  
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DxPopupModule,

  ]
})
export class DemandeAchatModule { }
