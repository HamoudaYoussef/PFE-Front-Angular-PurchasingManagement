import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { BonCommandeService } from 'src/app/Service/bon-commande.service';
import { OffreBonCommandeService } from 'src/app/Service/offre-bon-commande.service';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-hover-offre',
  templateUrl: './hover-offre.component.html',
  styleUrls: ['./hover-offre.component.scss']
})
export class HoverOffreComponent implements OnInit {
  produitsSelectionnes: NewProduitOffert[] = []; // Liste pour stocker les produits sélectionnés

  dataSourceElement: any;
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  tasksDataSource: DataSource;
  bcadd: any;
  displayname: string;
  @Output() produitDejaSelectionne = new EventEmitter<string>(); // Événement pour produit déjà sélectionné

  @Output() produitOffertSelected = new EventEmitter<NewProduitOffert>();
  @Output() scrollToDetails = new EventEmitter<void>();


 
  constructor(private produitOffertService: ProduitOffertService, private env: EnvService,private bonCommandeService:BonCommandeService,
    private router: Router,private cookieService:CookieService,private offreBonCommandeService:OffreBonCommandeService,
    private toastr:ToastrService
  ) { }
  ngOnInit(): void {
    this.displayname = this.cookieService.get('displayname');
    // Initialiser ici si nécessaire
  }
  @Input() key: number;

 @Input() offreId: number;
  produits: NewProduitOffert[] = [];
  ngAfterViewInit() {
    this.loadProduitsByOffreId() ;
  }

  completedValue(rowData) {
    return rowData.Status == 'Completed';
  }



  loadProduitsByOffreId(): void {
    this.produitOffertService.getProduitOffertsByOffreId(this.offreId).subscribe(
      produits => {
        this.produits = produits;
        this.dataSourceElement = new CustomStore({
          load: (loadOptions: any) => {
            loadOptions.requireTotalCount = true;
            const size = loadOptions.take || this.env.pageSize;
            const startIndex = loadOptions.skip || 0;
            const endIndex = startIndex + size;
            const paginatedData = this.produits.slice(startIndex, endIndex);
  
            return Promise.resolve({
              data: paginatedData,
              totalCount: this.produits.length,
            });
          },
        });        },
      error => {
        console.log('Une erreur s\'est produite lors du chargement des produits : ', error);
      }
    );
  }
  customizeTotalText(options: any): string {
    return `${options.value.toFixed(2)} DT`; // Ajoute 'DT' après la valeur
  }
  calculateTotalPrice(rowData: any): number {
    const quantite = rowData.quantite || 0; // Gérer les valeurs nulles ou indéfinies
    const prix = rowData.prix || 0;         // Gérer les valeurs nulles ou indéfinies
    return quantite * prix;
  }

  goBC(){
        this.router.navigate(['/BonCommande/add']); // Pass the offer ID
    }
    private currentSelectedProductId: number | null = null; // ID du produit actuellement sélectionné

    POBC(event: Event, produitOffertId: number) {
      event.preventDefault(); // Empêche le comportement par défaut
    
      this.produitOffertService.getProduitOffert(produitOffertId).subscribe(
        (produit: NewProduitOffert) => {
          // Vérifiez si le produit a un bon de commande et récupérez l'ID du bon de commande
          const bonCommandeId = produit.bonCommande?.id;
          console.log('bcId', bonCommandeId);
    
          // Vérifier si un produit dans la liste a déjà le même bonCommandeId
          if (bonCommandeId) {
            // Afficher un message d'avertissement si un bon de commande est déjà associé
            this.toastr.warning('Ce produit a déjà été affecté à un bon de commande.');
            return; // Arrêter l'exécution ici si un bon de commande existe déjà dans la liste
          }
    
          // Vérifier si le produit est déjà sélectionné
          const estDejaSelectionne = this.offreBonCommandeService.getProduitsSelectionnes().some(p => p.id === produit.id);
          if (estDejaSelectionne) {
            // Émettre un événement si le produit a déjà été sélectionné
            this.produitDejaSelectionne.emit("Produit déjà sélectionné.");
            return; // Ne pas ajouter le produit encore une fois
          }
    
          // Si le produit n'est ni affecté à un bon de commande ni déjà sélectionné, émettre l'événement et ajouter
          this.produitOffertSelected.emit(produit); // Émettre le produit sélectionné
          this.scrollToDetails.emit(); // Émettre l'événement pour faire défiler
    
          // Logiquement, on pourrait ajouter le produit à la liste ici si nécessaire
          console.log('Produit offert ajouté:', produit);
        },
        error => {
          console.error('Erreur lors de la récupération du produit offert:', error);
        }
      );
    }
    
    
}
