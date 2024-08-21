import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GridDemandeDevisComponent } from './grid-demande-devis/grid-demande-devis.component';
import { AddDemandeDevisComponent } from './add-demande-devis/add-demande-devis.component';
import { DemandeDevisDaComponent } from './demande-devis-da/demande-devis-da.component';
import { AddDemandeDevisDaComponent } from './add-demande-devis-da/add-demande-devis-da.component';

export const routes: Routes  = [
  { path: 'allDemandesDevis', component: GridDemandeDevisComponent },
  { path: 'allDemandesDevis/produitDemandee', component: DemandeDevisDaComponent },
  { path: 'addDemandeDevis/produitDemandee', component: AddDemandeDevisDaComponent },
  {  path: 'add/:id',    component:  AddDemandeDevisComponent }

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
