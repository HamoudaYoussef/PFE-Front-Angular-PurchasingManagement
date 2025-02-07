
import { EventEmitter,Component, Input, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewDemandeAchat } from 'src/app/Models/demande-achat.model';
import { DemandeAchatDto } from 'src/app/Models/demande-achatDTO.model';
import { StatutDA } from 'src/app/Models/enumerations/statut-da.model';
import { ComposantsProcesseursCartesMeres, ComposantsMemoireStockage, ComposantsGraphiquesEcrans, ComposantsPeripheriquesEntreeSortie, ComposantsReseauConnectivite, ComposantsAlimentationRefroidissement, ComposantsBoitiersAccessoires, ComposantsPeripheriques, ComposantsPeripheriquesMobiles, ComposantsJeu, ComposantsServeurStockage, ComposantsSecurite, ComposantsAudioVideo, AutresComposants, AccessoiresOrdinateur, EquipementsReseau, ComposantsTelephonie, ComposantsSecuritePhysique, ComposantsStockage, ComposantsSysteme } from 'src/app/Models/enumerations/material.model';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { EnvService } from 'src/env.service';
import { format } from 'date-fns';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { WebSocketService } from 'src/app/Service/web-socket.service';
import { CookieService } from 'ngx-cookie-service';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { CategorieService } from 'src/app/Service/categorie.service';
import { NewCategorie } from 'src/app/Models/categorie.model';
import { ProduitService } from 'src/app/Service/produit.service';

import { take } from 'rxjs/operators'; // Importer l'opérateur take

@Component({
  selector: 'app-add-demande-achat',
  templateUrl: './add-demande-achat.component.html',
  styleUrls: ['./add-demande-achat.component.scss']
})
export class AddDemandeAchatComponent implements OnInit {
  eventValue: string;
  newProducts: any[] = [];

  maxLength = null;
  showloader: boolean = false; // Make sure it's initialized

  value: string;
  DA: any = {}

  valueForEditableTextArea: string;
  categoryOptions: any; // Déclarer un objet pour les options de catégorie

  height = 90;
  products: NewProduitDemandee[];
  categories: NewCategorie[] = [];
  selectedCategorieId: number | null = null;
  autoResizeEnabled: boolean;
  @Output() add = new EventEmitter<boolean>();
  @Input() id: number;
  demandeForm: any;
  formGroup: FormGroup;
  composants = { ...ComposantsProcesseursCartesMeres, ...ComposantsMemoireStockage, ...ComposantsGraphiquesEcrans, ...ComposantsPeripheriquesEntreeSortie, ...ComposantsReseauConnectivite, ...ComposantsAlimentationRefroidissement, ...ComposantsBoitiersAccessoires, ...ComposantsPeripheriques, ...ComposantsPeripheriquesMobiles, ...ComposantsJeu, ...ComposantsServeurStockage, ...ComposantsSecurite, ...ComposantsAudioVideo, ...AutresComposants, ...AccessoiresOrdinateur, ...EquipementsReseau, ...ComposantsTelephonie, ...ComposantsSecuritePhysique, ...ComposantsStockage, ...ComposantsSysteme };
  composantsKeys = Object.keys(this.composants);

  demandeAchatDTO: any = {}
  private msg: string = 'defaultErrorMessageKey';
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  statusList: string[] = [];
  demandes: NewDemandeAchat[] = [];
  demandeachat: NewDemandeAchat;
  currentDate: string;
  eventvalueworkflow:any;
  disabled = true;
  eventcontrole=false;
  afficherGridP: boolean = false;
  produitsDemandes: any[] = [];
  dataSourceElement: NewProduitDemandee[];
  popupAddVisible = false;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  demandeAchatId:any;
  produitDemandee: NewProduitDemandee = {
    id:0,demandeAchat:null,description:'',nom:'',quantite:1,img:'',produit:null,categorie:null

  };
  demandeAchat = new DemandeAchatDto(null, null, null, null,null)
  gridBoxValue = [];
  gridBoxValueexp:any = [];
  currentdate = new Date();
  // last add
  demandeF= new FormGroup({
    id: new FormControl(''),
    description: new FormControl(''),
    datebesoin: new FormControl(''),
    statut: new FormControl(''),
    datedemande: new FormControl(''),
    nom: new FormControl(''),
 //   demandeNumber: new FormControl (''),
  });
  showAddButton = true;
  showEditButton = false;
  showDeleteButton = false;
  editingItem: any = null;


