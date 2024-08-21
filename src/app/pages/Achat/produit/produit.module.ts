import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GridProduitComponent } from './grid-produit/grid-produit.component';

import { GridProduitDemandeeComponent } from './grid-produit-demandee/grid-produit-demandee.component';
import { AddProduitComponent } from './add-produit/add-produit.component';

export const routes: Routes  = [
  { path: 'allProduits', component: GridProduitComponent },
  { path: 'produitsDemandee', component: GridProduitDemandeeComponent },
  { path: 'add', component: AddProduitComponent }


]

@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProduitModule { }
