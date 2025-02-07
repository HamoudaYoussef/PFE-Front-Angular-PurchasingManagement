import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NewDemandeAchat } from 'src/app/Models/demande-achat.model';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { NewProduit } from 'src/app/Models/produit.model';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { ProduitService } from 'src/app/Service/produit.service';
import { EnvService } from 'src/env.service';
import { NewProduitCommandee } from '../../../../Models/produit-commandee.model';
import { NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';

@Component({
  selector: 'app-get-produit-demandee-by-id',
  templateUrl: './get-produit-demandee-by-id.component.html',
  styleUrls: ['./get-produit-demandee-by-id.component.scss']
})
export class GetProduitDemandeeByIdComponent implements OnInit {
  produitDemandee: NewProduitDemandee | null = null;
  errorMessage: string = '';
  demandeAchat: any;
  produitCommandees: NewProduitCommandee[] = [];
  produitOfferts: NewProduitOffert[] = [];

  demandeDevis: NewDemandeDevis

  produitDemandees: NewProduitDemandee[] = [];
  pageSize = this.env.pageSize;
    allowedPageSizes = this.env.allowedPageSizes;
    products : NewProduit[] = [];
    displayname: string;


  constructor(private produitDemandeeService: ProduitDemandeeService,private route: ActivatedRoute,
    private env: EnvService,private cookieService:CookieService, private produitService:ProduitService,
    private produitOffertService:ProduitOffertService,private router: Router
  ) { }

  ngOnInit(): void {
    this.displayname = this.cookieService.get('displayname');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getProduitDemandee(id);
      this.loadProduits();
      this.getDemandeAchat(id);
    }
  }

  calculateStockStatus = (rowData) => {
    const product = this.products.find(p => p.id === rowData.produit.id);
    if (product) {
      return product.quantite < rowData.quantite ? 'Épuisé' : 'En stock';
    }
    return 'Inconnu'; // Si le produit n'est pas trouvé
  }
  etatStockCellTemplate = (container, options) => {
    const etatStock = options.value;
    const color = etatStock === 'Épuisé' ? 'red' : 'green';
    container.innerHTML = `<span style="color: ${color}">${etatStock}</span>`;
  };
    // Appel du service pour obtenir le produit demandé par ID
    getProduitDemandee(id: number): void {
      this.produitDemandeeService.getProduitDemandeeById(id).subscribe({
        next: (data) => this.produitDemandee = data,
        error: (error) => this.errorMessage = error
      });
    }
    loadProduits(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.produitService.getProduitsSimple().subscribe(
          (data: any[]) => {
            this.products = data;
            console.log('Produits chargés:', this.products);
            resolve(); // Résoudre la promesse lorsque les produits sont chargés
          },
          error => {
            console.error('Erreur lors du chargement des produits', error);
            reject(error); // Rejeter la promesse en cas d'erreur
          }
        );
      });
    }
    id
    EditdemandePC(id) {
      // Set the ID property
      this.id = id.data.id;
      // Navigate to the add-demande component with the specific ID
      this.router.navigate(['/Produit/produitsCommandee', this.id]);
  }
  EditdemandePO(id) {
    // Set the ID property
    this.id = id.data.id;
    // Navigate to the add-demande component with the specific ID
    this.router.navigate(['/Produit/produitsOfferts', this.id]);
}



    getDemandeAchat(id: number): void {
      this.produitDemandeeService.getDemandeAchatByProduitDemandee(id).subscribe(
        (demande: NewDemandeAchat) => {
          this.demandeAchat = demande;
          console.log('Demande d\'achat:', this.demandeAchat);
    
          // Check if demandeAchat is defined
          if (!this.demandeAchat) {
            console.error('Demande d\'achat non définie');
            return;
          }
    
          console.log('Chargement des produits pour la demande achat:', this.demandeAchat);
    
          // Fetch produitsDemandes
          this.produitDemandeeService.getProduitDemandeByDemandeAchatId(this.demandeAchat.id).subscribe(
            (produitsDemandes) => {
              // Filter produitsDemandes to exclude the one with specific ID
              this.produitDemandees = produitsDemandes.filter(produit => produit.id !== 88);
              console.log('Produits demandés (sans l\'ID 88) :', this.produitDemandees);
    
              // Fetch produitsCommandees related to this demandeAchat
              this.produitDemandeeService.getProduitCommandeesByProduitDemandeeAndDemandeAchat(id, this.demandeAchat.id)
                .subscribe(
                  (data: NewProduitCommandee[]) => {
                    this.produitCommandees = data;
                    console.log('Produits commandés:', this.produitCommandees);
    
                    // Fetch produitsOfferts for each produitCommandee
                    this.produitCommandees.forEach(produitCommandee => {
                      this.produitOffertService.findProduitOffertByProduitCommandeeAndDemandeDevis(
                        produitCommandee.id,
                        produitCommandee.demandeDevis.id
                      ).subscribe(
                        (data: NewProduitOffert[]) => {
                          this.produitOfferts = data; // Assume produitsOfferts is added as an array attribute in NewProduitCommandee
                          console.log(`Produits offerts pour le produit commandé ${produitCommandee.id}:`, this.produitOfferts);
                        },
                        (error) => console.error(`Erreur lors de la récupération des produits offerts pour produitCommandee ${produitCommandee.id}:`, error)
                      );
                    });
                  },
                  (error) => console.error('Erreur lors de la récupération des produits commandés:', error)
                );
            },
            (error) => {
              console.log('Une erreur s\'est produite lors du chargement des produits demandés : ', error);
            }
          );
        },
        (err) => console.error('Erreur lors de la récupération de la DemandeAchat:', err)
      );
    }
    

    onToolbarPreparing(e) {
      e.toolbarOptions.items.unshift(
          {
            location: 'center',
            template: 'Autres produits'
          }
      );
    }
    
    quantiteCalculee: number;
    quantitedifference:number;
    popoverTarget: any; // Référence à l'élément cible pour le popover
    isPopoverVisible = false; // Contrôle la visibilité du popover

    togglePopover(event: MouseEvent) {
      this.popoverTarget = event.currentTarget as HTMLElement; // Définir la cible du popover
      this.isPopoverVisible = !this.isPopoverVisible; // Inverser l'état de visibilité
      console.log('Quantité calculée:', this.quantiteCalculee); // Vérification de la quantité
    }
    handleRowPrepared(e) {
      if (e.rowType === 'data') {
        e.rowElement.addEventListener('mouseenter', () => this.showPopover(e.rowElement, e.data.produit.id));
        e.rowElement.addEventListener('mouseleave', () => this.hidePopover());
      }
    }
    
    // Méthodes pour afficher et masquer le popover
    showPopover(target, produitId) {
      this.popoverTarget = target; // Cibler l'élément sur lequel la souris est passée
      const product = this.products.find(p => p.id === produitId);
      const produitDemande = this.produitDemandees.find(pd => pd.produit.id === produitId);
  
      if (product && produitDemande) {
        this.quantiteCalculee = product.quantite; 
        // Recalculer la quantité
        this.quantitedifference = product.quantite - produitDemande.quantite;
          this.isPopoverVisible = true; // Afficher le popover   }
    }
  }
    hidePopover() {
      this.isPopoverVisible = false;
    }
}
