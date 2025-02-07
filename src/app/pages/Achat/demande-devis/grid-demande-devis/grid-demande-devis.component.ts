import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { EnvService } from 'src/env.service';
import { IDemandeDevis, NewDemandeDevis } from '../../../../Models/demande-devis.model';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Observable } from 'rxjs';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { TokenStorageService } from 'src/app/pages/Global/shared-service/token-storage.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';
import { ProduitService } from 'src/app/Service/produit.service';
import { CategorieService } from 'src/app/Service/categorie.service';
import { NewCategorie } from 'src/app/Models/categorie.model';
import { format } from 'date-fns';
import { ProduitCommandeeService } from '../../../../Service/produit-commandee.service';



@Component({
  selector: 'app-grid-demande-devis',
  templateUrl: './grid-demande-devis.component.html',
  styleUrls: ['./grid-demande-devis.component.scss']
})
export class GridDemandeDevisComponent implements OnInit {

  constructor(private env: EnvService,private demandeDevisService: DemandeDevisService, private translateService:TranslateService,
    private toastr: ToastrService,private router: Router, private fb:FormBuilder,private fournisseurService:FournisseurService,
    private httpClient: HttpClient,private route:ActivatedRoute, private tokenStorage:TokenStorageService,
    private categorieService:CategorieService, private produitService:ProduitService,
  private produitCommandeeService:ProduitCommandeeService) { }
  dataSourceElement: any=[];

  dateString = '2024-04-25';
  demandeDevisList: IDemandeDevis[] = [];
  demandeDevis:NewDemandeDevis;
  produitCommandeeList: NewProduitCommandee[] = [];
  popupAddVisible = false;
currentDate:string;
  isLoading = true;
  errorMessage: string | null = null;
  pageSize = 10;
  allowedPageSizes = [10, 20, 50];
  //pageSize = this.env.pageSize;
 // allowedPageSizes = this.env.allowedPageSizes;
  @ViewChild('editForm', { static: false }) editForm: DxFormComponent;
   demandes: NewDemandeDevis[]; // Update the type to Demande
 @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridDemande', {static: false}) dataGridDemande: DxDataGridComponent;
  packageName = require('package.json').name;
  iddoc:any;
  popupDeleteVisible: boolean=false;
  demandeadd: any;
  isNewRecord = true;
  visible = false;
  isHovered: { [key: number]: boolean } = {}; // Pour garder une trace des lignes survolées
  hoverPopupVisible: boolean = false;
  hoverData: any;
  hoverPosition: any = { top: 0, left: 0 };
  totalCount = 0;
  fournisseurs: any[] = []; // Array to store the list of fournisseurs
  categoryOptions: any; // Déclarer un objet pour les options de catégorie
  filteredProducts = [];
  selectedCategorieId: number | null = null;
  categories: NewCategorie[] = [];
  showloader: boolean = false; // Make sure it's initialized

