import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OffreService } from 'src/app/Service/offre.service';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { IOffre, NewOffre } from 'src/app/Models/offre.model';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from '../../../Global/shared-service/token-storage.service';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { EnvService } from 'src/env.service';
import { ToastrService } from 'ngx-toastr';
import { NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { CategorieService } from 'src/app/Service/categorie.service';
import { NewCategorie } from 'src/app/Models/categorie.model';
import { ProduitService } from 'src/app/Service/produit.service';
import { format } from 'date-fns';
import { ProduitCommandeeService } from 'src/app/Service/produit-commandee.service';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { take } from 'rxjs';
import { NewFournisseur } from 'src/app/Models/fournisseur.model';
import { WebSocketService } from 'src/app/Service/web-socket.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-offre',
  templateUrl: './add-offre.component.html',
  styleUrls: ['./add-offre.component.scss']
})
export class AddOffreComponent implements OnInit {
  selectedCategorieId: number | null = null;
  isPopupVisible: boolean = false;
  demandeF: FormGroup;
  fournisseurId: number | undefined;
  produitsOfferts: FormArray;
  dataSourceElement: NewProduitOffert[] = []; 
  produitsAjoutes: NewProduitOffert[] = [];
  dataSourceElementDD: any=[];
  dataSourceElementPC: any=[];
  offre: IOffre; // Offre courante
  offerExists = false;  // Boolean to control toast visibility

  pageSize = 10;
  allowedPageSizes = [10, 20, 50];
  selectedId: number; 
  demandesDevis:NewDemandeDevis[];
  selectedOffreId:number;
  categoryOptions: any; // Déclarer un objet pour les options de catégorie
  filteredProducts = [];
  categories: NewCategorie[] = [];
  totalPrixGeneral:number;
  produits: NewProduitCommandee[] = [];
  fournisseurs: any[] = [];
  fournisseurName: string | undefined;
  fournisseurDetails: any;
  formDataP: NewProduitOffert;
  demandeDevisId:number;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridDemande', {static: false}) dataGridDemande: DxDataGridComponent;
  constructor(private fb: FormBuilder, private offreService: OffreService, private produitOffertService: ProduitOffertService
    ,private router: Router,private httpClient:HttpClient,private tokenStorage:TokenStorageService,private env: EnvService,
    private toastr: ToastrService,private categorieService:CategorieService,private produitService:ProduitService,
    private ProduitCommandeeService:ProduitCommandeeService,private fournisseurService:FournisseurService,
    private demandeDevisService:DemandeDevisService,private webSocketService: WebSocketService,
    private cookieService: CookieService,
    private route:ActivatedRoute,private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.demandeF = this.fb.group({
      nom: ['', Validators.required],
      prix: 0,
      dateoffre: ['', Validators.required],  // 1er janvier 2024
      description: [''],
      referenceoffre: [this.generateReference(12), Validators.required],
    });
    this.categorieService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.categoryOptions = {
        items: this.categories,
        displayExpr: 'nom',
        valueExpr: 'id',
        placeholder: 'Sélectionner une catégorie',
        onValueChanged: (e) => this.onCategorieChange(e)  // Lier la méthode onCategorieChange
      };
    });
   // this.produitsOfferts = this.demandeF.get('produitOfferts') as FormArray;
    this.getRequestCaseLazy() ;
    this.loadProduitsByDemandeDevis();
    this.getFournisseurByDemandeDevis();
