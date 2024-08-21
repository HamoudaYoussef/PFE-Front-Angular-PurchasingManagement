import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StatistiqueComponent } from './statistique.component';


export const routes: Routes  = [
  { path: 'dash', component: StatistiqueComponent },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)

  ]
})
export class StatistiqueModule { }
