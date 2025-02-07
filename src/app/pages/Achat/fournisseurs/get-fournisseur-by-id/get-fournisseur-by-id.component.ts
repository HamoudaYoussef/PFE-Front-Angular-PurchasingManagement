import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFournisseur, NewFournisseur } from 'src/app/Models/fournisseur.model';
import { NewOffre } from 'src/app/Models/offre.model';
import { IProduitOffert, NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { NewProduit } from 'src/app/Models/produit.model';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { OffreService } from 'src/app/Service/offre.service';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { ProduitService } from 'src/app/Service/produit.service';
import * as L from 'leaflet';
import 'leaflet-control-geocoder'; // Ajoutez cette ligne
import { HttpClient } from '@angular/common/http';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { ProduitCommandeeService } from 'src/app/Service/produit-commandee.service';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';
@Component({
  selector: 'app-get-fournisseur-by-id',
  templateUrl: './get-fournisseur-by-id.component.html',
  styleUrls: ['./get-fournisseur-by-id.component.scss']
})
export class GetFournisseurByIdComponent implements OnInit {

  constructor(private fournisseurService: FournisseurService,private offreService:OffreService,
    private produitService:ProduitService , private http:HttpClient,private demandeDevisService:DemandeDevisService,
    private route: ActivatedRoute,private produitOffertService:ProduitOffertService,
    private produitCommandeeService:ProduitCommandeeService
  ) {
    this.customIcon = L.icon({
      iconUrl: 'assets/img/icone-gps-removebg-preview.png', // chemin vers l'image de l'icône
      iconSize: [20, 32], // taille de l'icône
      iconAnchor: [10, 32], // point d'ancrage de l'icône
      popupAnchor: [0, -32] // point d'ancrage de la popup par rapport à l'icône
    });
   }
   isModalOpen = false;
   fullText = '';
  fournisseur: IFournisseur;
  offres:NewOffre[];
  offre:NewOffre;

  produitsOfferts: IProduitOffert[] = [];
  demandesDevis: NewDemandeDevis[] //
  private customIcon: L.Icon; // Définir customIcon comme propriété de classe

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fournisseurService.getFournisseur(id).subscribe(
        (data: NewFournisseur) => {
          this.fournisseur = data;
      //    this.getOffresByFournisseur();
          this.getDemandeDevisByFournisseur(id);
        },
        (error) => console.error('There was an error!', error)
      );
      }
  }
  
  
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Liste des produits commandées'
        }
    );
  }
  onToolbarPreparingO(e) {
    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Liste des produits offert'
        }
    );
  }
  offresParDemandeDevis: { [key: number]: NewOffre } = {}; // Un dictionnaire pour stocker une seule offre par demandeDevis

  getDemandeDevisByFournisseur(fournisseurId: number): void {
    this.demandeDevisService.getDemandeDevisByFournisseur(fournisseurId).subscribe(
      (data: NewDemandeDevis[]) => {
        this.demandesDevis = data;  
        // Charger les produits pour chaque offre
        this.demandesDevis.forEach((demandeDevis) => {
          this.loadProduitsByDemandeDevisId(demandeDevis.id);            
          this.offreService.getOffreByDemandeDevis(demandeDevis.id).subscribe({
            next: (offre) => {
              // Stocker l'offre comme un objet (pas un tableau)
              this.offresParDemandeDevis[demandeDevis.id] = offre; // Assigner un objet NewOffre
  
              // Log l'offre pour débogage
              console.log('Offre pour la demandeDevis', offre);
  
              // Charger les produits pour l'offre
              this.loadProduitsByOffreId(offre.id);
            },
            error: (error) => {
              console.error("Erreur lors de la récupération des offres :", error);
            }
          });
        });// Remplir le tableau avec les données récupérées
      },
      (error) => {
        console.error('Erreur lors de la récupération des demandes de devis', error);
      }
    );
  }
  produitsCommandeesParDemandeDevis: { [key: number]: NewProduitCommandee[] } = {};

  loadProduitsByDemandeDevisId(demandeDevisId: number): void {
    this.produitCommandeeService.getProduitCommandeeByDemandeDevisId(demandeDevisId).subscribe({
      next: (produits) => {
        // Stocker les produits offerts pour chaque offre dans un dictionnaire
        this.produitsCommandeesParDemandeDevis[demandeDevisId] = produits;
        console.log("produits commandee",produits);
      },
      error: (error) => {
        console.error("Une erreur s'est produite lors du chargement des produits :", error);
      }
    });
  }
  produitsOffertsParOffre: { [key: number]: NewProduitOffert[] } = {};
  loadProduitsByOffreId(offreId: number): void {
    this.produitOffertService.getProduitOffertsByOffreId(offreId).subscribe({
      next: (produits) => {
        // Stocker les produits offerts pour chaque offre dans un dictionnaire
        this.produitsOffertsParOffre[offreId] = produits;
        console.log("produits offerts",produits);
      },
      error: (error) => {
        console.error("Une erreur s'est produite lors du chargement des produits :", error);
      }
    });
  }
  

  enModal(text: string) {
    this.fullText = text;
    this.isModalOpen = true;
  }
  map: any;
adresseChoisie: string = '';
marqueur: any;
latitude: number | null = null;
longitude: number | null = null;

private clicksEnabled: boolean = false; // Initialement désactivé

  isExpanded = false;
  toggleDescription() {
    this.isExpanded = !this.isExpanded;
  }
}
