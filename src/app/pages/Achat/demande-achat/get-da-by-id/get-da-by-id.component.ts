import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDemandeAchat } from 'src/app/Models/demande-achat.model';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { ProduitService } from 'src/app/Service/produit.service';
import { IProduit, NewProduit } from '../../../../Models/produit.model';
import { EnvService } from 'src/env.service';
import { ToastrService } from 'ngx-toastr';
import { StatutDA } from 'src/app/Models/enumerations/statut-da.model';
import { FormControl, FormGroup } from '@angular/forms';
import { IProduitDemandee, NewProduitDemandee } from '../../../../Models/produit-demandee.model';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-get-da-by-id',
  templateUrl: './get-da-by-id.component.html',
  styleUrls: ['./get-da-by-id.component.scss']
})
export class GetDaByIdComponent implements OnInit {

  constructor(private route: ActivatedRoute, private demandeAchatService: DemandeAchatService,private produitService:ProduitService,
    private produitDemandeeService:ProduitDemandeeService, private toastr: ToastrService, private env: EnvService,private router:Router) { }
    @Output() add = new EventEmitter<boolean>();
    produitsDemandesStatus: { [key: string]: string } = {};
    demandeF: FormGroup;

    produitDemandeeList: NewProduitDemandee[] = [];
    products : NewProduit[] = [];
  demandeAchat: IDemandeAchat;
  demandeAchatObject: any = {};  // Initialisez ou obtenez cet objet d'une source appropriée
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
    this.demandeF= new FormGroup({
      id: new FormControl(this.route.snapshot.paramMap.get('id')),
      description: new FormControl(''),
      datebesoin: new FormControl(''),
      statut: new FormControl(StatutDA.en_attente),
      datedemande: new FormControl(this.currentdate)
    });
    const id = +this.route.snapshot.paramMap.get('id');
    this.demandeAchatService.getDemandeAchatById(id).toPromise().then(
      data => {
      this.demandeAchatObject = data
      console.log("this.demandeAchatObject : {}", this.demandeAchatObject)

      this.demandeAchat = data;
      this.objectData=data
            
            console.log("Fetched Successfully :", data);
            this.decissionWF = data.workflow && data.workflow.decisionsWF ? data.workflow.decisionsWF : null;

            console.log("DECICIONS WK ::: "+ this.decissionWF);
          
            this.decissionWF = data['workflow']['decisionsWF'];
            if(this.decissionWF=="en stock"){
              this.valider=true;
              console.log("valider",this.valider)
            }else {
              this.valider=false;
            }
          },
          error => {
            console.log("Error :", error);
          });
          this.loadProduitsByDemandeAchatId();
          this.loadProduits();

  }
  
  loadProduitsByDemandeAchatId(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.produitDemandeeService.getProduitDemandeByDemandeAchatId(id).subscribe(
      produits => {
        this.produits = produits;
        console.log('Produits chargés:', this.produits); // Vérifiez les données
        this.compareQuantitesIfDataIsReady();

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
  loadProduits(): void {
    this.produitService.getProduitsSimple().subscribe(
      (data: any[]) => {
        this.products = data;
        console.log('Produits chargés:', this.products); 
        this.compareQuantitesIfDataIsReady();
      },
      error => {
        console.error('Erreur lors du chargement des produits', error);
      }
    );
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
  compareQuantitesIfDataIsReady(): void {
    if (this.products && this.produits) {
      this.compareQuantites(this.products, this.produits);
    }
  }
  
  compareQuantites(produits: IProduit[], produitsDemandes: IProduitDemandee[]): void {
    produitsDemandes.forEach((produitDemande) => {
      const produitCorrespondant = produits.find((produit) => produit.nom === produitDemande.nom);
      if (produitCorrespondant) {
        if (produitCorrespondant.quantite >= produitDemande.quantite) {
          console.log(`${produitDemande.nom} est en stock`);
          this.produitsDemandesStatus[produitDemande.nom] = 'in-stock';
        } else {
          console.log(`${produitDemande.nom} n'est pas en stock`);
          this.produitsDemandesStatus[produitDemande.nom] = 'out-of-stock';
        }
      } else {
        console.log(`${produitDemande.nom} n'a pas de correspondance`);
        this.produitsDemandesStatus[produitDemande.nom] = 'no-match';
      }
    });
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
  Confirmation(evt: any) {
    const formData = this.demandeF.value;
    formData['decision'] = evt.decision ? evt.decision.trim() : ''; // Vérifier si decision est défini
    formData['wfCurrentComment'] = evt.wfCurrentComment ? evt.wfCurrentComment.trim() : ''; // Vérifier si wfCurrentComment est défini
  
    console.log("Confirmation de la demande:", formData);
  
    if (formData['decision'] === 'valider') {
      this.validerDemande(formData);
    } else if (formData['decision'] === 'envoyer') {
      this.envoyerDemande(formData);
    } else {
      console.warn("Décision inconnue:", formData['decision']);
      this.toastr.warning("Décision inconnue", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        timeOut: this.env.timeOutToastr
      });
    }
  }
  validerDemande(evt) {
    const formData = this.demandeF.value;
    formData['decision'] = 'valider';
    formData['wfCurrentComment'] = evt.wfCurrentComment ? evt.wfCurrentComment.trim() : '';
  
    console.log("Confirmation de la demande:", formData);
  
    // Valider la demande après la mise à jour du statut
    this.demandeAchatService.DemandeAchat_process_Submit(formData).subscribe(data => {
      this.updateStatutDemande();
      this.toastr.success(" added successfully", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });
     
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

  updateStatutDemande() {
    const id = +this.route.snapshot.paramMap.get('id');
    const nouveauStatut: StatutDA = StatutDA.termine;
  
    this.demandeAchatService.updateStatut(id, nouveauStatut).subscribe(
      (response) => {
        this.toastr.success("Statut mis à jour avec succès", "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr
        });
      },
      (error) => {
        this.toastr.error("Échec de la mise à jour du statut", "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr
        });
        console.error("Erreur lors de la mise à jour du statut:", error);
      }
    );
  }
  updateStatut(id: number, nouveauStatut: StatutDA) {
    return this.demandeAchatService.updateStatut(id, nouveauStatut).toPromise();
  }
  
envoyerDemande(evt) {
    // Logique spécifique pour l'envoi
    const formData = this.demandeF.value;
    formData['decision'] = 'envoyer';
    formData['wfCurrentComment'] = evt.wfCurrentComment ? evt.wfCurrentComment.trim() : '';
    console.log("this.demanade CONFIRMATION", formData);
    this.demandeAchatService.DemandeAchat_process_Submit(formData).subscribe(data => {
      this.toastr.success(" added successfully", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });

      // Appel de onAddPRD avec l'ID de la demande d'achat après soumission réussie
      const demandeAchatId = this.route.snapshot.paramMap.get('id'); // Supposons que l'ID est renvoyé dans la réponse
      // Redirection vers la liste des demandes
      this.router.navigate(['DemandeDevis/add/'+ demandeAchatId]);
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
    // this.closepopupMeeting();
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
