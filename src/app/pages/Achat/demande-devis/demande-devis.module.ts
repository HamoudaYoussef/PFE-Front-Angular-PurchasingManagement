import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GridDemandeDevisComponent } from './grid-demande-devis/grid-demande-devis.component';
import { AddDemandeDevisComponent } from './add-demande-devis/add-demande-devis.component';
import { DemandeDevisDaComponent } from './demande-devis-da/demande-devis-da.component';
import { AddDemandeDevisDaComponent } from './add-demande-devis-da/add-demande-devis-da.component';
import { HoverDemandeDevisComponent } from './hover-demande-devis/hover-demande-devis.component';
import { GetDdByIdComponent } from './get-dd-by-id/get-dd-by-id.component';
import { DemandeDevisOffreComponent } from './demande-devis-offre/demande-devis-offre.component';
import { AddDemandeDevisOffreComponent } from './add-demande-devis-offre/add-demande-devis-offre.component';

export const routes: Routes  = [
  { path: 'allDemandesDevis', component: GridDemandeDevisComponent },
  { path: 'allDemandesDevisOffre', component: DemandeDevisOffreComponent },
  { path: 'allDemandesDevis/produitDemandee', component: DemandeDevisDaComponent },
  { path: 'addDemandeDevis/produitDemandee', component: AddDemandeDevisDaComponent },
  {  path: 'add/:id',    component:  AddDemandeDevisComponent },
  { path: 'demandeDevis/:id', component: GetDdByIdComponent },
  { path: 'addDemandeDevisOffre/:id', component: AddDemandeDevisOffreComponent },



]


@NgModule({
  declarations: [
    
  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DemandeDevisModule { }