console.log("prix",this.totalPrixGeneral)


    this.offreService.getOffreByDemandeDevis(+this.route.snapshot.paramMap.get('demandeDevisId')).subscribe(
      (data) => {
        this.offre = data;
        if (this.offre) {
           this.toastr.info("Vous ne pouvez pas ajouter une nouvelle offre car une offre existe déjà.")
          this.loadProduitsOfferts();
          // Set offerExists to true if an offer already exists
        }

      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'offre', error);
      }
    );
  }

  loadProduitsOfferts(): void {
    this.produitOffertService.getProduitOffertsByOffreId(this.offre.id).subscribe(
      (data) => {
        this.dataSourceElement = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits offerts', error);
      }
    );
  }
  


  
  loadProduitsByDemandeDevis(): void {
    this.ProduitCommandeeService.getProduitCommandeeByDemandeDevisId(+this.route.snapshot.paramMap.get('demandeDevisId')).subscribe(
      produits => {
        this.produits = produits;
        this.dataSourceElementPC = new CustomStore({
          load: (loadOptions: any) => {
            loadOptions.requireTotalCount = true;
            const size = loadOptions.take || this.env.pageSize;
            const startIndex = loadOptions.skip || 0;
            const endIndex = startIndex + size;
            const paginatedData = this.produits.slice(startIndex, endIndex);
  
            return Promise.resolve({
              data: paginatedData,
              totalCount: this.produits.length,
            });
          },
        });        },
      error => {
        console.log('Une erreur s\'est produite lors du chargement des produits : ', error);
      }
    );
  }
  onContentReady(e: any) {
    this.getTotalSummary(e.component);
  }

  getFournisseurByDemandeDevis(): void {
    this.demandeDevisService.getFournisseurByDemandeDevisId(+this.route.snapshot.paramMap.get('demandeDevisId')).subscribe(
      (fournisseur: NewFournisseur) => {
        this.fournisseurDetails = fournisseur; 
       console.log(`Fournisseur pour la demande de devis ID :`, fournisseur);
      },
      error => {
       // console.error(`Erreur lors de la récupération du fournisseur pour la demande de devis ID ${this.demandeDevis.id}:`, error);
      }
    );
  }
  // Méthode pour récupérer la somme totale
  getTotalSummary(gridComponent: any) {
    const totalItem = gridComponent.getTotalSummaryValue('Total');
    
    if (totalItem) {
      this.totalPrixGeneral = totalItem;
      console.log("Total général:", this.totalPrixGeneral);
      this.demandeF.patchValue({ prix: this.totalPrixGeneral });
      console.log('Prix mis à jour dans le formulaire:', this.demandeF.get('prix')?.value);
      // Afficher la somme dans la console
    } else {
      console.log("Total général non trouvé");
    }
  }


  onCategorieChange(e: any): void {
    const categorieId = e.value;  // Récupérer l'ID de la catégorie sélectionnée
    console.log("Catégorie sélectionnée : ", categorieId);
    
    this.selectedCategorieId = categorieId;
  
    // Charger les produits en fonction de la catégorie sélectionnée
    if (categorieId) {
      this.produitService.getProduitsByCategorie(categorieId).subscribe(produits => {
        this.filteredProducts = produits;
        console.log("Produits récupérés : ", this.filteredProducts);
      });
    } else {
      this.filteredProducts = [];
    }
  }
  generateReference(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

 
  calculateTotalPrice(rowData: any): number {
    const quantite = rowData.quantite || 0; // Gérer les valeurs nulles ou indéfinies
    const prix = rowData.prix || 0;         // Gérer les valeurs nulles ou indéfinies
    return quantite * prix;
  } 
  onOptionChanged(event: any): void {
    if (event.fullName === 'summary.totalItems[0].value') {
      const totalGeneral = this.dataGrid.instance.getTotalSummaryValue('Total');
      this.onTotalChanged({ value: totalGeneral });
    }
  }
  
  customizeTotalText(options: any): string {
    return `${options.value} DT`; // Ajoute 'DT' après la valeur
  }
  onTotalChanged(event: any): void {
    this.totalPrixGeneral = event.value;
    console.log('Total général mis à jour:', this.totalPrixGeneral);


    
    // Si tu veux stocker cette valeur dans une table offre, tu peux l'affecter ici
  }
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          template: 'ExportPDF'
        });
    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Liste des demandes de devis'
        }
    );
  }
  onToolbarPreparingPO(e) {
    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Liste des produits offerts'
        }
    );
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          hint: 'Add',
          icon: 'plus',
          onClick: () => this.onRowInserting(),
        },
      }
    );
  }
  onToolbarPreparingPC(e) {
    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Liste des produits commandées'
        }
    );
  }
  id
     Editdemande(id) {
    // Set the ID property
    this.id = id.data.id;
    // Navigate to the add-demande component with the specific ID
    this.router.navigate(['DemandeDevis/demandeDevis', this.id]);
}
  removeProduit(index: number) {
    this.produitsOfferts.removeAt(index);

    // Mettre à jour dataSourceElement après la suppression
    this.dataSourceElement = this.produitsOfferts.value;
  }
  isFieldInvalid(field: string): boolean {
    return !this.demandeF.get(field).valid && (this.demandeF.get(field).touched || this.demandeF.get(field).dirty);
  }  
  currentDate: string;
  customizeTotalGeneralText(e: any): string {
    // Formate la valeur avec 2 décimales et ajoute 'DT'
    return e.value.toFixed(2) + ' DT';
  }
  valueFormat: {
    type: 'currency',
    precision: 2,  // Nombre de décimales
    currency: 'DT' // ou 'EUR', 'DT' etc.
  }


  addOffreP() {
    this.currentDate = format(new Date(), 'yyyy-MM-dd');
    this.demandeDevisId = +this.route.snapshot.paramMap.get('demandeDevisId');
    console.log("Total général:", this.totalPrixGeneral); // Afficher la somme dans la console

    // Appel pour récupérer les détails de la demande de devis, y compris le fournisseur
    this.demandeDevisService.getDemandeDevisById(this.demandeDevisId).subscribe(
      (demandeDevis) => {
        // Extraire le fournisseur de la demande de devis
        const fournisseur = demandeDevis.fournisseur;
      
        // Construire l'objet OffreDTO avec les informations récupérées
        const offreDTO: NewOffre = {
          demandeDevis: {
            id: this.demandeDevisId,
            datedemande: demandeDevis.datedemande,
            demandeAchat: demandeDevis.demandeAchat,
            description: demandeDevis.description,
            reference:demandeDevis.reference,
            fournisseur: fournisseur, // Assigner le fournisseur ici
            nom: demandeDevis.nom
          },
          fournisseur: fournisseur,  // Utiliser le fournisseur récupéré
          id: null,
          nom: this.demandeF.get('nom').value,
          prix: this.totalPrixGeneral,
          dateoffre: this.currentDate,
          description: this.demandeF.get('description').value,
          referenceoffre: this.demandeF.get('referenceoffre').value,
        };
  
        // Sauvegarder l'offre
        this.offreService.ajouterOffre(offreDTO).subscribe(
          (savedOffre) => {
            this.toastr.success("Offre ajoutée avec succès", "", {
              closeButton: true,
              positionClass: 'toast-top-right',
              extendedTimeOut: this.env.extendedTimeOutToastr,
              progressBar: true,
              disableTimeOut: false,
              timeOut: this.env.timeOutToastr
            });
            console.log('Offre:', offreDTO);
            this.router.navigate(["/Offre/allOffres"]);
            this.sendNotification();

            // Sauveg arder les produits associés à l'offre
            this.dataSourceElement.forEach((product) => {
              const produitToSave = {
                ...product,
                id: null,
                img: product.img,
                produit: product.produit,
                offre: savedOffre
              };
              console.log("Produit à sauvegarder:", produitToSave);
  
              this.produitOffertService.addProduitffert(produitToSave).subscribe(
                (response) => {
                  console.log('Produit offert sauvegardé avec succès :', response);
                },
                (error) => {
                  console.error('Erreur lors de la sauvegarde :', error);
                }
              );
            });
          },
          (error) => {
            console.error('Erreur lors de la sauvegarde de l\'offre :', error);
          }
        );
      },
      (error) => {
        console.error('Erreur lors de la récupération de la demande de devis :', error);
      }
    );
  }
    
