import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GridOffreComponent } from './grid-offre/grid-offre.component';
import { GetOffreByIdComponent } from './get-offre-by-id/get-offre-by-id.component';
import { OffreByDaComponent } from './offre-by-da/offre-by-da.component';
import { HoverOffreComponent } from './hover-offre/hover-offre.component';
import { AddOffreComponent } from './add-offre/add-offre.component';
import { HoverAddOffreComponent } from './hover-add-offre/hover-add-offre.component';

export const routes: Routes  = [
  { path: 'allOffres', component: GridOffreComponent },
  { path: 'addOffre/:demandeDevisId', component: AddOffreComponent },
  { path: 'offre/:id', component: GetOffreByIdComponent },
  { path: 'demandeachat/:demandeachatId', component: OffreByDaComponent },


]

@NgModule({
  declarations: [
      
  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OffreModule { }