  //produitsForms: FormGroup[] = [];


    demandeFPD: FormGroup; // Déclarez le FormGroup ici
    startEditAction = 'click';

    selectTextOnEditStart = true;
  @Output() AppelWsGetById: EventEmitter<any> = new EventEmitter<any>();
  userPermission:any;
  decissionWF:any;
  objectData:any;
  toolbarItems: any[];
  forms: FormGroup[] = [];
  produits: any[] = [];
  produitsDemandesList: NewProduitDemandee[] = [];

  envoyer : boolean=false;
  elsedesision:boolean=false;
  reference:string;

 //document
  @Output() JsonDocViewerFromFormToComponent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  constructor(private fb: FormBuilder,private demandeAchatService: DemandeAchatService,
              private produitDemandeeService: ProduitDemandeeService,
              private toastr: ToastrService, private env: EnvService,
              private webSocketService: WebSocketService,
              private router: Router,
              public route: ActivatedRoute,
              private cookieService: CookieService,
              private categorieService:CategorieService,
              private produitService:ProduitService,private cdr: ChangeDetectorRef
  ) {
    this.currentDate = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    this.demandeForm = this.fb.group({
      iddemandeachat: null, // You might want to initialize other properties based on your requirements
      description: ['', Validators.required],
      nom: ['', Validators.required],
      statut: StatutDA.en_attente,
      datedemande: this.currentDate,
      datebesoin: [null, Validators.required],
      // deadline: ['']
    });
   
    this.produitDemandee = {
      id: null,
      demandeAchat: null,
      nom: '',
      description: '',
      quantite: 1,
      img:null,
      produit:null,
      categorie:5
    };

  }
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;

 // categories = Object.values(Categorie);

  filteredProducts = [];

  formDataP: NewProduitDemandee = {
    id: 0, 
    nom: '',
    quantite: 1,
    description: '',
    img:null,
    demandeAchat:null,
    produit:{id:1},
    categorie:5,
    // Ajoutez d'autres propriétés si nécessaire
  };
  getSelectedItem(item: any) {
    return item;
  }
  ngOnInit(): void {
    this.isLoading = true; // Commencez le chargement
    const id = this.route.snapshot.paramMap.get('id');

    // Chargez d'abord la demande d'achat
    this.demandeAchatService.getDemandeAchatById(id).toPromise().then(data => {
        this.objectData = data;
        this.demandeF.get('id').setValue(id);
        this.demandeF.get('description').setValue(data.description);
        this.demandeF.get('datedemande').setValue(data.datedemande);
        this.demandeF.get('nom').setValue(data.nom);
        this.demandeF.get('statut').setValue("en_attente");
        this.reference = data.reference;
        this.decissionWF = data.workflow && data.workflow.decisionsWF ? data.workflow.decisionsWF : null;
        this.envoyer = this.decissionWF === "envoyer";

        // Chargez les produits demandés après avoir récupéré la demande d'achat
        this.getProduitDemande();

        // Charger les produits de la catégorie ayant id = 5
        this.loadProduitsForCategorie(5);

        this.isLoading = false; // Masquer le loader après le chargement des données
    }).catch(error => {
        console.log("Error fetching data:", error);
        this.isLoading = false; 
    });

    // Chargez les catégories
    this.categorieService.getCategories().subscribe(categories => {
        this.categories = categories;
        this.categoryOptions = {
            items: this.categories,
            displayExpr: 'nom',
            valueExpr: 'id',
            placeholder: 'Sélectionner une catégorie',
            onValueChanged: (e) => this.onCategorieChange(e)
        };
    });
}
  getComposantsKeys() {
    return Object.keys(this.composants);
  }

  onRowInserted(event: any): void {
    this.produitsDemandesList.push(event.data);
  }
  

  closeAddPopup() {
    this.popupAddVisible = false;
    this.cdr.detectChanges();  // Force Angular to update the view immediately

  }

