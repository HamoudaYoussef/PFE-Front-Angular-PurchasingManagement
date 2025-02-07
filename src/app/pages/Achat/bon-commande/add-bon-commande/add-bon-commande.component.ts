import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewBonCommande } from 'src/app/Models/bon-commande.model';
import { InfoPaiement } from 'src/app/Models/enumerations/info-paiement.model';
import { TypeLivraison } from 'src/app/Models/enumerations/type-livraison.model';
import { NewOffre } from 'src/app/Models/offre.model';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { BonCommandeService } from 'src/app/Service/bon-commande.service';
import { OffreBonCommandeService } from 'src/app/Service/offre-bon-commande.service';
import { OffreService } from 'src/app/Service/offre.service';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { EnvService } from 'src/env.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import 'leaflet-control-geocoder'; // Ajoutez cette ligne
declare const google: any;

@Component({
  selector: 'app-add-bon-commande',
  templateUrl: './add-bon-commande.component.html',
  styleUrls: ['./add-bon-commande.component.scss']
})

export class AddBonCommandeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private bonCommandeService: BonCommandeService,
    private produitOffertService:ProduitOffertService,private offreBonCommandeService:OffreBonCommandeService,
    private offreService: OffreService, private toastr: ToastrService, private env: EnvService,private router:Router,
    private http: HttpClient,private changeDetectorRef: ChangeDetectorRef) {
      this.customIcon = L.icon({
        iconUrl: 'assets/img/icone-gps-removebg-preview.png', // chemin vers l'image de l'icône
        iconSize: [20, 32], // taille de l'icône
        iconAnchor: [10, 32], // point d'ancrage de l'icône
        popupAnchor: [0, -32] // point d'ancrage de la popup par rapport à l'icône
      });
     }
    @Output() add = new EventEmitter<boolean>();
    produitsSelectionnes: NewProduitOffert[] = [];
    latitude: number | null = null;
    longitude: number | null = null;
    private customIcon: L.Icon; // Définir customIcon comme propriété de classe

    produitOffert:NewProduitOffert;
  demandeForm: any = {}; 
  objectData:any;
  decissionWF: any; 
  envoyer:boolean;
  demandeF: FormGroup;
 // referenceOffre: string;
  typeLivraisonEnum = TypeLivraison;
  typeLivraisonOptions: string[] = Object.values(TypeLivraison);
  infoPaiementEnum = InfoPaiement;
  infoPaiementOptions: string[];
  produitOffertArray: any[];  // Tableau pour dx-data-grid
  afficherCarte = false;
  adresselivraison = '';
  map: any;
  marqueur: any;
  adresseChoisie: string = '';
  // Initialisez ou obtenez cet objet d'une source appropriée

  // Initialisez ou obtenez cet objet d'une source appropriée

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['produits']) {
        // Analyser les produits à partir des queryParams
        this.produitsSelectionnes = JSON.parse(params['produits']);
        console.log('Produits récupérés dans AddBonCommande :', this.produitsSelectionnes);
      }
    });
    const id = +this.route.snapshot.paramMap.get('produitOffertId');
    console.log('ID récupéré depuis l\'URL :', id);
    this.demandeF= new FormGroup({
      id: new FormControl(''),
      reference: new FormControl(''),
      numero: new FormControl(''),
      referenceoffre: new FormControl(''),
      dateoffre: new FormControl(''),
      prix: new FormControl(null),
      delailivraison: new FormControl(null),
      typelivraison: new FormControl(''),
      adresselivraison: new FormControl(''),
    });

    /*this.offreBonCommandeService.produitsSelectionnes$.subscribe(
      (produits: NewProduitOffert[]) => {
        this.produitsSelectionnes = produits;
        console.log('Produits récupérés dans addboncommande après abonnement:', this.produitsSelectionnes);
      }
    );*/
    this.demandeF.patchValue({
      reference: this.generateReference(12),
      numero:this.generateNumero(5),
      adresselivraison:this.adresseChoisie });
  }
  bonCommandeDTO: NewBonCommande = null;
  get isDomicileSelected(): boolean {
    return this.demandeF.get('typelivraison')?.value === this.typeLivraisonEnum.Domicile;
  }

  get isPointDeVenteSelected(): boolean {
    this.demandeF.patchValue({ adresselivraison: 'point de vente' });
    return this.demandeF.get('typelivraison')?.value === this.typeLivraisonEnum.PointDeVente;
  }
  createBonCommande() {
    if (!this.bonCommandeDTO) {
      this.bonCommandeDTO = {
        id: null,
        dateboncommande: null,
        reference: '',
        numero: '',
        delailivraison: null,
        typelivraison: null,
        adresselivraison: '',
      };
    }
  
    const formValues = this.demandeF.value;
  
    // Mettre à jour le bon de commande DTO avec les valeurs du formulaire
    this.bonCommandeDTO = {
      ...this.bonCommandeDTO,
      reference: formValues.reference,
      numero: formValues.numero,
      delailivraison: formValues.delailivraison,
      typelivraison: formValues.typelivraison,
      adresselivraison: formValues.adresselivraison,
    };
  
    // Enregistrez le bon de commande
    this.bonCommandeService.createBonCommande(this.bonCommandeDTO).subscribe(
      (response) => {
        this.toastr.success('BonCommande créé avec succès !');
        this.router.navigate(['BonCommande/boncommandes']);

        // Mise à jour des produits sélectionnés pour ajouter la référence au bon de commande
        const bonCommandeId = response.id; // ID du bon de commande créé
  
        this.produitsSelectionnes.forEach(produit => {
          const updatedProduit = {
            ...produit,
            // Remplissez les champs nécessaires ici
            // Par exemple : reference: produit.reference
          };
  
          this.produitOffertService.updateProduitOffert(produit.id, bonCommandeId, updatedProduit).subscribe(
            () => {
              console.log(`ProduitOffert ${produit.id} mis à jour avec le bon de commande ${bonCommandeId}`);
            },
            (error) => {
              this.toastr.error('Erreur lors de la mise à jour du ProduitOffert');
              console.error('Erreur lors de la mise à jour du ProduitOffert:', error);
            }
          );
        });
      },
      (error) => {
        this.toastr.error('Erreur lors de la création de BonCommande');
        console.error('Erreur lors de la création de BonCommande:', error);
      }
    );
  }

  generateReference(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  generateNumero(length: number): string {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  calculateTotalPrice(rowData: NewProduitOffert): number {
    const quantite = rowData.quantite || 0; // Gérer les valeurs nulles ou indéfinies
    const prix = rowData.prix || 0;         // Gérer les valeurs nulles ou indéfinies
    return quantite * prix;
  } 
  customizeTotalText(options: any): string {
    return `${options.value} DT`; // Ajoute 'DT' après la valeur
  }
  ouvrirCarte() {
    this.afficherCarte = true;

    // Utilisez setTimeout pour vous assurer que l'élément est rendu avant d'initialiser la carte
    setTimeout(() => {
        // Vérifiez que l'élément DOM est présent
        const mapElement = document.getElementById('map');
        if (mapElement) {
            console.log("L'élément de carte est présent.");
            this.initMap();
        } else {
            console.error("L'élément de carte n'a pas été trouvé.");
        }
    }, 0); // 0 ms pour exécuter après que le rendu soit terminé

}

initMap() {
  console.log("Initialisation de la carte...");

  if (!this.map) {
    this.map = L.map('map').setView([48.8566, 2.3522], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Ajouter le contrôle de géocodage sans marquer automatiquement
    const geocoderControl = L.Control.geocoder({
      defaultMarkGeocode: false, // Désactiver le marquage automatique
    })
      .on('markgeocode', (e: any) => {
        const { center } = e.geocode;
        this.map.setView(center, 12);
        this.adresseChoisie = e.geocode.name;

        // Ajouter un marqueur aux coordonnées trouvées avec l'icône personnalisée
        this.addMarkerByCoordinates(center.lat, center.lng);
      })
      .addTo(this.map);

    // Ajouter un contrôle de recherche dans le coin supérieur droit
    const searchControl = L.Control.geocoder({
      position: 'topright'
    }).addTo(this.map);
  } else {
    console.log("La carte existe déjà.");
    this.map.invalidateSize();
  }

  // Ajouter un marqueur personnalisé lors d'un clic sur la carte
  this.map.on('click', (event: any) => {
    const { lat, lng } = event.latlng;
    this.addMarkerByCoordinates(lat, lng);
    this.reverseGeocode(lat, lng);
  });
}

// Méthode pour ajouter un marqueur avec une icône personnalisée aux coordonnées spécifiées
addMarkerByCoordinates(lat: number, lng: number) {
  if (this.marqueur) {
    this.map.removeLayer(this.marqueur); // Supprimer le marqueur précédent s'il existe
  }

  // Ajouter le marqueur avec les coordonnées spécifiées et l'icône personnalisée
  this.marqueur = L.marker([lat, lng], { icon: this.customIcon })
    .addTo(this.map)
    .bindPopup(`<strong>Position :</strong><br>Latitude: ${lat}, Longitude: ${lng}`)
    .openPopup();
}
fermerCarte() {
  if (this.marqueur) {
      this.map.removeLayer(this.marqueur);
      this.marqueur = null;
  }

  // Supprimez complètement la carte
  if (this.map) {
      this.map.remove();
      this.map = null;
  }

  this.afficherCarte = false;
  console.log("affichercarte", this.afficherCarte);
}
reverseGeocode(lat: number, lng: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  this.http.get(url).subscribe((data: any) => {
    this.adresseChoisie = data.display_name; // Stockez l'adresse lisible
    this.latitude = lat; // Stocker la latitude
    this.longitude = lng; // Stocker la longitude
    console.log("Adresse trouvée:", this.adresseChoisie);
    console.log("Coordonnées GPS:", this.latitude, this.longitude);
  });
}
confirmerAdresse() {
  if (this.adresseChoisie) {
      this.demandeF.patchValue({ adresselivraison: this.adresseChoisie });
      console.log("Adresse patchée dans le formulaire :", this.adresseChoisie);

      // Attendez un court instant pour voir si la valeur est appliquée
      setTimeout(() => {
          console.log("Adresse confirmée (dans demandeF):", this.demandeF.get('adresselivraison')?.value);
      }, 100); // Attente de 100 ms pour la mise à jour du DOM

      this.fermerCarte();
  } else {
      console.error("Aucune adresse n'a été choisie.");
  }
}
  getProduitOffertById(id: number): void {
    this.produitOffertService.getProduitOffert(id).subscribe(
      (response: NewProduitOffert) => {
        this.produitOffert = response;
        console.log('Demande de devis récupérée :', this.produitOffert);
      },
      (error) => {
        console.error('Erreur lors de la récupération de la demande de devis', error);
      }
    );
  }

  Return() {
    this.add.emit(false)
    this.router.navigate(['DemandeAchat/allDemandes']);
  }
  
  popupViewerVisible: any = false;
  showPopupWF() {
    this.popupViewerVisible = true;
  }
  popupHeight = window.innerHeight-50;
  popupWidth = window.innerWidth - window.innerWidth / 3;

}
