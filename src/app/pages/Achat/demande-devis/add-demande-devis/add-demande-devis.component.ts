import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { IDemandeAchat, NewDemandeAchat } from '../../../../Models/demande-achat.model';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { IProduitDemandee, NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnvService } from 'src/env.service';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { NewDemandeDevis, IDemandeDevis } from '../../../../Models/demande-devis.model';
import { DevisDaSharedService } from '../../../../Service/devis-da-shared.service';
import { NewFournisseur } from 'src/app/Models/fournisseur.model';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { StatutDA } from 'src/app/Models/enumerations/statut-da.model';
import { ProduitService } from 'src/app/Service/produit.service';
import { IProduit, NewProduit } from 'src/app/Models/produit.model';
import { format } from 'date-fns';
import moment from 'moment';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ProduitCommandeeService } from '../../../../Service/produit-commandee.service';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';
import { Categorie } from 'src/app/Models/enumerations/categorie.model';
import { CategorieService } from 'src/app/Service/categorie.service';
import { NewCategorie } from 'src/app/Models/categorie.model';
import { forkJoin, take } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { WebSocketService } from 'src/app/Service/web-socket.service';

@Component({
  selector: 'app-add-demande-devis',
  templateUrl: './add-demande-devis.component.html',
  styleUrls: ['./add-demande-devis.component.scss']
})
export class AddDemandeDevisComponent implements OnInit {
  showTooltip = false;
  qp = '';
  objectData:any;
  demandeForm: any;
  demandeDevis: NewDemandeDevis;
  demandesDevis: NewDemandeDevis [];
  produitDemandeeList: NewProduitDemandee[] = [];
  produitCommandeeList: NewProduitCommandee[] = [];
  popupAdd = false;
  categories: NewCategorie[] = [];

  popupAddVisible = false;
  products : NewProduit[] = [];
  produitAcomparer : NewProduit[] ;

  hide:boolean;
  produitsCommandes: any[] = [];
  categoryOptions: any; // Déclarer un objet pour les options de catégorie
  filteredProducts = [];
  selectedCategorieId: number | null = null;
  showloader:boolean = false;
  decissionWF: any;
  envoyer: boolean = false;
  demandeAchatObject: any = {};
  demandeAchat: IDemandeAchat;
  fournisseurs: any[] = []; // Array to store the list of fournisseurs
  currentdate = new Date();
  currentDateDD :string;
  produits: NewProduitDemandee[] = [];
  produitsC: NewProduitCommandee[] = [];
  produitCommandee: NewProduitCommandee = {
    id:null,demandeDevis:null,description:'',nom:'',quantite:1,produit:null,img:'',categorie:0
  };
  produitsDemandesStatus: { [key: string]: string } = {};
  dataSourceElement: any;
currentDate:string;
public codeDemandeDevis: string = ''; // Stocke le code à afficher

  //editingItem: any = null;
  pageSize = this.env.pageSize;
    allowedPageSizes = this.env.allowedPageSizes;
    addedDemandeDevis:any;
    selectedProduitNom: string;           // Remplace par le type approprié
    selectedProduitDescription: string;    // Remplace par le type approprié
    selectedProduitQuantite: number;  
    selectedProduitId: number;  
    selectedDemandeDevisId: number; 
  // Liste des fournisseurs
  demandeF= new FormGroup({
    id: new FormControl(this.route.snapshot.paramMap.get('id')),
    description: new FormControl(''),
    datebesoin: new FormControl(''),
    statut: new FormControl(StatutDA.en_attente),
    datedemande: new FormControl(this.currentdate)
  });
  
  formDataP: NewProduitCommandee = {
    id: null,
    nom: '',
    img:'',
    description: '',
    quantite: 1,
    produit:null, // Initialiser avec un produit vide
    demandeDevis: null,
    categorie:null // Exemples, ajustez selon vos besoins
  };

  @ViewChild(DxFormComponent, { static: false }) dxFormComponent: DxFormComponent;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Output() add = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private demandeDevisService: DemandeDevisService,
    private produitService: ProduitService,
    private devisService: DevisDaSharedService,
    private produitDemandeeService: ProduitDemandeeService,
    public demandeAchatService: DemandeAchatService,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private env: EnvService,
    private router: Router,
    private fournisseurService:FournisseurService,
    private produitCommandeeService:ProduitCommandeeService,
    private categorieService:CategorieService,
    private cookieService: CookieService,
    private webSocketService: WebSocketService,


  ) {
    this.demandeForm = this.fb.group({
      produits: this.fb.array([])
    });
    this.produitCommandee = {
      id: null, 
      produit:null,
      demandeDevis:null, // Initialisation de l'ID, 0 ou une autre valeur par défaut
      nom: '',
      quantite: 1,
      description: '',
      img:'',
      categorie:0,
      // Ajoutez d'autres propriétés si nécessaire
    };
  }

  getSelectedItem(item: any) {
    return item;
  }
