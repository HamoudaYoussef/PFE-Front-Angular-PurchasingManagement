import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OffreService } from 'src/app/Service/offre.service';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { NewOffre } from 'src/app/Models/offre.model';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-offre',
  templateUrl: './add-offre.component.html',
  styleUrls: ['./add-offre.component.scss']
})
export class AddOffreComponent implements OnInit {

  demandeF: FormGroup;
  produitsOfferts: FormArray;
  dataSourceElement: NewProduitOffert[] = []; 
  produitsAjoutes: NewProduitOffert[] = [];

  constructor(private fb: FormBuilder, private offreService: OffreService, private produitOffertService: ProduitOffertService
    ,private router: Router
  ) {}

  ngOnInit(): void {
    this.demandeF = this.fb.group({
      nom: ['', Validators.required],
      prix: 89,
      dateoffre: [new Date(2024, 0, 1), Validators.required],  // 1er janvier 2024
      description: [''],
      referenceoffre: [this.generateReference(12), Validators.required],
      produitOfferts: this.fb.array([]) // Assurez-vous que c'est bien défini
    });
  
    this.produitsOfferts = this.demandeF.get('produitOfferts') as FormArray;
  }
  
  generateReference(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  addProduit() {
    const produitForm = this.fb.group({
      nom: ['', Validators.required],
      descriptionProduit: ['', Validators.required],
      quantite: [0, [Validators.required, Validators.min(0)]],
      prix: [0, [Validators.required, Validators.min(0)]]
    });

    // Ajouter le produit au FormArray
    this.produitsOfferts.push(produitForm);

    // Mettre à jour dataSourceElement avec les produits actuels dans le FormArray
    this.dataSourceElement = this.produitsOfferts.value;
  }

  removeProduit(index: number) {
    this.produitsOfferts.removeAt(index);

    // Mettre à jour dataSourceElement après la suppression
    this.dataSourceElement = this.produitsOfferts.value;
  }

  addOffreP() {
    console.log('Formulaire complet avant soumission :', this.demandeF.value);
    
    const offreDTO: NewOffre = {
      demandeachat: null,
      fournisseur: null,
      id: null,
      nom: this.demandeF.get('nom').value,
      prix: this.demandeF.get('prix').value,
      dateoffre: this.demandeF.get('dateoffre').value,
      description: this.demandeF.get('description').value,
      referenceoffre: this.demandeF.get('referenceoffre').value,
      produitsOfferts: this.produitsOfferts.value  // Utilisation correcte du FormArray
    };
  
    this.offreService.ajouterOffre(this.demandeF.value).subscribe({
      next: (response) => {
        this.router.navigate(['/Offre/allOffres']);
        console.log('Offre créée avec succès');

      },
      error: (error) => {
        console.error('Erreur lors de la création de l\'offre', error);
      }
    });
  }
  
  
  onRowInserted(e: any) {
    const produitOffert = e.data;
  
    // Ajouter le produit au FormArray
    const produitForm = this.fb.group({
      nom: [produitOffert.nom, Validators.required],
      description: [produitOffert.description, Validators.required],
      quantite: [produitOffert.quantite, [Validators.required, Validators.min(0)]],
      prix: [produitOffert.prix, [Validators.required, Validators.min(0)]]
    });
  
    this.produitsOfferts.push(produitForm);
  
    // Mettre à jour dataSourceElement avec le nouveau produit ajouté
    this.syncProduitOffertsWithDataSource();
  
    console.log("FormArray produitOfferts après insertion :", this.produitsOfferts.value);
  }
  syncProduitOffertsWithDataSource() {
    // Vider le FormArray produitOfferts
    this.produitsOfferts.clear();

    // Ajouter chaque élément de dataSourceElement dans le FormArray produitOfferts
    this.dataSourceElement.forEach(produit => {
      const produitForm = this.fb.group({
        nom: [produit.nom, Validators.required],
        descriptionProduit: [produit.description, Validators.required],
        quantite: [produit.quantite, [Validators.required, Validators.min(0)]],
        prix: [produit.prix, [Validators.required, Validators.min(0)]]
      });

      this.produitsOfferts.push(produitForm);
    });
  }

  remplirProduitsOfferts() {
    // Vider l'ancien contenu du FormArray
    while (this.produitsOfferts.length !== 0) {
      this.produitsOfferts.removeAt(0);
    }
  
    // Ajouter chaque produit de dataSourceElement au FormArray
    this.dataSourceElement.forEach((produit) => {
      const produitFormGroup = this.fb.group({
        nom: [produit.nom, Validators.required],
        descriptionProduit: [produit.description, Validators.required],
        quantite: [produit.quantite, [Validators.required, Validators.min(0)]],
        prix: [produit.prix, [Validators.required, Validators.min(0)]]
      });
  
      this.produitsOfferts.push(produitFormGroup); // Ajouter au FormArray
    });
  
    console.log('FormArray produitOfferts après remplissage :', this.produitsOfferts.value);
  }
}
