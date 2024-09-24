import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IDemandeDevis, NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { NewProduit } from 'src/app/Models/produit.model';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { ProduitService } from 'src/app/Service/produit.service';
import { EnvService } from 'src/env.service';
import { FournisseurService } from '../../../../Service/fournisseur.service';
import { NewFournisseur } from '../../../../Models/fournisseur.model';

@Component({
  selector: 'app-get-dd-by-id',
  templateUrl: './get-dd-by-id.component.html',
  styleUrls: ['./get-dd-by-id.component.scss']
})
export class GetDdByIdComponent implements OnInit {
  constructor(private route: ActivatedRoute,private demandeDevisService:DemandeDevisService,private fournisseurService: FournisseurService,
    private produitDemandeeService:ProduitDemandeeService, private toastr: ToastrService, private env: EnvService,private router:Router) { }
    @Output() add = new EventEmitter<boolean>();
    produitsDemandesStatus: { [key: string]: string } = {};
    fournisseurNom: string; // Pour stocker le nom du fournisseur

    produitDemandeeList: NewProduitDemandee[] = [];
    products : NewProduit[] = [];
  demandeDevis: IDemandeDevis;
  demandeDevisObject: any = {};  // Initialisez ou obtenez cet objet d'une source appropriée
  pageSize = this.env.pageSize;
    allowedPageSizes = this.env.allowedPageSizes;
  produits: NewProduitDemandee[] = [];
  demandeForm: any = {};  // Initialisez ou obtenez cet objet d'une source appropriée
  decissionWF: any;  // Initialisez ou obtenez cet objet d'une source appropriée
  objectData:any;
  envoyer : boolean=false ;
  valider : boolean=false;
  currentdate : Date;
  dataSourceElement: any;
  produitDemandees: NewProduitDemandee[] = [];
produit : NewProduit;
  showButton:any;

  ngOnInit(): void {
    this.currentdate = new Date(); // Initialiser currentdate ici
 
    const id = +this.route.snapshot.paramMap.get('id');
    this.getDemandeDevisById(id);
    this.loadProduitsByDemandeDevisId();
  }
  getDemandeDevisById(id: number): void {
    this.demandeDevisService.getDemandeDevisById(id).subscribe(
      (response: NewDemandeDevis) => {
        this.demandeDevis = response;
        console.log('Demande de devis récupérée :', this.demandeDevis);
        this.loadFournisseurById(this.demandeDevis.fournisseurId);

      },
      (error) => {
        console.error('Erreur lors de la récupération de la demande de devis', error);
      }
    );
  }
  
  loadProduitsByDemandeDevisId(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.produitDemandeeService.getProduitDemandeByDemandeDevisId(id).subscribe(
      produits => {
        this.produits = produits;
        console.log('Produits chargés:', this.produits); // Vérifiez les données

        this.dataSourceElement = new CustomStore({
          load: (loadOptions: any) => {
            loadOptions.requireTotalCount = true;
            const size = loadOptions.take || this.pageSize;
            const startIndex = loadOptions.skip || 0;
            const endIndex = startIndex + size;
            const paginatedData = this.produits.slice(startIndex, endIndex);
  
            return Promise.resolve({
              data: paginatedData,
              totalCount: this.produits.length,
            });
          },
        });
  
        // Load produitDemandee data as well
        this.loadProduitDemandeeData(id);
  
        // Appelez la méthode compareQuantites après que les données aient été chargées
      },
      error => {
        console.log('Une erreur s\'est produite lors du chargement des produits : ', error);
      }
    );
  }

  
  loadProduitDemandeeData(id: number): void {
    this.produitDemandeeService.getProduitDemandeByDemandeDevisId(id).subscribe(
      produitDemandeeList => {
        this.produitDemandeeList = produitDemandeeList;
        console.log('Produits demandés chargés:', this.produitDemandeeList); // Vérifiez les données
      },
      error => {
        console.log('Une erreur s\'est produite lors du chargement des produits demandés : ', error);
      }
    );
  }
  getFournisseurName(demandeDevisId: number): Observable<string> {
    return this.demandeDevisService.getFournisseurName(demandeDevisId);
  }
  loadFournisseurById(fournisseurId: number): void {
    this.fournisseurService.getFournisseur(fournisseurId).subscribe(
      (fournisseur: NewFournisseur) => {
        this.fournisseurNom = fournisseur.nom; // Stocker le nom du fournisseur
      },
      (error) => {
        console.error('Erreur lors de la récupération du fournisseur', error);
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
