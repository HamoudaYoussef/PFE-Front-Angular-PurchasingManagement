import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDemandeDevis, NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { NewProduit } from 'src/app/Models/produit.model';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { EnvService } from 'src/env.service';
import { FournisseurService } from '../../../../Service/fournisseur.service';
import { NewFournisseur } from '../../../../Models/fournisseur.model';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';
import { ProduitCommandeeService } from '../../../../Service/produit-commandee.service';
import { NewBonCommande } from 'src/app/Models/bon-commande.model';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { IOffre, NewOffre } from 'src/app/Models/offre.model';
import { OffreService } from 'src/app/Service/offre.service';
import { ProduitOffertService } from '../../../../Service/produit-offert.service';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';

@Component({
  selector: 'app-get-dd-by-id',
  templateUrl: './get-dd-by-id.component.html',
  styleUrls: ['./get-dd-by-id.component.scss']
})
export class GetDdByIdComponent implements OnInit {
  @Output() add = new EventEmitter<boolean>();

  fournisseurNom: string; // Pour stocker le nom du fournisseur
  demandeDevis: NewDemandeDevis; // Objet unique pour la demande de devis
  offres: NewOffre[] = []; // Liste des offres
  offre: IOffre; // Offre courante

  fournisseurs: { [key: number]: NewFournisseur } = {}; // Stocker les fournisseurs par ID de demande de devis
  produitCommandeeMap: { [key: number]: NewProduitCommandee[] } = {};
  produitOffertMap: { [key: number]: NewProduitOffert[] } = {};
  offreMap: { [key: number]: NewOffre } = {}; 
  BonCommandes: { [key: number]: NewBonCommande } = {}; 
  produitCommandeeList: NewProduitCommandee[] = [];
  products: NewProduit[] = [];
  
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  produits: NewProduitCommandee[] = [];
  currentdate: Date;
  
  constructor(
    private route: ActivatedRoute,
    private demandeDevisService: DemandeDevisService,
    private fournisseurService: FournisseurService,
    private produitDemandeeService: ProduitDemandeeService,
    private toastr: ToastrService,
    private env: EnvService,
    private router: Router,
    private produitCommandeService: ProduitCommandeeService,
    private offreService: OffreService,
    private produitOffertService: ProduitOffertService
  ) {}

  ngOnInit(): void {
    this.currentdate = new Date(); // Initialiser currentdate ici
    const id = +this.route.snapshot.paramMap.get('id');
    this.getDemandeDevisById(id);
  }

  getDemandeDevisById(id: number): void {
    this.demandeDevisService.getDemandeDevisById(id).subscribe(
      (demande: NewDemandeDevis) => {
        this.demandeDevis = demande; // Stocker l'objet unique
        this.getFournisseurByDemandeDevis(); // Récupérer les fournisseurs après avoir chargé la demande

        this.offres = []; // Initialiser les offres
        this.offreMap = {}; // Initialiser l'offreMap

        // Charger les produits commandés et récupérer les offres
        this.loadProduitCommandeeData(demande.id);
        this.offreService.getOffreByDemandeDevis(demande.id).subscribe(
          (offre: NewOffre) => {
            this.offreMap[demande.id] = offre; // Stocker l'offre par ID de DemandeDevis
            this.offres.push(offre); // Ajouter l'offre à la liste des offres
            this.offre = offre; // Mettre à jour l'offre courante
            this.loadProduitOffertData(offre.id); // Charger les produits offerts pour l'offre courante
          },
          error => {
            console.error(`Erreur lors de la récupération de l'offre pour la demande de devis ID ${demande.id}:`, error);
          }
        );
      },
      error => {
        console.error('Erreur lors de la récupération de la demande de devis :', error);
      }
    );
  }

  getFournisseurByDemandeDevis(): void {
    this.demandeDevisService.getFournisseurByDemandeDevisId(this.demandeDevis.id).subscribe(
      (fournisseur: NewFournisseur) => {
        this.fournisseurs[this.demandeDevis.id] = fournisseur; 
        console.log(`Fournisseur pour la demande de devis ID ${this.demandeDevis.id} :`, fournisseur);
      },
      error => {
        console.error(`Erreur lors de la récupération du fournisseur pour la demande de devis ID ${this.demandeDevis.id}:`, error);
      }
    );
  }
  goToAddOffre(): void {
    // Naviguer vers le composant addOffre avec l'ID du demande de devis en tant que paramètre
    this.router.navigate(['/Offre/addOffre', this.demandeDevis.id]);
  }
  loadProduitCommandeeData(demandeId: number): void {
    this.produitCommandeService.getProduitCommandeeByDemandeDevisId(demandeId).subscribe(
      produitCommandeeList => {
        // Stocker la liste des produits dans la map
        this.produitCommandeeMap[demandeId] = produitCommandeeList;
        console.log(`Produits demandés pour la demande ${demandeId} :`, produitCommandeeList);
      },
      error => {
        console.log(`Erreur lors du chargement des produits demandés pour la demande ${demandeId} :`, error);
      }
    );
  }

  loadProduitOffertData(offreId: number): void {
    this.produitOffertService.getProduitOffertsByOffreId(offreId).subscribe(
      produitOffertList => {
        this.produitOffertMap[offreId] = produitOffertList;
  
        produitOffertList.forEach(produit => {
          if (produit.id) {
            this.getProduitsGroupedByBonCommande(offreId);

          } else {
            console.log(`Aucun bon de commande disponible pour le produit ${produit.id}`);
          }
        });
        console.log(`Produits offert par offre ${offreId} :`, produitOffertList);
      },
      error => {
        console.error(`Erreur lors du chargement des produits offert pour l'offre ${offreId}`, error);
      }
    );
  }
  

  Return() {
    this.add.emit(false);
    this.router.navigate(['DemandeAchat/allDemandes']);
  }

  popupViewerVisible: boolean = false;

  showPopupWF() {
    this.popupViewerVisible = true;
  }

  produitsGroupedByBonCommande: Map<number, any[]> = new Map();

  getProduitsGroupedByBonCommande(offreId: number): void {
    this.produitOffertService.getProduitsGroupedByBonCommande(offreId)
      .subscribe(
        (data: Map<number, any[]>) => {
          this.produitsGroupedByBonCommande = data;
          console.log('Group', this.produitsGroupedByBonCommande)
        },
        (error) => {
          console.error('Error fetching grouped products:', error);
        }
      );
  }


  popupHeight = window.innerHeight - 50;
  popupWidth = window.innerWidth - window.innerWidth / 3;
}
