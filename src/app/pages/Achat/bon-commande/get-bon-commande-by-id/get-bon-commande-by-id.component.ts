import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BonCommandeService } from 'src/app/Service/bon-commande.service';
import { IBonCommande, NewBonCommande } from '../../../../Models/bon-commande.model';
import { FormControl, FormGroup,FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnvService } from 'src/env.service';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { GeneratePdfService } from 'src/app/Service/generate-pdf.service';

@Component({
  selector: 'app-get-bon-commande-by-id',
  templateUrl: './get-bon-commande-by-id.component.html',
  styleUrls: ['./get-bon-commande-by-id.component.scss']
})
export class GetBonCommandeByIdComponent implements OnInit {

  constructor(private route: ActivatedRoute,private bonCommandeService:BonCommandeService,private produitOffertService:ProduitOffertService,
     private toastr:ToastrService, private env:EnvService,private router:Router,private fb: FormBuilder,private pdfGeneratorService:GeneratePdfService) { }

  @Output() add = new EventEmitter<boolean>();
  produitsOfferts: NewProduitOffert[] = [];

  bcForm: any = {}; 
  objectData:any;
  decissionWF: any; 
  envoyer:boolean;
  demandeForm: any = {};  // Initialisez ou obtenez cet objet d'une source appropriée
  bcadd: any;
 // idoffre=  +this.route.snapshot.paramMap.get('id');
  bcObject: any = {};  // Initialisez ou obtenez cet objet d'une source appropriée
  bonCommande: IBonCommande;
  offreId?: number;


  demandeF: FormGroup; // FormGroup pour le formulaire


  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');   
    this.getProduitsOfferts();      

    this.demandeF = this.fb.group({
      numero: [''],
      reference: [''],
      delailivraison: [''],
      typelivraison: ['']
    });

    // Récupère les données du bon de commande et injecte-les dans le formulaire
    this.getBonCommande();
  }

  generatePDF() {
    this.pdfGeneratorService.generatePDF(this.bonCommande, this.produitsOfferts);
  }

  getProduitsOfferts(): void {
    this.produitOffertService.getProduitOffertsByBonCommandeId(+this.route.snapshot.paramMap.get('id'))
      .subscribe(
        (data: NewProduitOffert[]) => {
          this.produitsOfferts = data;
          console.log('Produits offerts:', this.produitsOfferts);
        },
        (error) => {
          console.error('Erreur lors de la récupération des produits offerts', error);
        }
      );
  }

  getBonCommande(): void {
    this.bonCommandeService.getBonCommande(+this.route.snapshot.paramMap.get('id')).subscribe(
      (data: NewBonCommande) => {
        this.bonCommande = data;
        // Mettez à jour les champs du formulaire avec les données récupérées
        this.demandeF.patchValue({
          numero: data.numero, // Numéro de commande
          reference: data.reference, // Référence du bon de commande
          delailivraison: data.delailivraison, // Délai de livraison, à ajuster selon votre modèle
          typelivraison: data.typelivraison // Modalité de livraison, à ajuster selon votre modèle
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des données du bon de commande', error);
      }
    );
  }
  calculateTotalPrice(rowData: NewProduitOffert): number {
    const quantite = rowData.quantite || 0; // Gérer les valeurs nulles ou indéfinies
    const prix = rowData.prix || 0;         // Gérer les valeurs nulles ou indéfinies
    return quantite * prix;
  } 
  customizeTotalText(options: any): string {
    return `${options.value} DT`; // Ajoute 'DT' après la valeur
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
