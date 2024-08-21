import { Injectable } from '@angular/core';
import { NewProduitDemandee } from '../Models/produit-demandee.model';

@Injectable({
  providedIn: 'root'
})
export class DevisDaSharedService {

  constructor() { }

  private selectedData: NewProduitDemandee[];

  setSelectedData(data: NewProduitDemandee[]) {
    this.selectedData = data;
  }

  getSelectedData(): NewProduitDemandee[] {
    return this.selectedData;
  }
}
