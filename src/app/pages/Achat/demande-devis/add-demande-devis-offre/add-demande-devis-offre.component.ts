import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitDemandeeService } from '../../../../Service/produit-demandee.service';
import { ActivatedRoute } from '@angular/router';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { IDemandeDevis, NewDemandeDevis } from '../../../../Models/demande-devis.model';
import { OffreService } from 'src/app/Service/offre.service';
import { ProduitCommandeeService } from 'src/app/Service/produit-commandee.service';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';

@Component({
  selector: 'app-add-demande-devis-offre',
  templateUrl: './add-demande-devis-offre.component.html',
  styleUrls: ['./add-demande-devis-offre.component.scss']
})
export class AddDemandeDevisOffreComponent implements OnInit {

  constructor(private fb: FormBuilder,private produitDemandeeService:ProduitDemandeeService,
    private demandeDevisService:DemandeDevisService,private offreService:OffreService,
    private produitCommandeServic:ProduitCommandeeService,    public route: ActivatedRoute,
  ) { }
  demandeF: FormGroup;
  demandeDevis:IDemandeDevis;


  ngOnInit(): void {
    this.demandeF = this.fb.group({
      nom: ['', Validators.required],
      prix: 89,
      dateoffre: [new Date(2024, 0, 1), Validators.required],  // 1er janvier 2024
      description: [''],
      referenceoffre: [this.generateReference(12), Validators.required],
      produitOfferts: this.fb.array([])  // Utilisation d'un FormArray pour les produits offerts
    });
    const id = +this.route.snapshot.paramMap.get('id');
this.getDemandeDevisById(id);
    // Charger les produits demandés liés à l'offre
    this.loadProduitsDemandes(id);
  }
  produitCommandeeMap: { [key: number]: NewProduitCommandee[] } = {}; // Déclaration de la map ici

  getDemandeDevisById(id: number): void {
    this.demandeDevisService.getDemandeDevisById(id).subscribe(
      (response: NewDemandeDevis) => {
        this.demandeDevis = response;
        this.loadProduitCommandeeData(this.demandeDevis.id)
        console.log('Demande de devis récupérée :', this.demandeDevis);

      },
      (error) => {
        console.error('Erreur lors de la récupération de la demande de devis', error);
      }
    );
  }
  loadProduitCommandeeData(demandeId: number): void {
    this.produitCommandeServic.getProduitCommandeeByDemandeDevisId(demandeId).subscribe(
      produitCommandeeList => {
        // Stocker la liste des produits dans la map
        this.produitCommandeServic[demandeId] = produitCommandeeList;
        console.log(`Produits demandés pour la demande ${demandeId} :`, produitCommandeeList);
      },
      error => {
        console.log(`Erreur lors du chargement des produits demandés pour la demande ${demandeId} :`, error);
      }
    );
  }


  // Méthode pour générer une référence aléatoire (vous pouvez la conserver si nécessaire)
  generateReference(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Charger les produits demandés à partir du backend
  loadProduitsDemandes(demandeDevisId: number): void {
    this.produitDemandeeService.getProduitDemandeByDemandeDevisId(demandeDevisId).subscribe((produitsDemandes) => {
      const produitOffertsFormArray = this.demandeF.get('produitOfferts') as FormArray;

      // Initialisation du FormArray avec les produits demandés
      produitsDemandes.forEach(produit => {
        produitOffertsFormArray.push(this.fb.group({
          nom: [produit.nom, Validators.required],
          quantite: [produit.quantite, Validators.required],
          description: [produit.description]
        }));
      });
    });
  }
 
  // Méthode pour soumettre l'offre
  submitForm(): void {
    if (this.demandeF.valid) {
      const formData = this.demandeF.value;
      this.offreService.ajouterOffre(formData).subscribe(response => {
        console.log('Offre soumise avec succès', response);
      }, error => {
        console.error('Erreur lors de la soumission de l\'offre', error);
      });
    }
  }

  // Obtenir le FormArray pour les produits offerts dans le template
  get produitOfferts(): FormArray {
    return this.demandeF.get('produitOfferts') as FormArray;
  }
  supprimerProduit(index: number): void {
    this.produitOfferts.removeAt(index);
  }
}
