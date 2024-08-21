import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventEmitter,Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NewDemandeAchat } from 'src/app/Models/demande-achat.model';
import { DemandeAchatDto } from 'src/app/Models/demande-achatDTO.model';
import { StatutDA } from 'src/app/Models/enumerations/statut-da.model';
import { ComposantsProcesseursCartesMeres, ComposantsMemoireStockage, ComposantsGraphiquesEcrans, ComposantsPeripheriquesEntreeSortie, ComposantsReseauConnectivite, ComposantsAlimentationRefroidissement, ComposantsBoitiersAccessoires, ComposantsPeripheriques, ComposantsPeripheriquesMobiles, ComposantsJeu, ComposantsServeurStockage, ComposantsSecurite, ComposantsAudioVideo, AutresComposants, AccessoiresOrdinateur, EquipementsReseau, ComposantsTelephonie, ComposantsSecuritePhysique, ComposantsStockage, ComposantsSysteme } from 'src/app/Models/enumerations/material.model';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { EnvService } from 'src/env.service';
import { WsService } from 'src/ws.service';
import { format } from 'date-fns';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { DevisDaSharedService } from 'src/app/Service/devis-da-shared.service';
import CustomStore from 'devextreme/data/custom_store';
import { WebSocketService } from 'src/app/Service/web-socket.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-add-demande-achat',
  templateUrl: './add-demande-achat.component.html',
  styleUrls: ['./add-demande-achat.component.scss']
})
export class AddDemandeAchatComponent implements OnInit {
  eventValue: string;

  maxLength = null;

  value: string;

  valueForEditableTextArea: string;

  height = 90;

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
  currentDate: string;
  eventvalueworkflow:any;
  disabled = true;
  eventcontrole=false;
  afficherGridP: boolean = false;
  produitsDemandes: any[] = [];
  dataSourceElement: NewProduitDemandee[];

