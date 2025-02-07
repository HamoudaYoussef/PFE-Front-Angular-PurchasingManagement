import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';
import { ProduitCommandeeService } from 'src/app/Service/produit-commandee.service';
import { EnvService } from 'src/env.service';
import { ProduitOffertService } from '../../../../Service/produit-offert.service';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';

@Component({
  selector: 'app-get-produit-commandee-by-id',
  templateUrl: './get-produit-commandee-by-id.component.html',
  styleUrls: ['./get-produit-commandee-by-id.component.scss']
})
export class GetProduitCommandeeByIdComponent implements OnInit {

  constructor(private produitCommandeeService:ProduitCommandeeService,private env:EnvService,
    private route: ActivatedRoute,private produitOffertService:ProduitOffertService,
    private produitDemandeeService:ProduitDemandeeService,private router: Router) { }

  produitCommandee: NewProduitCommandee;
  produitsDemandes: NewProduitDemandee[];
  errorMessage: string = '';
  demandeDevis: any;
  produitCommandees: NewProduitCommandee[] = [];
  produitOfferts: NewProduitOffert[] = [];
  pageSize = this.env.pageSize;
    allowedPageSizes = this.env.allowedPageSizes;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getProduitCommandee(id);
    this.getDemandeDevis(id);
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
  getDemandeDevis(id: number): void {
    this.produitCommandeeService.getDemandeDevisByProduitCommandee(id).subscribe(
      (demande: NewDemandeDevis) => {
        this.demandeDevis = demande;
        console.log('Demande devis:', this.demandeDevis);
  
        if (!this.demandeDevis) {
          console.error('Demande devis non définie');
          return;
        }
  
        console.log('Chargement des produits pour la demande achat:', this.demandeDevis);
  
        // Charger les produits commandés pour cette demande de devis
        this.produitCommandeeService.getProduitCommandeeByDemandeDevisId(this.demandeDevis.id).subscribe(
          (produitsCommandes) => {
            // Filtrer les produits pour exclure celui avec l'ID 88
            this.produitCommandees = produitsCommandes.filter(produit => produit.id !== this.produitCommandee?.id);
            console.log('Produits commandés (sans l\'ID 88) :', this.produitCommandees);
  
            // Appeler `findProduitOffertByProduitCommandeeAndDemandeDevis` pour chaque produit commandé
            this.produitCommandees.forEach((produit) => {
              this.produitOffertService.findProduitOffertByProduitCommandeeAndDemandeDevis(
                produit.id,
                this.demandeDevis.id
              ).subscribe(
                (data: NewProduitOffert[]) => {
                  this.produitOfferts = data;
                  console.log('Produits offerts liés au produit commandé et demande de devis:', data);
                },
                (error) => console.error('Erreur lors de la récupération des produits offerts :', error)
              );
            });
  
            // Appel de la méthode `getProduitsDemandes` pour chaque produit commandé
            this.produitCommandees.forEach((produit) => {
              this.getProduitsDemandes(this.demandeDevis.id, produit.produit.id);
            });
          },
          (error) => {
            console.log('Une erreur s\'est produite lors du chargement des produits commandés :', error);
          }
        );
      },
      (err) => console.error('Erreur lors de la récupération de la DemandeAchat:', err)
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

  getProduitCommandee(id: number): void {
    this.produitCommandeeService.getProduitCommandeeById(id).subscribe({
      next: (data) => this.produitCommandee = data,
      error: (error) => this.errorMessage = error
    });
  }
id
  EditdemandePD(id) {
    this.id = id.data.id;
    // Navigate to the add-demande component with the specific ID
    this.router.navigate(['/Produit/produitsDemandee', this.id]);
}
EditdemandePO(id) {
  this.id = id.data.id;
  // Navigate to the add-demande component with the specific ID
  this.router.navigate(['/Produit/produitsOfferts', this.id]);
}



}
