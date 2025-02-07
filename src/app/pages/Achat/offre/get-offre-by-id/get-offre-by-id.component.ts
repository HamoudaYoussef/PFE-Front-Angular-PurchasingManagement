import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { NewFournisseur } from 'src/app/Models/fournisseur.model';
import { IOffre } from 'src/app/Models/offre.model';
import { IProduitOffert, NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { BonCommandeService } from 'src/app/Service/bon-commande.service';
import { OffreService } from 'src/app/Service/offre.service';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-get-offre-by-id',
  templateUrl: './get-offre-by-id.component.html',
  styleUrls: ['./get-offre-by-id.component.scss']
})
export class GetOffreByIdComponent implements OnInit {

  constructor(private route: ActivatedRoute, private offreService: OffreService,private bonCommandeService:BonCommandeService,
    private produitOffertService:ProduitOffertService,private router:Router,private cookieService:CookieService,
    private toastr:ToastrService
   ) {
     }
     displayname: string;
     @Output() produitOffertSelected = new EventEmitter<NewProduitOffert>();

  offre: IOffre;
  produitsOfferts: IProduitOffert[] = []; //
  bcForm: any = {}; 
  objectData:any;
  decissionWF: any; 
  envoyer:boolean;
  bcadd: any;
  idoffre: number; // Declare idoffre as number
  produitOffertSelectionne: NewProduitOffert[] = []; 
  fournisseur:NewFournisseur;// Tableau pour stocker les produits sélectionnés

  ngOnInit(): void {

    this.displayname = this.cookieService.get('displayname');
    const id = +this.route.snapshot.paramMap.get('id');
    this.offreService.getOffre(id) // replace with the actual ID
     .subscribe(response => {
        this.offre = response;
        console.log(this.offre);
        this.getFournisseur();
      });
      this.loadProduitsByOffreId();
  }
  loadProduitsByOffreId(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.produitOffertService.getProduitOffertsByOffreId(id).subscribe(
      produits => {
        this.produitsOfferts = produits;
      },
      error => {
        console.log('Une erreur s\'est produite lors du chargement des produits : ', error);
      }
    );
  }
  removeProduitOffert(produit: NewProduitOffert) {
    this.produitOffertSelectionne = this.produitOffertSelectionne.filter(p => p.id !== produit.id);
}
POBC(produitOffertId: number) {
  this.produitOffertService.getProduitOffert(produitOffertId).subscribe(
    (response: NewProduitOffert) => {
      console.log('Produit offert:', response);

      // Vérifier si le produit a un bon de commande et récupérer seulement l'ID du bon de commande
      const bonCommandeId = response.bonCommande?.id;
      console.log('bcId', bonCommandeId)

      // Vérifier si un produit dans la liste a déjà le même bonCommandeId

      if (bonCommandeId) {
        // Afficher un message d'avertissement si un bon de commande est déjà associé
        this.toastr.warning('ce produit a été déja effectué à un bon de commande.');
        return; // Arrêter l'exécution ici si un bon de commande existe déjà dans la liste
      }

      // Si le bon de commande n'existe pas, vérifier si le produit est déjà sélectionné
      const existingProduit = this.produitOffertSelectionne.find(p => p.id === response.id);
      if (existingProduit) {
        // Afficher un message d'avertissement si le produit a déjà été sélectionné
        this.toastr.warning('Ce produit a déjà été sélectionné.');
        return; // Arrêter l'exécution ici si le produit existe déjà
      }

      // Si le produit n'est ni affecté à un bon de commande ni déjà sélectionné, l'ajouter à la liste
      this.produitOffertSelectionne.push(response);
      this.toastr.success('Produit ajouté avec succès.');
      console.log('Produit offert ajouté:', response);
    },
    (error) => {
      console.error('Erreur lors de la récupération du produit offert:', error);
    }
  );
}

goBC() {
  console.log('Produits à envoyer :', this.produitOffertSelectionne);
  this.router.navigate(['/BonCommande/add'], { queryParams: { produits: JSON.stringify(this.produitOffertSelectionne) } });
}

onToolbarPreparing(e) {
  e.toolbarOptions.items.unshift(
      {
        location: 'center',
        template: 'Liste des produits'
      }
  );
}

getFournisseur(): void {
  const offreId = +this.route.snapshot.paramMap.get('id')!;
  this.offreService.getFournisseurByOffreId(offreId).subscribe(
    (fournisseur) => {
      this.fournisseur = fournisseur;
    },
    (error) => {
      console.error('Erreur lors de la récupération du fournisseur:', error);
    }
  );
}

  }


