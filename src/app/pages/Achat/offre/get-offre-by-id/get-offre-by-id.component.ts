import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IOffre } from 'src/app/Models/offre.model';
import { IProduitOffert } from 'src/app/Models/produit-offert.model';
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
    private produitOffertService:ProduitOffertService,private router:Router,
   ) {
     }

  offre: IOffre;
  produitsOfferts: IProduitOffert[] = []; //
  bcForm: any = {}; 
  objectData:any;
  decissionWF: any; 
  envoyer:boolean;
  bcadd: any;
  idoffre: number; // Declare idoffre as number

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.offreService.getOffre(id) // replace with the actual ID
     .subscribe(response => {
        this.offre = response;
        console.log(this.offre);
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

  goBC(){
    const id = +this.route.snapshot.paramMap.get('id');
    this.bonCommandeService.initBonCommande(id).subscribe(data => {
      console.log('ID Offre:', id);
        this.bcadd = data['id'];
        this.router.navigate(['/BonCommande/add', this.bcadd, id]); // Pass the offer ID
      });
    }
  }


