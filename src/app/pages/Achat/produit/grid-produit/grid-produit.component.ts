import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DxDataGridComponent, DxFormComponent, DxTextAreaModule, } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';
import { NewCategorie } from 'src/app/Models/categorie.model';
import { Categorie } from 'src/app/Models/enumerations/categorie.model';
import { IProduit, NewProduit } from 'src/app/Models/produit.model';
import { TokenStorageService } from 'src/app/pages/Global/shared-service/token-storage.service';
import { CategorieService } from 'src/app/Service/categorie.service';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { ProduitService } from 'src/app/Service/produit.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-grid-produit',
  templateUrl: './grid-produit.component.html',
  styleUrls: ['./grid-produit.component.scss']
})
export class GridProduitComponent implements OnInit {

  constructor(private env: EnvService,private produitService: ProduitService, private translateService:TranslateService,
    private toastr: ToastrService,private router: Router,private httpClient:HttpClient,private tokenStorage: TokenStorageService,
  private categorieService:CategorieService ) { }

    @ViewChild('formRef', { static: false }) formInstance: DxFormComponent;
    showloader: boolean = false; // Make sure it's initialized

    produits: NewProduit[] = [];
  //  produit:NewProduit;
    formData = {};
    formDataP: NewProduit = {
      id: 0, 
      categorie:null, // Initialisation de l'ID, 0 ou une autre valeur par défaut
      nom: '',
      quantite: 1,
      description: '',
      img: '',
      // Ajoutez d'autres propriétés si nécessaire
    };
    categoryOptions: any; // Déclarer un objet pour les options de catégorie

    dataSourceElement: any;
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridDemande', {static: false}) dataGridDemande: DxDataGridComponent;
  packageName = require('package.json').name;
  iddoc:any;
  popupDeleteVisible: boolean=false;
  popupAddVisible = false;
  demandeadd: any;
  isNewRecord = true;
  visible = false;
  htmlContent: string = '';  // Initialisation à une chaîne vide
  categories: NewCategorie[] = [];

  selectedFile: File | null = null;
  onCategorieChange(event: any) {
    console.log('Nouvelle catégorie sélectionnée:', event.value);
    this.formDataP.categorie = event.value;
  }
  ngOnInit(): void {
    this.getRequestCaseLazy();
    console.log(this.dataSourceElement);
 
    this.categorieService.getCategories().subscribe(categories => {
      this.categories = categories;
      console.log('Catégories récupérées:', this.categories);  // Vérification des catégories
      this.categoryOptions = {
        items: this.categories,
        displayExpr: 'nom',
        valueExpr: 'id',
        placeholder: 'Sélectionner une catégorie'
      };
    });
  }
 /* onCategorieChange(e: any): void {
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
  }*/
  openAddPopup() {
    this.popupAddVisible = true;
  }

  closeAddPopup() {
    this.popupAddVisible = false;
  }
  onRowUpdating(e: any) {
    const { key, newData } = e;
  
    console.log('Key:', key);
    console.log('New Data:', newData);
  
    this.produitService.updateProduit(key.id || key, newData)
      .pipe(
        map(() => {
          this.toastr.success('Produit mis à jour avec succès');
          this.getAllProduits();  // Refresh grid after update
        }),
        catchError((error) => {
          this.toastr.error('Erreur lors de la mise à jour du produit');
          e.cancel = true;  // Prevent the row update in the grid
          return of([]);
        })
      )
      .subscribe();
  }
  saveNewItem() {
    // Valide le formulaire avant de soumettre
    const formIsValid = this.formInstance.instance.validate().isValid;
    
    if (formIsValid) {
      console.log('Données valides:', this.formDataP);
      this.onSubmit(); // Soumettre les données
    } else {
      console.error('Validation échouée');
    }
  }
  onSubmit() {
    console.log("Categorie avant soumission:", this.formDataP.categorie);
    this.showloader = true;
  
    // Contrôle de saisie pour chaque champ requis
    if (!this.formDataP.categorie) {
      this.toastr.error("La catégorie est obligatoire", "Erreur de saisie");
      this.showloader = false;
      return;
    }
    if (!this.formDataP.nom) {
      this.toastr.error("Le nom du produit est obligatoire", "Erreur de saisie");
      this.showloader = false;
      return;
    }
    if (!this.formDataP.description) {
      this.toastr.error("La description est obligatoire", "Erreur de saisie");
      this.showloader = false;
      return;
    }
  
    if (!this.formDataP.quantite) {
      this.toastr.error("La quantité est obligatoire", "Erreur de saisie");
      this.showloader = false;
      return;
    }

    // Création du FormData
    const formData = new FormData();
    formData.append('couleur', '');  // Si vous avez une couleur, ajoutez-la ici
    formData.append('description', this.formDataP.description);
    formData.append('nom', this.formDataP.nom);
    formData.append('quantite', this.formDataP.quantite.toString());
  
    // Ajout de l'ID de la catégorie sélectionnée
    formData.append('categorie', this.formDataP.categorie.toString());
  
    // Ajout du fichier sélectionné si disponible
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    } else {
      this.toastr.error("Aucun fichier sélectionné", "Information");
      return;
    }
  