  formDataP: NewProduitCommandee = {
    id: null,
    nom: '',
    description: '',
    quantite: 1,
    produit: { id: null, img:null}, // Initialiser avec un produit vide
    demandeDevis: null,
    img:'',
    categorie:null // Exemples, ajustez selon vos besoins
  };
  size: number;
  getSelectedItem(item: any) {
    return item;
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
  ngOnInit(): void {
  this.getRequestCaseLazy();
  this.loadFournisseurs();
  console.log("dd",this.dataSourceElement);

  console.log('API URL:', this.env.demandeDevis);

  //console.log('Token:', this.tokenStorage.getToken());
    console.log(this.dataSourceElement);
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
  }
  demandeDevisForm = this.fb.group({
    nom: ['', Validators.required],
    description: ['', Validators.required],
    fournisseurId: ['', Validators.required]
  });
  loadFournisseurs(): void {
    this.fournisseurService.getFournisseursSimple().toPromise().then(
      data => {
        this.fournisseurs = data; // Assign the list of fournisseurs to the component property
      },
      error => {
        console.error("Error fetching fournisseurs:", error);
      }
    );
  }
  closePopUp(){
    this.popupAdd = false;
  }
    closeAddPopup() {
      this.popupAddVisible = false;
    }
  onRowHoverEnter(data) {
    this.isHovered[data.data.id] = true; // Activer le composant lorsque le curseur entre dans la ligne
  }
  
  onRowHoverLeave(data) {
    this.isHovered[data.data.id] = false; // Désactiver le composant lorsque le curseur quitte la ligne
  }
  popupDelete(id:any) {
    this.popupDeleteVisible=true;
    console.log("DELETE"+this.popupDeleteVisible.toString());
    this.iddoc=id;

  }
  
  checkData(data: any) {
    console.log('Données de la ligne:', data);
    return true;  // Retourne true pour simplifier l'utilisation dans *ngIf
  }
  onRowPrepared(e: any) {
    if (e.rowType === 'data') {
      console.log('Données de la ligne:', e.data);
    }
  }
  deletedemande() {
    this.demandeDevisService.deleteDemandeDevis(this.iddoc).subscribe(data=>{
      this.refresh();
      this.translateService.get("deleteWithSuccess").subscribe(
          res => {
            this.toastr.success(res, "", {
              closeButton: true,
              positionClass: 'toast-top-right',
              extendedTimeOut: this.env.extendedTimeOutToastr,
              progressBar: true,
              disableTimeOut: false,
              timeOut: this.env.timeOutToastr
            })
          }
      )
      this.popupDeleteVisible = false;
    }, error => {
      this.toastr.error(error.error.message, "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      })
    })
  }

  fermerPopup() {
    this.popupDeleteVisible=false;
  }
  showbordereaux(id: any) {
    this.router.navigate(["DemandeDevis/demandeDevis"+id])
  }
  refresh(): void {
    this.dataGridDemande.instance.refresh();
  }
  popupAdd
  popupEdit
  add(e){
    this.popupAdd = e
    this.popupEdit = e
    this.refresh()
  }
  id
  Editclient(id) {
    this.id = id.data.id
    console.log(this.id)
    this.popupEdit = true
  }

    adddemande() {
        // Navigate to the add-demande component without an ID
        const demandeId = +this.route.snapshot.paramMap.get('id'); // Remplacez ceci par l'ID réel ou dynamique
       this.router.navigate(['DemandeDevis/allDemandesDevis/produitDemandee']);
    }

    Editdemande(id) {
        // Set the ID property
        this.id = id.data.id;
        // Navigate to the add-demande component with the specific ID
        this.router.navigate(['DemandeDevis/demandeDevis', this.id]);
    }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          template: 'ExportPDF'
        });
    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          widget: 'dxButton',
          options: {
            hint: 'Reset',
            icon: 'undo',
            onClick: this.resetGrid.bind(this),
          }
        });
    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          widget: 'dxButton',
          options: {
            hint: 'Refresh',
            icon: 'refresh',
            onClick: this.refresh.bind(this),
          }
        });

    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Liste des demandes de devis'
        }
    );
      e.toolbarOptions.items.unshift(
          {
              location: 'after',
              widget: 'dxButton',
              options: {
                  hint: 'Add',
                  icon: 'plus',
                  onClick: this.openAddPage.bind(this),
              },
          }
      );

  }
  onToolbarPreparingProduit(e) {
   
    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          widget: 'dxButton',
          options: {
            hint: 'Reset',
            icon: 'undo',
            onClick: this.resetGrid.bind(this),
          }
        });
    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          widget: 'dxButton',
          options: {
            hint: 'Refresh',
            icon: 'refresh',
            onClick: this.refresh.bind(this),
          }
        });

    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Liste des produits commandées'
        }
    );
      e.toolbarOptions.items.unshift(
          {
              location: 'after',
              widget: 'dxButton',
              options: {
                  hint: 'Add',
                  icon: 'plus',
                  onClick: this.openAddPageProduit.bind(this),
              },
          }
      );

  }
  openAddPage(e) {
    this.popupAdd = true
     }

     openAddPageProduit(e) {
      this.popupAddVisible = true
       }
  resetGrid() {
    localStorage.removeItem(this.packageName + '_' + 'dataGridDemande');
    window.location.reload();
  }

  getRequestCaseLazy() {
    let size 
    this.dataSourceElement = new CustomStore({
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
                  size = data.totalElements; // Mettre à jour size avec la valeur de totalElements
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
  
  getFournisseurName(demandeDevisId: number): Observable<string> {
    return this.fournisseurService.getFournisseurName(demandeDevisId);
  }
  getFournisseurIdByDemandeDevisId(){
              
  }

  onCellHoverChanged(event: any) {
    if (event.eventType === 'mouseenter') {
      this.hoverData = event.data;
      this.hoverPosition = {
        top: event.event.clientY,
        left: event.event.clientX
      };
      this.hoverPopupVisible = true;
    } else if (event.eventType === 'mouseleave') {
      this.hoverPopupVisible = false;
    }
  } 
  addDemandeDevis() {
    this.showloader = true
    if (this.demandeDevisForm.invalid) {
      this.showloader = false

      this.toastr.warning("Veuillez remplir tous les champs requis.", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });
      return; // Ne pas continuer si le formulaire n'est pas valide
    }
    this.currentDate = format(new Date(), 'yyyy-MM-dd');
    const newDemandeDevis: NewDemandeDevis = {
      datedemande:this.currentDate,
      reference:null,
      fournisseur:{
id:Number(this.demandeDevisForm.get('fournisseurId').value),
adresse:null,
nom:null,
tel:null,
email:null
      }, 
      id: null,
      nom: this.demandeDevisForm.get('nom').value,
      description: this.demandeDevisForm.get('description').value,
      demandeAchat:null
    };

    this.demandeDevisService.saveDemandeDevisWithout(newDemandeDevis).subscribe(
      savedDemandeDevis => {  
        this.showloader = false

        this.toastr.success("Demande de devis ajouté avec succès ", "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr
        })
        console.log('demandeDevis',newDemandeDevis)
        this.produitCommandeeList.forEach((product) => {
          // Supprimer l'ID temporaire avant l'envoi au backend
          const produitToSave = { ...product, id: null };
          produitToSave.demandeDevis = savedDemandeDevis;
          
          this.produitCommandeeService.saveProduitCommandee(produitToSave).subscribe(
            (response) => {
              console.log('Produit commandé sauvegardé avec succès :', response);
            },
            (error) => {
              console.error('Erreur lors de la sauvegarde :', error);
            }
          );
        });
      },
      error => {
        console.error('Erreur lors de la sauvegarde de la demande de devis :', error);
      }
    );
    this.closePopUp()
  }
  saveProduitCommandeeInDataGrid() {
    const newProduitCommandee: NewProduitCommandee = {
      id: new Date().getTime(), 
      nom: this.formDataP.produit.nom,
      description: this.formDataP.description,
      quantite: this.formDataP.quantite,
      produit: this.formDataP.produit,
      img: this.formDataP.produit.img,
      demandeDevis:null,
      categorie:null
    };

    // Ajouter le nouveau produit à la liste locale
    this.produitCommandeeList.push(newProduitCommandee);
    console.log(this.formDataP.produit.nom);

    // Rafraîchir la grille pour afficher le nouvel élément
    this.dataGrid.instance.refresh();
    
    // Réinitialiser le formulaire pour un nouvel ajout éventuel
    this.formDataP = {
      id: null,
      nom: '',
      description: '',
      quantite: 1,
      produit: { id: null, img: null }, 
      demandeDevis:null,
      img:null,
      categorie:null// Réinitialiser le produit vide
    };
    this.closeAddPopup()
}

}