closePopUp(){
  this.popupAdd = false;
}
  closeAddPopup() {
    this.popupAddVisible = false;
  }

  onRowPrepared(e: any) {
    if (e.rowType === 'data') {
      const status = this.produitsDemandesStatus[e.data.nom];
      if (status === 'in-stock') {
        e.rowElement.style.backgroundColor = '#93e4a6'; // Vert
      } else if (status === 'out-of-stock') {
        e.rowElement.style.backgroundColor = '#f8d7da'; // Rouge
      } else if (status === 'no-match') {
        e.rowElement.style.backgroundColor = '#fefefe'; // Autre couleur
      }
    }
  }


  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.demandeAchatService.getDemandeAchatById(id).toPromise().then(
      data => {
        this.demandeAchatObject = data;
        this.demandeAchat = data;
        this.objectData = data;
        this.decissionWF = data.workflow?.decisionsWF ?? null;

        if (this.decissionWF === "envoyer") {
          this.envoyer = true;
        } else {
          this.envoyer = false;
        }
      },
      error => {
        console.error("Error fetching demandeAchat:", error);
      }
    );
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
    this.loadProduitsByDemandeAchatId();
    this.loadFournisseurs();
    this.getDemandesDevisByDemandeAchat();
    this.loadProduits();
this.genererCode();

  //  this.loadProduitCommandeeData(this.demandeDevis.id);
  }
  popoverTarget: any; // Référence à l'élément cible pour le popover
  isPopoverVisible = false; // Contrôle la visibilité du popover

  quantiteCalculee: number;
  quantitedifference:number;
  handleRowPrepared(e) {
    if (e.rowType === 'data') {
      e.rowElement.addEventListener('mouseenter', () => this.showPopover(e.rowElement, e.data.produit.id));
      e.rowElement.addEventListener('mouseleave', () => this.hidePopover());
    }
  }
  togglePopover(event: MouseEvent) {
    this.popoverTarget = event.currentTarget as HTMLElement; // Définir la cible du popover
    this.isPopoverVisible = !this.isPopoverVisible; // Inverser l'état de visibilité
    console.log('Quantité calculée:', this.quantiteCalculee); // Vérification de la quantité
  }
  
  genererCode(): void {
    this.demandeDevisService.genererCodeDemandeDevis().subscribe(
      (code: string) => {
        this.codeDemandeDevis = code;
        console.log('Code généré:', this.codeDemandeDevis);
      },
      (error) => {
        console.error('Erreur lors de la génération du code:', error);
      }
    );
  }
  // Méthodes pour afficher et masquer le popover
  showPopover(target, produitId) {
    this.popoverTarget = target; // Cibler l'élément sur lequel la souris est passée
    const product = this.products.find(p => p.id === produitId);
    const produitDemande = this.produits.find(pd => pd.produit.id === produitId);

    if (product && produitDemande) {
      this.quantiteCalculee = product.quantite; // Recalculer la quantité
      this.quantitedifference = product.quantite - produitDemande.quantite;
        this.isPopoverVisible = true; // Afficher le popover   }
  }
}
  hidePopover() {
    this.isPopoverVisible = false;
  }
  getStockStatus(produitId: number): string {
    const product = this.products.find(p => p.id === produitId);
    const produitDemande = this.produits.find(pd => pd.produit.id === produitId);
    if (!product || !produitDemande) {
      return 'Inconnu'; // Retourne 'Inconnu' si le produit ou la demande n'est pas trouvée
    }

    return product.quantite < produitDemande.quantite ? 'Épuisé' : 'En stock';
  }
  calculateStockStatus = (rowData) => {
    const product = this.products.find(p => p.id === rowData.produit.id);
    if (product) {
      return product.quantite < rowData.quantite ? 'Épuisé' : 'En stock';
    }
    return 'Inconnu'; // Si le produit n'est pas trouvé
  };

  // Template pour afficher l'état avec des couleurs
  etatStockCellTemplate = (container, options) => {
    const etatStock = options.value;
    const color = etatStock === 'Épuisé' ? 'red' : 'green';
    container.innerHTML = `<span style="color: ${color}">${etatStock}</span>`;
  };

  loadProduits(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.produitService.getProduitsSimple().subscribe(
        (data: any[]) => {
          this.products = data;
          console.log('Produits chargés:', this.products);
          resolve(); // Résoudre la promesse lorsque les produits sont chargés
        },
        error => {
          console.error('Erreur lors du chargement des produits', error);
          reject(error); // Rejeter la promesse en cas d'erreur
        }
      );
    });
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
  demandeDevisForm = this.fb.group({
    nom: ['', Validators.required],
    description: ['', Validators.required],
    fournisseurId: ['', Validators.required],
  });
  loadProduitsByDemandeAchatId(): Promise<void> {
    const id = +this.route.snapshot.paramMap.get('id');
    return new Promise((resolve, reject) => {
      this.produitDemandeeService.getProduitDemandeByDemandeAchatId(id).subscribe(
        produitsDemandes => {
          this.produits = produitsDemandes;

          // Trouver le premier produit épuisé
          const produitEpuisé = this.produits.find(pd => this.getStockStatus(pd.produit.id) === 'Épuisé');
          
          // Si un produit épuisé est trouvé, on l'utilise ; sinon, on prend le premier produit de la liste
          const produitChoisi = produitEpuisé || this.produits[0];

          this.formDataP = {
            id: null,
            nom: produitChoisi.nom || '',
            img: produitChoisi.img || '',
            description: '',
            quantite: produitChoisi.quantite,
            produit: produitChoisi.produit[0] || null, // Assigner null si produit est null
            demandeDevis: null,
            categorie: produitChoisi.produit.categorie.id
          };

          // Log de confirmation
          console.log('Produit sélectionné:', produitChoisi);
          console.log('Données du formulaire:', this.formDataP);

          resolve(); // Résoudre la promesse lorsque les produits demandés sont chargés
        },
        error => {
          console.log('Une erreur s\'est produite lors du chargement des produits demandés : ', error);
          reject(error); // Rejeter la promesse en cas d'erreur
        }
      );
    });
}

  loadProduitDemandeeData(id: number): void {
    this.produitDemandeeService.getProduitDemandeByDemandeAchatId(id).subscribe(
      produitDemandeeList => {
        this.produitDemandeeList = produitDemandeeList;
        console.log('Produits demandés chargés:', this.produitDemandeeList); // Vérifiez les données
      },
      error => {
        console.log('Une erreur s\'est produite lors du chargement des produits demandés : ', error);
      }
    );
  }
  produitCommandeeMap: { [key: number]: NewProduitCommandee[] } = {}; // Déclaration de la map ici

  loadProduitCommandeeData(demandeId: number): void {
    this.produitCommandeeService.getProduitCommandeeByDemandeDevisId(demandeId).subscribe(
      produitCommandeeList => {
        // Stocker la liste des produits dans la map
        this.produitCommandeeMap[demandeId] = produitCommandeeList;
        console.log(`Produits demandés pour la demande ${demandeId} :`, produitCommandeeList);
      },
      error => {
        console.log(`Erreur lors du chargement des produits demandés pour la demande ${demandeId} :`, error);
      }
    );
  }