loadProduitsForCategorie(categorieId: number): void {
  this.produitService.getProduitsByCategorie(categorieId)
      .pipe(take(1))
      .subscribe(produits => {
          if (produits && produits.length > 0) {
              this.filteredProducts = produits;
              console.log("Produits chargés :", produits);

              // Initialiser formDataP.produit avec le premier produit de la catégorie
              this.formDataP.produit = produits[0];
              console.log("formDataP.produit initialisé :", this.formDataP.produit);
          } else {
              this.filteredProducts = [];
          }
      }, error => {
          console.log("Erreur lors du chargement des produits :", error);
      });
}

closePopPup(){
  this.isPopupVisible = false; // Ouvre le popup

}
  onRowInserting() {
    this.isPopupVisible = true; // Ouvre le popup

    // Initialiser formDataP ici
    this.formDataP = {
      id: 0, 
      nom: '',
      quantite: this.produits.length > 0 ? this.produits[0].quantite : 1, // Vérifiez si produits a des éléments
      description: '',
      prix: 0,
      offre: null,
      produit:  this.produits[0].produit[0] , // Vérifiez si produits a des éléments
      img: '',
      bonCommande: null,
      categorie: this.produits.length > 0 ? this.produits[0].produit.categorie.id : null // Vérifiez si produits a des éléments
    };
    setTimeout(() => {
      this.loadProduitsForCategorie(this.formDataP.categorie);
    }, 100);

    console.log('formDataP initialisé:', this.formDataP); // Vérification
  }
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;

  saveProduitCommandeeInDataGrid() {
    const newProduitOffert: NewProduitOffert = {
      categorie:this.formDataP.produit.categorie.id,
      id: new Date().getTime(), 
      nom: this.formDataP.produit.nom,
      img:this.formDataP.produit.img,
      description: this.formDataP.description,
      quantite: this.formDataP.quantite,
      produit: this.formDataP.produit,
      offre: null,
      bonCommande:null,
      prix:  this.formDataP.prix // Vous ne l'enregistrez pas encore dans la base de données
    };

    // Ajouter le nouveau produit à la liste locale
    this.dataSourceElement.push(newProduitOffert);
    console.log(this.formDataP.produit.img);

    // Rafraîchir la grille pour afficher le nouvel élément
    this.dataGrid.instance.refresh();
    
}


  getSelectedItem(item: any) {
    return item;
  }
  getRequestCaseLazy() {
    let size 
    this.dataSourceElementDD = new CustomStore({
          key: 'id',
          load: function (loadOptions: any) {
            loadOptions.requireTotalCount = true
            let params = "";
            if (loadOptions.take == undefined) loadOptions.take = size;
            if (loadOptions.skip == undefined) loadOptions.skip = 0;


            params += 'size=' + loadOptions.take || size;
            //page
            params += '&page=' + loadOptions.skip / loadOptions.take || 0;

            //sort
            if (loadOptions.sort) {
              if (loadOptions.sort[0].desc)
                params += '&sort=' + loadOptions.sort[0].selector + ',desc';
              else
                params += '&sort=' + loadOptions.sort[0].selector + ',asc';
            }

            let tab: any[] = [];
            if (loadOptions.filter) {
              if (loadOptions.filter[1] == 'and') {
                for (var i = 0; i < loadOptions.filter.length; i++) {
                  if (loadOptions.filter[i][1] == 'and') {
                    for (var j = 0; j < loadOptions.filter[i].length; j++) {
                      if (loadOptions.filter[i][j] != 'and') {
                        if (loadOptions.filter[i][j][1] == 'and') {
                          tab.push(loadOptions.filter[i][j][0]);
                          tab.push(loadOptions.filter[i][j][2]);
                        } else
                          tab.push(loadOptions.filter[i][j]);
                      }
                    }
                  } else tab.push(loadOptions.filter[i]);
                }
              } else
                tab.push([loadOptions.filter[0], loadOptions.filter[1], loadOptions.filter[2]]);
            }

            let q: any[] = [];
            let reqRechercherAnd: any[] = [];

            for (let i = 0; i < tab.length; i++) {
              
              if (tab[i] !== undefined && tab[i] !== null) {
                if (tab[i][0] == 'startDate' || tab[i][0] == 'sysdateCreated' || tab[i][0] == 'sysdateUpdated' || tab[i][0] == 'dateTimeFrom' || tab[i][0] == 'dateTimeUntil') {
                  let isoDate = new Date(tab[i][2]).toISOString();
                  tab[i][2] = isoDate;
                }
                let operateur;
                switch (tab[i][1]) {
                  case ('notcontains'): {
                    operateur = 'doesNotContain';
                    break;
                  }
                  case  'contains': {
                    operateur = 'contains';

                    break;
                  }
                  case '<>' : {
                  
                    operateur = 'notEquals';
                    break;
                  }
                  case  '=': {
                    operateur = 'equals';
                    break;
                  }
                  case 'endswith': {
                    // q.push("(" + tab[i][0] + ":*" + tab[i][2] + ")");
                    break;
                  }
                  case  'startswith': {
                    //  q.push("(" + tab[i][0] + ":" + tab[i][2] + "*" + ")");
                    break;
                  }
                  case  '>=': {
                    
                    operateur = 'greaterThanOrEqual';
                    break;
                  }
                  case  '>': {
                    operateur = 'greaterThanOrEqual';
                    break;
                  }
                  case  '<=': {
                    operateur = 'lessOrEqualThan';
                    break;
                  }
                  case  '<': {
                    
                    operateur = 'lessOrEqualThan';
                    break;
                  }
                  case 'or' : {
                    console.log("test")
                    if (typeof (tab[i][0]) == "object") {
                      console.log("partie",tab[i][0][0])
                      let ch = ""
                      loadOptions.filter.forEach(element => {
                        console.log("element",element)
                        if (element[2] != null && element[2] != undefined && element[2] != "") {
                          ch += element[2] + ","
                        }
                      });
                      paramsCount += '&';
                      paramsCount += tab[i][0][0] + "." + "in=" + ch
                      paramsCount += ',';
                      params += '&';

                      if(tab[i][0][0]==='caseType.caseTypeName'){
                        params += 'caseTypeLabel' + "." + "in=" + ch
                      }else{
                        params += tab[i][0][0] + "." + "in=" + ch

                      }
                    } else
                      operateur = "notEquals"

                    break;
                  }
                }
                if (operateur !== null && operateur !== undefined && operateur != '') {
                  if (tab[i][0] == 'arrivedDatetime') {
                    paramsCount += '&';
                    paramsCount += tab[i][0] + '.' + operateur + '=' + new Date(tab[i][2]).toISOString();
                    paramsCount += ',';
                    params += '&';
                    params += tab[i][0] + '.' + operateur + '=' + new Date(tab[i][2]).toISOString();

                  } else {

                    paramsCount += '&';
                    paramsCount += tab[i][0] + '.' + operateur + '=' + tab[i][2];
                    paramsCount += ',';
                    params += '&';

                    params += tab[i][0] + '.' + operateur + '=' + tab[i][2];
                  }

                }
              }
            }

            let f: string = "";
            if (q.length != 0) f += q[0];
            for (let i = 1; i < q.length; i++) {
              f += "&" + q[i];
            }
            if (f.length != 0) params += "&" + f

            var paramsCount = ""
            var tabCount = []
            tabCount = params.split('&')
            if (tabCount.length > 2) paramsCount += "?"
            for (let i = 3; i < tabCount.length; i++) {
              paramsCount += tabCount[i]
              paramsCount += "&"
            }
            params+= '&sort=id,desc'
            
            
            return this.httpClient.get(this.env.urlProject + 'demande-devis/getDD?' + params, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
                .toPromise()
                .then((data: any) => {
                  size = data.totalElements; 
                  console.log("Données récupérées :", data.content);// Mettre à jour size avec la valeur de totalElements
                      return {data: data.content, totalCount: data.totalElements};
                      

                    },
                    error => {
                      this.toastr.error("خطأ في تحميل البيانات ", "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                      })
                    })

          }.bind(this)
        }
    );
  }
  username:any;

  sendNotification() {
        const message = `Nouveau offre recu:` ;
        const url = `/DemandeDevis/demandeDevis/`;
        this.username = this.cookieService.get('displayname');
        const createdBy=this.username;
        const username="directeurAchat";
        this.webSocketService.sendNotification({ message, url, createdBy, username });
      }


    

  @ViewChild('selection') selection: any;



}
