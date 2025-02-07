import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GridFournisseurComponent } from './grid-fournisseur/grid-fournisseur.component';
import { GetFournisseurByIdComponent } from './get-fournisseur-by-id/get-fournisseur-by-id.component';

export const routes: Routes  = [
  { path: 'allfournisseur', component: GridFournisseurComponent },
  { path: 'fournisseur/:id', component: GetFournisseurByIdComponent },

]

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)

  ]
})
export class FournisseurModule { }
