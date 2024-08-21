import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {PagesComponent} from './pages/pages.component';
import {NotFoundComponent} from './pages/Global/errors/not-found/not-found.component';
import { QuicklinkModule } from 'ngx-quicklink';
import { StatistiqueModule } from './pages/Achat/statistique/statistique.module';



export const routes: Routes = [
  {
    path: '', 
    component: PagesComponent, 
    children:[
      {path: 'Accueil', loadChildren: () => import('./pages/Global/accueil/accueil.module').then(m => m.AccueilModule)},
      {path: 'Example', loadChildren: () => import('./pages/Global/example/example.module').then(m => m.ExampleModule)},
      {path: 'DemandeAchat', loadChildren: () => import('./pages/Achat/demande-achat/demande-achat.module').then(m => m.DemandeAchatModule)},
      {path: 'Produit', loadChildren: () => import('./pages/Achat/produit/produit.module').then(m => m.ProduitModule)},
      {path: 'Fournisseur', loadChildren: () => import('./pages/Achat/fournisseurs/fournisseur.module').then(m => m.FournisseurModule)},
      {path: 'Offre', loadChildren: () => import('./pages/Achat/offre/offre.module').then(m => m.OffreModule)},
      {path: 'DemandeDevis', loadChildren: () => import('./pages/Achat/demande-devis/demande-devis.module').then(m => m.DemandeDevisModule)},
      {path: 'BonCommande', loadChildren: () => import('./pages/Achat/bon-commande/bon-commande.module').then(m => m.BonCommandeModule)},
      {path: 'Statistique', loadChildren: () => import('./pages/Achat/statistique/statistique.module').then(m => m.StatistiqueModule)},



      
      {
        path: 'Profile',
        loadChildren: () => import('./pages/Global/profile/profile.module').then(m => m.ProfileModule),
      },

    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    QuicklinkModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,

      //preloadingStrategy: QuicklinkStrategy ,// <- comment this line for activate lazy load
      relativeLinkResolution: 'legacy',
      useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
