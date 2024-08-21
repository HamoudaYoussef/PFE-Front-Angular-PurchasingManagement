import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFournisseur, NewFournisseur } from 'src/app/Models/fournisseur.model';
import { NewProduit } from 'src/app/Models/produit.model';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { ProduitService } from 'src/app/Service/produit.service';

@Component({
  selector: 'app-get-fournisseur-by-id',
  templateUrl: './get-fournisseur-by-id.component.html',
  styleUrls: ['./get-fournisseur-by-id.component.scss']
})
export class GetFournisseurByIdComponent implements OnInit {

  constructor(private fournisseurService: FournisseurService,  private produitService:ProduitService , private route: ActivatedRoute
  ) { }
  fournisseur: IFournisseur;
  produits: NewProduit[] = [];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fournisseurService.getFournisseur(id).subscribe(
        (data: NewFournisseur) => this.fournisseur = data,
        (error) => console.error('There was an error!', error)
      );
    }
    this.loadProduitsByFournisseur(id)
  }
  loadProduitsByFournisseur(fournisseurId: number): void {
    this.produitService.getProduitsByFournisseur(fournisseurId).subscribe(
      produits => {
        this.produits = produits;
      },
      error => {
        console.log('Une erreur s\'est produite lors du chargement des produits : ', error);
      }
    );
  }

}
