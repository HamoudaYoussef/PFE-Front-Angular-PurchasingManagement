import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NewFournisseur } from 'src/app/Models/fournisseur.model';
import { NewOffre } from 'src/app/Models/offre.model';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { OffreService } from 'src/app/Service/offre.service';
import { ProduitCommandeeService } from 'src/app/Service/produit-commandee.service';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-get-produit-offert-by-id',
  templateUrl: './get-produit-offert-by-id.component.html',
  styleUrls: ['./get-produit-offert-by-id.component.scss']
})
export class GetProduitOffertByIdComponent implements OnInit {

  constructor(private produitOffertService:ProduitOffertService,private env:EnvService,
    private produitDemandeeService:ProduitDemandeeService,private router: Router,
    private route: ActivatedRoute,private offreService:OffreService,private produitCommandeeService:ProduitCommandeeService
  ) { }

  produitsCommandes : NewProduitCommandee[];
  produitsDemandes: NewProduitDemandee[];
  produitOffert: NewProduitOffert;
  errorMessage: string = '';
  offre: any;
  fournisseur:NewFournisseur
  produitOfferts: NewProduitOffert[] = [];
  pageSize = this.env.pageSize;
    allowedPageSizes = this.env.allowedPageSizes;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getProduitOffert(id);
    this.getOffre(id);
    
  this.offreService.getFournisseurByOffreId(this.offre.id).subscribe(
    (fournisseur: NewFournisseur) => {
      this.fournisseur = fournisseur;
      console.log('Fournisseur:', this.fournisseur);
    },
    (error) => console.error('Erreur lors de la récupération du fournisseur:', error)
  );
    }

  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Autres produits'
        }
    );
  }
  getOffre(id: number): void {
    this.produitOffertService.getOffreByProduitOffert(id).subscribe(
      (offre: NewOffre) => {
        this.offre = offre;
        console.log('Offre:', this.offre);
  
        if (!this.offre) {
          console.error('Offre non définie');
          return;
        }
  
        // Initialiser this.produitsCommandes comme un tableau vide
      //  this.produitsCommandes = [];
  
        this.produitOffertService.getProduitOffertsByOffreId(this.offre.id).subscribe(
          (produitsOfferts) => {
            this.produitOfferts = produitsOfferts.filter(produit => produit.id !== this.produitOffert?.id);
            this.produitOfferts.forEach(produit => {
         //     console.log('produitId',produit.id)
              this.getProduitsCommandes(this.offre.id, produit.produit.id);
            });
              console.log('Produits offerts (sans l\'ID 88) :', this.produitOfferts);
          },
          (error) => {
            console.error('Erreur lors du chargement des produits offerts :', error);
          }
        );
  
        // Appeler ici la récupération du fournisseur, une fois que l'offre est définie
        this.offreService.getFournisseurByOffreId(this.offre.id).subscribe(
          (fournisseur: NewFournisseur) => {
            this.fournisseur = fournisseur;
            console.log('Fournisseur:', this.fournisseur);
          },
          (error) => console.error('Erreur lors de la récupération du fournisseur:', error)
        );
      },
      (err) => console.error('Erreur lors de la récupération de l\'offre:', err)
    );
  }
  getProduitsDemandes(demandeDevisId: number, produitId: number): void {
    this.produitDemandeeService.findProduitByDemandeAchatAndProduit(demandeDevisId, produitId).subscribe(
      (data: NewProduitDemandee[]) => {
        this.produitsDemandes = data;
        console.log('Produits demandés:', data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits demandés :', error);
      }
    );
  }
  getProduitsCommandes(offreId: number, produitId: number): void {
    this.produitCommandeeService.getProduitsCommandesByOffreAndProduit(offreId, produitId).subscribe(
      (produitsCommandes: NewProduitCommandee[]) => {
        this.produitsCommandes = produitsCommandes;
        console.log('Produits commandés:', this.produitsCommandes);
  
        // Créez un tableau d'observables pour chaque appel HTTP
        const observables = produitsCommandes.map((produitCommandee) => {
          console.log('DemandeDevisId du produitCommandee:', produitCommandee.demandeDevis.id);
          return this.getProduitsDemandes(produitCommandee.demandeDevis.id, produitCommandee.produit.id);
        });
  
        // Exécuter tous les appels en parallèle et attendre leur réponse
        forkJoin(observables).subscribe(
          (results) => {
            console.log('Tous les produits demandés:', results);
          },
          (error) => {
            console.error('Erreur lors de la récupération des produits demandés :', error);
          }
        );
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits commandés:', error);
      }
    );
  }
  
  
  getProduitOffert(id: number): void {
    this.produitOffertService.getProduitOffertById(id).subscribe({
      next: (data) => this.produitOffert = data,
      error: (error) => this.errorMessage = error
    });
  }

id
  EditdemandePD(id) {
    this.id = id.data.id;
    // Navigate to the add-demande component with the specific ID
    this.router.navigate(['/Produit/produitsDemandee', this.id]);
}
EditdemandePC(id) {
  this.id = id.data.id;
  // Navigate to the add-demande component with the specific ID
  this.router.navigate(['/Produit/produitsCommandee', this.id]);
}




}
