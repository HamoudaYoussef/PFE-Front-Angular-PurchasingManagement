import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDemandeAchatComponent } from './grid-demande-achat/grid-demande-achat.component';
import { RouterModule, Routes } from '@angular/router';
import { DxLoadPanelModule, DxPopupModule } from 'devextreme-angular';
import { AddDemandeAchatComponent } from './add-demande-achat/add-demande-achat.component';
import { DemandeAchatValidComponent } from './demande-achat-valid/demande-achat-valid.component';
import { GetDaByIdComponent } from './get-da-by-id/get-da-by-id.component';
import { HoverDaComponent } from './hover-da/hover-da.component';
import { DemandeAchatRejeteeComponent } from './demande-achat-rejetee/demande-achat-rejetee.component';


export const routes: Routes  = [
  { path: 'allDemandes', component: GridDemandeAchatComponent },
  { path: 'demandeAchat/:id', component: GetDaByIdComponent },
  {  path: 'add/:id',    component:  AddDemandeAchatComponent },
  { path: 'demandesValides', component: DemandeAchatValidComponent },
  { path: 'demandesRejetees', component: DemandeAchatRejeteeComponent}


  
]


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DxPopupModule,
    DxLoadPanelModule

  ]
})
export class DemandeAchatModule { }