  demandeAchatId:any;
  produitDemandee: NewProduitDemandee = {
    id:0,demandeAchatId:0,description:'',nom:'',quantite:0
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

  });

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
 //document
  @Output() JsonDocViewerFromFormToComponent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  constructor(private fb: FormBuilder,private demandeAchatService: DemandeAchatService,
              private produitDemandeeService: ProduitDemandeeService,
              private toastr: ToastrService, private env: EnvService,
              private webSocketService: WebSocketService,
              private router: Router,
              public route: ActivatedRoute,
              private cookieService: CookieService
  ) {
    this.currentDate = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    this.demandeForm = this.fb.group({
      iddemandeachat: null, // You might want to initialize other properties based on your requirements
      description: ['', Validators.required],
      statut: StatutDA.en_attente,
      datedemande: this.currentDate,
      datebesoin: [null, Validators.required],
      // deadline: ['']
    });
    this.produitDemandee = {
      id: null,
      demandeAchatId: null,
      nom: '',
      description: '',
      quantite: null,
    };



  }
  getComposantsKeys() {
    return Object.keys(this.composants);
  }
  onRowInserted(event: any): void {
    this.produitsDemandesList.push(event.data);
  }


  addAllProduitsDemandes(): void {
    const promises = this.produitsDemandesList.map(produit => {
      return this.onAddPRD(produit);
    });

    Promise.all(promises)
      .then(() => {
        this.toastr.success('Tous les produits ont été ajoutés avec succès', '', {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: 10000,
          progressBar: true,
          disableTimeOut: false,
          timeOut: 5000
        });
        this.produitsDemandesList = []; // Réinitialiser la liste après l'ajout
      })
      .catch(error => {
        this.toastr.error('Échec d\'ajout de certains produits', '', {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: 10000,
          progressBar: true,
          disableTimeOut: false,
          timeOut: 5000
        });
      });
  }
  onAddPRD(produitDemandee: NewProduitDemandee): Promise<any> {
    console.log('Produit reçu :', produitDemandee);

    if (!produitDemandee.nom || !produitDemandee.description || !produitDemandee.quantite) {
      console.log('Champs manquants :', {
        nom: produitDemandee.nom,
        description: produitDemandee.description,
        quantite: produitDemandee.quantite
      });
      this.toastr.error('Veuillez remplir tous les champs requis', '', {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: 10000,
        progressBar: true,
        disableTimeOut: false,
        timeOut: 5000
      });
      return Promise.reject('Veuillez remplir tous les champs requis');
    }

    const demandeAchatId = this.route.snapshot.paramMap.get('id');
    if (!demandeAchatId) {
      this.toastr.error('ID de demande d\'achat non trouvé', '', {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: 10000,
        progressBar: true,
        disableTimeOut: false,
        timeOut: 5000
      });
      return Promise.reject('ID de demande d\'achat non trouvé');
    }

    return this.produitDemandeeService.saveDemandeAchatWithProduits(demandeAchatId, produitDemandee)
      .toPromise()
      .then(response => {
        console.log('Succès :', response);
        this.toastr.success('Produit ajouté avec succès', '', {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: 10000,
          progressBar: true,
          disableTimeOut: false,
          timeOut: 5000
        });
        return response;
      })
      .catch(error => {
        console.error('Erreur :', error);
        this.toastr.error('Échec d\'ajout du produit', '', {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: 10000,
          progressBar: true,
          disableTimeOut: false,
          timeOut: 5000
        });
        return Promise.reject(error);
      });
  }

  GetjsonDowViewerFromAttatchement(e) {
    this.JsonDocViewerFromFormToComponent.emit(e)
  }
  getById() {
    console.log("inWebServiceGetByID")
    this.AppelWsGetById.emit(true)
  }


  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    this.demandeAchatService.getDemandeAchatById(id).toPromise().then(
      data => {
        console.log("Data received:", data);
  
  
  
        this.objectData = data;
        this.demandeF.get('id').setValue(id);
        this.demandeF.get('description').setValue(data.description);
        this.demandeF.get('datedemande').setValue(data.datedemande);
        this.demandeF.get('statut').setValue("en_attente");
  
        this.decissionWF = data.workflow && data.workflow.decisionsWF ? data.workflow.decisionsWF : null;
        console.log("DECICIONS WK ::: "+ this.decissionWF);
  
        // Ensure data['workflow'] is defined before accessing decisionsWF
        this.decissionWF = data['workflow'] ? data['workflow']['decisionsWF'] : null;
  
        this.envoyer = this.decissionWF === "envoyer";
        console.log("envoyer", this.envoyer);
      },
      error => {
        console.log("Error fetching data:", error);
        // Handle error scenario (e.g., show error message to user)
      }
    );
    this.getProduitDemande();

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
    const formData = this.demandeF.value;
    formData['decision'] = evt.decision.trim();
    formData['wfCurrentComment'] = evt.wfCurrentComment;
    console.log("this.demanade CONFIRMATION", formData);

    this.demandeAchatService.DemandeAchat_process_Submit(formData).subscribe(data => {
      this.sendNotification();
      this.toastr.success(" added successfully", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });

      this.addAllProduitsDemandes();

      this.router.navigate(['DemandeAchat/allDemandes']);
    }, error => {
      this.toastr.error("failed to add ", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });
      console.log("error", error);
    });
  }
  
  Return() {
    this.add.emit(false)
    this.router.navigate(['DemandeAchat/allDemandes']);
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Liste des demandes d achats'
        }
    );
      e.toolbarOptions.items.unshift(
          {
              location: 'after',
              widget: 'dxButton',
              options: {
                  hint: 'Add Produit',
                  icon: 'plus',
              },
          }
      );

  }
  popupViewerVisible: any = false;
  showPopupWF() {
    this.popupViewerVisible = true;
  }
  popupHeight = window.innerHeight-50;
  popupWidth = window.innerWidth - window.innerWidth / 3;

  getProduitDemande() {
    const id = this.route.snapshot.paramMap.get('id');
    this.produitDemandeeService.getProduitDemandeByDemandeAchatId(id).subscribe((produitDemandee: NewProduitDemandee[]) => {
      this.dataSourceElement = produitDemandee;
    });
  }
  username:any;

  sendNotification() {
const demandeAchatId = this.route.snapshot.paramMap.get('id');
    const message = `Nouvelle demande pour validation: ${demandeAchatId}` ;
    const url = `/DemandeAchat/demandeAchat/${demandeAchatId}`;
    this.username = this.cookieService.get('displayname');
    const createdBy=this.username;
    const username="directeurAchat";
    this.webSocketService.sendNotification({ message, url, createdBy, username });
  }
}

