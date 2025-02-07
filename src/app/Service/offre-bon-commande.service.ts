import { Injectable } from '@angular/core';
import { NewProduitOffert } from '../Models/produit-offert.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffreBonCommandeService {
  private produitsSelectionnesSubject = new BehaviorSubject<NewProduitOffert[]>([]);
  produitsSelectionnes$ = this.produitsSelectionnesSubject.asObservable();



  private produitsSelectionnes: NewProduitOffert[] = [];

  ajouterProduit(produit: NewProduitOffert): void {
    this.produitsSelectionnes.push(produit);
    this.produitsSelectionnesSubject.next(this.produitsSelectionnes); // Met à jour l'observable
  }

  setProduitsSelectionnes(produits: NewProduitOffert[]): void {
    this.produitsSelectionnesSubject.next(produits);
  }
  getProduitsSelectionnes(): NewProduitOffert[] {
    return this.produitsSelectionnes; // Retourne les produits sélectionnés
  }

}