onProduitChange(e: any): void {
  const selectedProductId = e.value;
  const selectedProduct = this.products.find(p => p.id === selectedProductId);
  if (selectedProduct) {
    this.formDataP.produit = selectedProduct; // Remplacer 'produit' par l'objet produit sélectionné
    this.formDataP.nom = selectedProduct.nom; // Si vous avez un champ 'nom' distinct dans votre modèle
  }
}
/*loadProduitsDemandeeDansleFormulaire() {
  this.produitDemandeeService.getProduitsDemandee().subscribe((produitDemandeeList) => {
    // Vérifier que la liste n'est pas vide avant d'initialiser formDataP
    if (produitDemandeeList && produitDemandeeList.length > 0) {
      const premierProduitDemandee = produitDemandeeList[0];
      this.formDataP = {
        id: premierProduitDemandee.id,
        nom: premierProduitDemandee.nom || '',
        img: premierProduitDemandee.img || '',
        description: premierProduitDemandee.description || '',
        quantite: premierProduitDemandee.quantite || 1,
        produit: premierProduitDemandee.produit || null,
        demandeDevis: premierProduitDemandee.demandeDevis || null
      };
    }
  });
}
*/
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
  

  Return() {
    this.add.emit(false);
    this.router.navigate(['DemandeAchat/allDemandes']);
  }

  getDemandesDevisByDemandeAchat(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.demandeDevisService.getDemandesDevisByDemandeAchatId(id).subscribe(
      (demandes: NewDemandeDevis[]) => {
        this.demandesDevis = demandes;

        // Charger les produits commandés pour chaque demande
        this.demandesDevis.forEach(demande => {
          this.loadProduitCommandeeData(demande.id);
        });
      },
      error => {
        console.error('Erreur lors de la récupération des demandes de devis :', error);
      }
    );
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'center',
        template: 'Liste des produits à commander'
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          hint: 'Add',
          icon: 'plus',
          onClick:() => this.openAddPopup(),
        },
      }
    );
    
  }
  onToolbarPreparingPD(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'center',
        template: 'Liste des produits demandées'
      },
    );
    
  }

  addDemandeDevis() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.showloader = true;

    if (this.demandeDevisForm.invalid) {
        this.showloader = false;
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

    // Vérifiez la valeur de codeDemandeDevis ici
    console.log('Code de la demande de devis avant l\'envoi :', this.codeDemandeDevis);
    
    this.currentDate = format(new Date(), 'yyyy-MM-dd');
    const newDemandeDevis: NewDemandeDevis = {
        datedemande: this.currentDate,
        fournisseur: {
            id: Number(this.demandeDevisForm.get('fournisseurId').value),
            adresse: null,
            email: null,
            tel: null,
            nom: null,
        },
        reference:this.codeDemandeDevis,
        id: null,
        nom: this.demandeDevisForm.get('nom').value,
        description: this.demandeDevisForm.get('description').value,
        demandeAchat: {  
            id: id,
            datebesoin: null,
            datedemande: null,
            description: null,
            produits: null,
            reference: null,
            statut: null
        }
    };
    this.demandeDevisService.saveDemandeDevis(newDemandeDevis).subscribe(
        savedDemandeDevis => {
          this.demandeDevis = savedDemandeDevis;
          console.log('demandeDevis',this.demandeDevis)  ;
            this.showloader = false;
            this.toastr.success("Demande de devis ajoutée avec succès", "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            });
                this.sendNotification()

         //   console.log('demandeDevis', newDemandeDevis);
            this.produitCommandeeList.forEach((product) => {
                // Supprimer l'ID temporaire avant l'envoi au backend
                const produitToSave = { ...product, id: null };
                produitToSave.demandeDevis = savedDemandeDevis;
                
                this.produitCommandeeService.saveProduitCommandee(produitToSave).subscribe(
                    (response) => {
                        this.getDemandesDevisByDemandeAchat();
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
    this.closePopUp();
}

  saveProduitCommandeeInDataGrid() {
    const newProduitCommandee: NewProduitCommandee = {
      id: new Date().getTime(), 
      nom: this.formDataP.produit.nom,
      description: this.formDataP.description,
      quantite: this.formDataP.quantite,
      produit: this.formDataP.produit,
      img:this.formDataP.produit.img,
      demandeDevis:null,
      categorie:this.formDataP.categorie
    };

    // Ajouter le nouveau produit à la liste locale
    this.produitCommandeeList.push(newProduitCommandee);
    console.log("categorie",newProduitCommandee.categorie);

    // Rafraîchir la grille pour afficher le nouvel élément
    this.dataGrid.instance.refresh();
    
    // Réinitialiser le formulaire pour un nouvel ajout éventuel
    this.formDataP = {
      id: null,
      nom: '',
      description: '',
      quantite: 1,
      produit: { id: null, img: null}, 
      demandeDevis:null,
      img:null,
      categorie:this.formDataP.categorie,// Réinitialiser le produit vide
    };
    this.closeAddPopup()
}
  openAddPage() {
    this.popupAdd = true;
    this.genererCode();

  }
  openAddPopup() {
    this.popupAddVisible = true;
    this.loadProduitsForCategorie(this.formDataP.categorie);

  }

  popupViewerVisible: any = false;
  showPopupWF() {
    this.popupViewerVisible = true;
  }

  over() {
    console.log('Mouseover called');
    this.qp = 'Mouse over';
    this.showTooltip = true; // Afficher le cadre
  }

  out() {
    console.log('Mouseout called');
    this.qp = '';
    this.showTooltip = false; // Masquer le cadre
  }
  username:any;
  sendNotification() {
    const demandeDevisId = this.demandeDevis.id;
        const message = `Nouvelle demande de devis recu: ${this.codeDemandeDevis}` ;
        const url = `/DemandeDevis/demandeDevis/${demandeDevisId}`;
        this.username = this.cookieService.get('displayname');
        const createdBy=this.username;
        const username="depositOffre";
        this.webSocketService.sendNotification({ message, url, createdBy, username });
      }
  private compteur: number = 0; // Compteur pour l'incrémentation


  popupHeight = window.innerHeight - 50;
  popupWidth = window.innerWidth - window.innerWidth / 3;
}
