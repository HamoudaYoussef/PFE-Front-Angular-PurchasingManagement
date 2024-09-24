import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';

@Component({
  selector: 'app-hover-add-offre',
  templateUrl: './hover-add-offre.component.html',
  styleUrls: ['./hover-add-offre.component.scss']
})
export class HoverAddOffreComponent implements OnInit {
  demandeF: FormGroup;
  produitsOfferts: FormArray;
  dataSourceElement: NewProduitOffert[] = []; // Initialiser comme un tableau vide
  offreId: number;

  constructor(private fb: FormBuilder, private produitOffertService: ProduitOffertService) { }

  ngOnInit(): void {
    this.demandeF = this.fb.group({
      id: new FormControl(''),
      reference: new FormControl(''),
      referenceoffre: new FormControl(''),
      prix: new FormControl(null),
      produitsOfferts: this.fb.array([]) // Initialiser le FormArray
    });

    this.produitsOfferts = this.demandeF.get('produitsOfferts') as FormArray;
  }

  addProduit() {
    const produitForm = this.fb.group({
      nomProduit: ['', Validators.required],
      descriptionProduit: ['', Validators.required],
      prixProduit: [0, [Validators.required, Validators.min(0)]]
    });
    this.produitsOfferts.push(produitForm);

    // Mettre à jour dataSourceElement pour le dx-data-grid
    this.dataSourceElement = this.produitsOfferts.value; // Mettre à jour avec les produitsOfferts
  }

  removeProduit(index: number) {
    this.produitsOfferts.removeAt(index);

    // Mettre à jour dataSourceElement après suppression
    this.dataSourceElement = this.produitsOfferts.value; // Mettre à jour avec les produitsOfferts
  }
}