  /*categoryOptions = {
    items: this.categories,
    placeholder: 'Sélectionner une catégorie',
    onValueChanged: (e: any) => this.onCategoryChange(e)
  };*/
  saveProduitDemandeeInDataGrid() {
    // Vérifier si tous les champs sont valides
    if (!this.formDataP.produit || !this.formDataP.produit.nom) {
      this.toastr.warning("Le nom du produit est requis", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });
      return; // Arrêter l'exécution si le nom est manquant
    }
  
    if (!this.formDataP.quantite || this.formDataP.quantite <= 0) {
      this.toastr.warning("La quantité doit être supérieure à 0", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });
      return; // Arrêter l'exécution si la quantité est incorrecte
    }
  
    if (!this.formDataP.description || this.formDataP.description.trim() === '') {
      this.toastr.warning("La description est obligatoire", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });
      return; // Arrêter l'exécution si la description est manquante
    }
  
    // Si tout est valide, ajouter le produit
    const newProduitDemandee: NewProduitDemandee = {
      id: new Date().getTime(), 
      nom: this.formDataP.produit.nom,
      img: this.formDataP.produit.img,
      description: this.formDataP.description,
      quantite: this.formDataP.quantite,
      produit: this.formDataP.produit,
      categorie:this.formDataP.categorie,
      demandeAchat: {
        id: this.route.snapshot.paramMap.get('id'),
        datebesoin: null,
        datedemande: null,
        description: null,
        produits: null,
        reference: null,
        statut: null
      }
    };
  
    // Ajouter le nouveau produit à la liste locale
    this.dataSourceElement.push(newProduitDemandee);
    this.toastr.success("Produit ajouté avec succès", "", {
      closeButton: true,
      positionClass: 'toast-top-right',
      extendedTimeOut: this.env.extendedTimeOutToastr,
      progressBar: true,
      disableTimeOut: false,
      timeOut: this.env.timeOutToastr
    });
    
    // Rafraîchir la grille
    this.dataGrid.instance.refresh();
    
    // Réinitialiser le formulaire pour un nouvel ajout
    this.resetForm();
  }

  resetForm() {
    this.formDataP = {
        id: null,
        nom: '',
        description: '',
        quantite: 1,
        produit: { id: 1, img: null, nom: '', description: '' },
        img: '',
        categorie:5,
        demandeAchat: {
            id: this.route.snapshot.paramMap.get('id'),
            datebesoin: null,
            datedemande: null,
            description: null,
            produits: null,
            reference: null,
            statut: null
        }
    };

    this.loadProduitsForCategorie(5);
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

editItem(itemId: number) {
  const itemToEdit = this.dataSourceElement.find(item => item.id === itemId); // Assurez-vous d'utiliser le bon champ ID
  if (itemToEdit) {
      this.editingItem = itemToEdit; // Conservez l'élément en cours d'édition
      this.form.instance.option('formData', { ...itemToEdit }); // Remplir le formulaire avec les données de l'élément
      this.popupAddVisible = true; // Ouvrir le popup
  } else {
      console.warn('Élément à éditer non trouvé dans dataSourceElement');
  }
}

// Méthode pour supprimer un item
deleteItem(itemId: number) {
  // Logique pour supprimer l'élément
  this.dataSourceElement = this.dataSourceElement.filter(item => item.id !== itemId);
  this.dataGrid.instance.refresh();
  this.onToolbarPreparing({} as any);
  this.dataGrid.instance.repaint(); 
  
}

onCategorieChange(e: any): void {
  const categorieId = e.value;
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
 GetjsonDowViewerFromAttatchement(e) {
    this.JsonDocViewerFromFormToComponent.emit(e)
  }
  getById() {
    console.log("inWebServiceGetByID")
    this.AppelWsGetById.emit(true)
  }



  
  afficherGridPOnClick() {
    this.afficherGridP = true;
  }
  toolbarItemClick(e) {
    const itemClicked = e.itemData;
    if (itemClicked.options && itemClicked.options.hint === 'Add Produit') {
    }
    // Ajoutez d'autres conditions pour gérer les clics sur d'autres éléments de la barre d'outils si nécessaire
}

  ngOnChanges(changes: SimpleChanges): void {
   // this.changinID(changes.id.currentValue);
  }
  Confirmation(evt) {
    this.showloader = true
    const formData = this.demandeF.value;
    if (!formData.description ) {
      this.toastr.error("Veuillez remplir la description", "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr
      });
      this.showloader = false; // Cacher le loader en cas d'erreur
      return; // Quitter la méthode si des champs sont vides
  }
  if (!formData.description) {
    this.toastr.error("Veuillez remplir la description", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
    });
    this.showloader = false; // Cacher le loader en cas d'erreur
    return; // Quitter la méthode si des champs sont vides
}
  if (this.dataSourceElement.length === 0 ) {
    this.toastr.error("Veuillez ajouter un produit", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
    });
    this.showloader = false; // Cacher le loader en cas d'erreur
    return; // Quitter la méthode si des champs sont vides
}
    this.DA['description'] = formData['description'];
    formData['decision'] = evt.decision.trim();
    formData['wfCurrentComment'] = evt.wfCurrentComment;
  
    console.log("this.demande CONFIRMATION", formData);
        
    // Make sure this call is asynchronous
    this.demandeAchatService.DemandeAchat_process_Submit(formData).subscribe((data:NewDemandeAchat) => {
      const demandeAchatId = data.id; // Ajustez cela selon la structure réelle de votre objet

      this.dataSourceElement.forEach((product) => {
        // Supprimer l'ID temporaire avant l'envoi au backend
        const produitToSave = { ...product, id: null,
          img: product.img, // S'assurer que img est bien assigné
          produit: product.produit, // S'assurer que produit est bien assigné
          demandeAchatId: data.id };
        produitToSave.demandeAchatId = data.id;
        console.log("ppppp",produitToSave);
        
        this.produitDemandeeService.addProduitDemandee(produitToSave).subscribe(
          (response) => {
            console.log('Produit commandé sauvegardé avec succès :', response);
            this.showloader = false; // Hide the loader after success

          },
          (error) => {
            console.error('Erreur lors de la sauvegarde :', error);
            this.showloader = false; // Hide the loader after success

          }
        );
      });
      this.sendNotification();
      this.showloader = false; // Hide the loader after success
  
      this.toastr.success("Demande achat ajouté avec succès", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });
  
      this.router.navigate(['DemandeAchat/allDemandes']);
    }, error => {
      this.toastr.error("Échec de l'ajout", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });
      console.log("error", error);
     this.showloader = false; // Ensure to hide the loader on error
    });
  }

  Return() {
    this.add.emit(false)
    this.router.navigate(['DemandeAchat/allDemandes']);
  }
 
  onToolbarPreparing(e) {
    if (!e.toolbarOptions) {
      e.toolbarOptions = {};
    }
    e.toolbarOptions.items = [];
    e.toolbarOptions.items.unshift(
      {
        location: 'center',
        template: 'Liste des produits demandés'
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
  popupViewerVisible: any = false;
  showPopupWF() {
    this.popupViewerVisible = true;
  }
  openAddPopup() {
    this.popupAddVisible = true;
    this.resetForm(); // Réinitialiser le formulaire

  }
  popupHeight = window.innerHeight-50;
  popupWidth = window.innerWidth - window.innerWidth / 3;
  isLoading: boolean = true; // Variable pour contrôler l'affichage

  getProduitDemande() {
    const id = this.route.snapshot.paramMap.get('id');
      this.produitDemandeeService.getProduitDemandeByDemandeAchatId(id).subscribe((produitDemandee: NewProduitDemandee[]) => {
        this.dataSourceElement = produitDemandee;
    }); // Délai simulé pour le chargement
  }
  username:any;

  sendNotification() {
const demandeAchatId = this.route.snapshot.paramMap.get('id');
    const message = `Nouvelle demande pour validation: ${this.reference}` ;
    const url = `/DemandeAchat/demandeAchat/${demandeAchatId}`;
    this.username = this.cookieService.get('displayname');
    const createdBy=this.username;
    const username="directeurAchat";
    this.webSocketService.sendNotification({ message, url, createdBy, username });
  }
}