    // Appel du service pour envoyer les données
    this.produitService.addProduitWithImage(formData)
      .subscribe(response => {
        console.log('Produit ajouté avec succès :', response);
        this.toastr.success("Produit ajouté avec succès", "Succès");
        this.closeAddPopup();
        this.refresh();
        this.showloader = false;
      }, error => {
        console.error("Erreur lors de l'ajout du produit :", error);
        this.toastr.error("Erreur lors de l'ajout du produit", "Erreur");
        this.showloader = false;
      });
  }
  
  popupDelete(id:any) {
    this.popupDeleteVisible=true;
    console.log("DELETE"+this.popupDeleteVisible.toString());
    this.iddoc=id;

  }
  onDescriptionChanged(event) {
    const value = event.value;
  
    // Vérifier si la longueur dépasse la limite
    if (value.length > 223 ) {
      // Si la longueur dépasse 500 caractères, tronquer la valeur à 500
      event.component.option('value', value.substring(0, 223 )); // Limiter la saisie à 500 caractères
  
      // Optionnel : vous pouvez afficher un message d'erreur ou loguer un avertissement
      console.warn('La description ne peut pas dépasser 500 caractères.');
    }
  }
  

  fermerPopup() {
    this.popupDeleteVisible=false;
  }
  showbordereaux(id: any) {
    this.router.navigate(["Demande/add/"+id])

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


/*  exportGrid() {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGridDemande.instance
    }).then(() => {
      doc.save('Demandes.pdf');
    })
  }*/


  openAddPage(e) {
    this.popupAdd = true   }
  resetGrid() {
    localStorage.removeItem(this.packageName + '_' + 'dataGridDemande');
    window.location.reload();
  }
  onToolbarPreparing(e) {


   
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
          template: 'Liste des produits'
        }
    );
      e.toolbarOptions.items.unshift(
          {
              location: 'after',
              widget: 'dxButton',
              options: {
                  hint: 'Add',
                  icon: 'plus',
                  onClick: () => this.openAddPopup(),
                },
          }
      );

  }
  adddemande() {
    // Navigate to the add-demande component without an ID
   this.router.navigate(['Produit/add']);
}
Editdemande(id) {
  // Set the ID property
  this.id = id.data.id;
  // Navigate to the add-demande component with the specific ID
  this.router.navigate(['DemandeAchat/demandeAchat', this.id]);
}
onRowRemoving(event: any): void {
  // Empêche le DataGrid de supprimer la ligne avant la réponse du service
  event.cancel = true;

  // Récupère l'ID de la ligne à supprimer
  const idToDelete = event.data.id;

  // Confirmation de la suppression
  this.produitService.deleteProduit(idToDelete).subscribe({
    next: () => {
      // Rafraîchir les données après la suppression
      this.refresh();

      // Afficher un toast de succès
      this.translateService.get("Produit supprimé avec succès").subscribe(res => {
        this.toastr.success(res, "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr || 2000,  // Valeur par défaut
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr || 3000  // Valeur par défaut
        });
      });

      // Annuler la suppression automatique (à retirer si non applicable)
      event.cancel = false;
    },
    error: (error) => {
      // Afficher un toast d'erreur en cas d'échec
      this.toastr.error(error.error.message || "Erreur lors de la suppression", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr || 2000,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr || 3000
      });
    }
  });
}


getRequestCaseLazy() {
  let size = this.env.pageSize
  this.dataSourceElement = new CustomStore({
        key: 'id',
        load: function (loadOptions: any) {
          loadOptions.requireTotalCount = true
          var params = "";
          if (loadOptions.take == undefined) loadOptions.take = size;
          if (loadOptions.skip == undefined) loadOptions.skip = 0;

          //size
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
          
          
          return this.httpClient.get(this.env.urlProject + 'produits/getProduits?' + params, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
              .toPromise()
              .then((data: any) => {
                size = data.totalElements

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

        }.bind(this),
        update: (key: any, values: any) => {
          // Trouver le fournisseur existant à partir de la clé (id)
          const produitExistant = this.produits.find(p => p.id === key);
        
          // Vérifier si le fournisseur existe avant de continuer
          if (!produitExistant) {
            return Promise.reject("Fournisseur non trouvé");
          }
        
          // Fusionner les nouvelles valeurs avec les valeurs existantes
          const produitMisAJour = {
            ...produitExistant,  // Conserver les champs existants
            ...values                // Remplacer uniquement les champs modifiés
          };
        
          // Appeler le service pour mettre à jour le fournisseur
          return this.produitService.updateProduit(key, produitMisAJour)
            .toPromise()
            .then(() => {
              // Actualiser les fournisseurs après la mise à jour
              this.getRequestCaseLazy();
            });
        }
      }
  );
}
getAllProduits() {
  this.produitService.getProduits().subscribe((response: NewProduit[]) => {
    this.dataSourceElement = new CustomStore({
      key: 'id',
      load: () => {
        return Promise.resolve({
          data: response,
          totalCount: response.length // Total count égale au nombre d'éléments récupérés
        });
      },
      update: (key: any, values: any) => {
        // Trouver le fournisseur existant à partir de la clé (id)
        const produitExistant = this.produits.find(p => p.id === key);
      
        // Vérifier si le fournisseur existe avant de continuer
        if (!produitExistant) {
          return Promise.reject("Fournisseur non trouvé");
        }
      
        // Fusionner les nouvelles valeurs avec les valeurs existantes
        const produitMisAJour = {
          ...produitExistant,  // Conserver les champs existants
          ...values                // Remplacer uniquement les champs modifiés
        };
      
        // Appeler le service pour mettre à jour le fournisseur
        return this.produitService.updateProduit(key, produitMisAJour)
          .toPromise()
          .then(() => {
            // Actualiser les fournisseurs après la mise à jour
            this.getAllProduits();
          });
      }
    });


  });
}
onFileChange(event: any) {
  const file = event.target.files[0];  // Récupère le fichier sélectionné
  if (file) {
    this.selectedFile = file;  // Stocke le fichier dans la variable selectedFile
    console.log('Fichier sélectionné :', this.selectedFile);  // Affiche le fichier dans la console
  }
}
  

}