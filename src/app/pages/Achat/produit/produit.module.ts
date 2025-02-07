import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GridProduitComponent } from './grid-produit/grid-produit.component';

import { GridProduitDemandeeComponent } from './grid-produit-demandee/grid-produit-demandee.component';
import { AddProduitComponent } from './add-produit/add-produit.component';
import { GridProduitCommandeeComponent } from './grid-produit-commandee/grid-produit-commandee.component';
import { GridProduitOffertComponent } from './grid-produit-offert/grid-produit-offert.component';
import { GetProduitDemandeeByIdComponent } from './get-produit-demandee-by-id/get-produit-demandee-by-id.component';
import { GetProduitCommandeeByIdComponent } from './get-produit-commandee-by-id/get-produit-commandee-by-id.component';
import { GetProduitOffertByIdComponent } from './get-produit-offert-by-id/get-produit-offert-by-id.component';

export const routes: Routes  = [
  { path: 'allProduits', component: GridProduitComponent },
  { path: 'produitsDemandee', component: GridProduitDemandeeComponent },
  { path: 'produitsDemandee/:id', component: GetProduitDemandeeByIdComponent },
  { path: 'produitsCommandee', component: GridProduitCommandeeComponent },
  { path: 'produitsCommandee/:id', component: GetProduitCommandeeByIdComponent },
  { path: 'produitsOfferts', component: GridProduitOffertComponent },
  { path: 'produitsOfferts/:id', component: GetProduitOffertByIdComponent },
  { path: 'add', component: AddProduitComponent }


]

@NgModule({
  declarations: [  
    ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProduitModule { }
