import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddBonCommandeComponent } from './add-bon-commande/add-bon-commande.component';
import { GetBonCommandeByIdComponent } from './get-bon-commande-by-id/get-bon-commande-by-id.component';
import { GridBonCommandeComponent } from './grid-bon-commande/grid-bon-commande.component';


export const routes: Routes  = [
  {  path: 'add/:id/:idoffre',    component:  AddBonCommandeComponent },
  { path: 'boncommande/:id', component: GetBonCommandeByIdComponent },
  { path: 'boncommandes', component: GridBonCommandeComponent },


]


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class BonCommandeModule { }
