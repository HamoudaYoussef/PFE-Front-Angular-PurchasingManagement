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
import { NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { ProduitCommandeeService } from 'src/app/Service/produit-commandee.service';
import { OffreService } from 'src/app/Service/offre.service';
import { IOffre, NewOffre } from 'src/app/Models/offre.model';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { NewFournisseur } from '../../../../Models/fournisseur.model';
import { BonCommandeModule } from '../../bon-commande/bon-commande.module';
import { NewBonCommande } from 'src/app/Models/bon-commande.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-get-da-by-id',
  templateUrl: './get-da-by-id.component.html',
  styleUrls: ['./get-da-by-id.component.scss']
})
export class GetDaByIdComponent implements OnInit {

  constructor(private route: ActivatedRoute, private demandeAchatService: DemandeAchatService,private produitService:ProduitService,
    private produitDemandeeService:ProduitDemandeeService, private toastr: ToastrService,private produitCommandeeService:ProduitCommandeeService,
    private demandeDevisService:DemandeDevisService, private env: EnvService,private router:Router,private offreService:OffreService,
  private produitOffertService:ProduitOffertService,private cookieService:CookieService) { }
    @Output() add = new EventEmitter<boolean>();
    produitsDemandesStatus: { [key: string]: string } = {};
    demandeF: FormGroup;
    displayname: string;
    offre:IOffre
    hide:boolean;
    produitDemandeeList: NewProduitDemandee[] = [];
    products : NewProduit[] = [];
    fournisseurs: { [key: number]: NewFournisseur } = {}; // Objet pour stocker les fournisseurs par ID de demande de devis
    offres : any []
  demandeAchat: IDemandeAchat;
  demandeAchatObject: any = {};  // Initialisez ou obtenez cet objet d'une source appropriée
  pageSize = this.env.pageSize;
    allowedPageSizes = this.env.allowedPageSizes;
  demandeForm: any = {};  // Initialisez ou obtenez cet objet d'une source appropriée
  decissionWF: any;  // Initialisez ou obtenez cet objet d'une source appropriée
  objectData:any;
  envoyer : boolean=false ;
  valider : boolean=false;
  currentdate : Date;
  dataSourceElement: any;
  produitDemandees: NewProduitDemandee[] = [];
produit : NewProduit;
produitDemandee : NewProduitDemandee;
demandesDevis: NewDemandeDevis [];
showButton:any;
isPopoverVisible = false; // Contrôle la visibilité du popover

produitCommandeeMap: { [key: number]: NewProduitCommandee[] } = {}; // Déclaration de la map ici
produitOffertMap: { [key: number]: NewProduitOffert[] } = {};
offreMap: { [key: number]: NewOffre } = {}; 
BonCommandes: { [key: number]: NewBonCommande } = {}; // Objet pour stocker les fournisseurs par ID de demande de devis
// A map to store offers by DemandeDevis ID
fournisseur:NewFournisseur;
 // Déclaration de la map ici
 popoverContent = 'acab'; // Contenu du popover
 popoverTarget: any; // Référence à l'élément cible pour le popover

  ngOnInit(): void {
    this.displayname = this.cookieService.get('displayname');

    this.currentdate = new Date(); // Initialiser currentdate ici
    this.demandeF= new FormGroup({
      id: new FormControl(this.route.snapshot.paramMap.get('id')),
      description: new FormControl(''),
     // datebesoin: new FormControl(''),
      statut: new FormControl(StatutDA.en_attente),
      datedemande: new FormControl(this.currentdate)
    });
    const id = +this.route.snapshot.paramMap.get('id');
    this.demandeAchatService.getDemandeAchatById(id).toPromise().then(
      data => {
      this.demandeAchatObject = data
    //  this.demandeAchat.description = ''
      console.log("this.demandeAchatObject : {}", this.demandeAchatObject)
    //  console.log(data.reference)
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
          
          this.loadProduits()
    .then(() => this.loadProduitsByDemandeAchatId())
    .then(() => {
      this. getDemandesDevisByDemandeAchat();
    })
    .catch(error => {
      console.error('Erreur lors du chargement des produits ou des produits demandés:', error);
    });
  }
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
  
  // Méthodes pour afficher et masquer le popover
  showPopover(target, produitId) {
    this.popoverTarget = target; // Cibler l'élément sur lequel la souris est passée
    const product = this.products.find(p => p.id === produitId);
    const produitDemande = this.produitDemandees.find(pd => pd.produit.id === produitId);

    if (product && produitDemande) {
      this.quantiteCalculee = product.quantite; // Recalculer la quantité
      this.quantitedifference = product.quantite - produitDemande.quantite;
        this.isPopoverVisible = true; // Afficher le popover   }
  }
}
  hidePopover() {
    this.isPopoverVisible = false;
  }
  quantiteCalculee: number;
  quantitedifference:number;
  getStockStatus(produitId: number): string {
    const product = this.products.find(p => p.id === produitId);
    const produitDemande = this.produitDemandees.find(pd => pd.produit.id === produitId);
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

  // Autres méthodes et logiques de votre composant

  getDemandesDevisByDemandeAchat(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    this.demandeDevisService.getDemandesDevisByDemandeAchatId(id).subscribe(
        (demandes: NewDemandeDevis[]) => {
            this.demandesDevis = demandes || [];
            if (this.demandesDevis.length > 0) {
                this.getFournisseurByDemandeDevis(); // Récupérer les fournisseurs après avoir chargé les demandes
            } else {
                console.warn('Aucune demande de devis trouvée pour cette demande d\'achat.');
            }

            this.offres = []; // Initialize this.offres
            this.offreMap = {}; // Initialize the offreMap
            
            this.demandesDevis.forEach(demande => {
                this.loadProduitCommandeeData(demande.id);
                this.offreService.getOffreByDemandeDevis(demande.id).subscribe(
                    (offre: NewOffre) => {
                        this.offreMap[demande.id] = offre;
                        this.offres.push(offre);
                        this.offre = offre;
                        this.loadProduitOffertData(offre.id);

                        console.log('OffreMap:', this.offreMap);
                    },
                    error => {
                        console.error(`Erreur lors de la récupération de l'offre pour la demande de devis ID ${demande.id}:`, error);
                    }
                );
            });
        },
        error => {
            console.error('Erreur lors de la récupération des demandes de devis :', error);
        }
    );
}

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
 
  /* compareQuantites(): void {
    this.products.forEach(product => {
      const produitDemande = this.produitDemandees.find(pd => pd.produit.id === product.id);
      if (produitDemande) {
        // Comparer les quantités
        if (product.quantite < produitDemande.quantite) {
          console.log(`Produit ${product.nom} : Quantité disponible (${product.quantite}) est inférieure à la quantité demandée (${produitDemande.quantite}).`);
        } else if (product.quantite === produitDemande.quantite) {
          console.log(`Produit ${product.nom} : Quantité disponible (${product.quantite}) est égale à la quantité demandée (${produitDemande.quantite}).`);
        } else {
          console.log(`Produit ${product.nom} : Quantité disponible (${product.quantite}) est supérieure à la quantité demandée (${produitDemande.quantite}).`);
        }
      } else {
        console.log(`Produit ${product.nom} : Aucun produit demandé correspondant trouvé.`);
      }
    });
  }*/
  loadProduitsByDemandeAchatId(): Promise<void> {
    const id = +this.route.snapshot.paramMap.get('id');
    
    return new Promise((resolve, reject) => {
      this.produitDemandeeService.getProduitDemandeByDemandeAchatId(id).subscribe(
        produitsDemandes => {
          this.produitDemandees = produitsDemandes;
          console.log('Produits demandés:', this.produitDemandees);
          resolve(); // Résoudre la promesse lorsque les produits demandés sont chargés
        },
        error => {
          console.log('Une erreur s\'est produite lors du chargement des produits demandés : ', error);
          reject(error); // Rejeter la promesse en cas d'erreur
        }
      );
    });
  }
  getFournisseurByDemandeDevis(): void {
    if (!this.demandesDevis || this.demandesDevis.length === 0) {
        console.warn('Aucune demande de devis disponible pour récupérer les fournisseurs.');
        return;
    }

    this.demandesDevis.forEach(demande => {
        this.demandeDevisService.getFournisseurByDemandeDevisId(demande.id).subscribe(
            (fournisseur: NewFournisseur) => {
                // Stocker le fournisseur par l'ID de la demande de devis
                this.fournisseurs[demande.id] = fournisseur;

                console.log(`Fournisseur pour la demande de devis ID ${demande.id} :`, fournisseur);
            },
            error => {
                console.error(`Erreur lors de la récupération du fournisseur pour la demande de devis ID ${demande.id}:`, error);
            }
        );
    });
}

loadProduitOffertData(offreId: number): void {
  this.produitOffertService.getProduitOffertsByOffreId(offreId).subscribe(
    produitOffertList => {
      // Stocker la liste des produits dans la map
      this.produitOffertMap[offreId] = produitOffertList;
      this.getProduitsGroupedByBonCommande(offreId);
      console.log(`Produits offert par offre ${offreId} :`, produitOffertList);
    },
    error => {
      console.log(`Erreur lors du chargement des produits offert pour l'offre ${offreId} :`, error);
    }
  );
}
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
  produitsGroupedByOffre: Map<number, Map<number, any[]>> = new Map();

  getProduitsGroupedByBonCommande(offreId: number): void {
    this.produitOffertService.getProduitsGroupedByBonCommande(offreId).subscribe(
        (data) => {
            console.log("Données reçues pour l'offre ID:", offreId, data);
            const mapData = new Map<number, any[]>(
                Object.entries(data).map(([key, value]) => [parseInt(key, 10), value as any[]])
            );
            this.produitsGroupedByOffre.set(offreId, mapData);
            console.log("Produits regroupés après transformation pour l'offre ID:", offreId, this.produitsGroupedByOffre);
        },
        (error) => {
            console.error('Erreur lors de la récupération des produits groupés par bon de commande :', error);
        }
    );
}
  

  Confirmation(evt: any) {
    const formData = this.demandeF.value;
    formData['decision'] = evt.decision ? evt.decision.trim() : ''; 
    formData['wfCurrentComment'] = evt.wfCurrentComment ? evt.wfCurrentComment.trim() : '';

    console.log("Confirmation de la demande:", formData);



     if (formData['decision'] === 'demander devis') {
      this.envoyerDemande(formData);
    } 
    // Si la décision est "valider" et tous les produits sont en stock
    else if (formData['decision'] === 'valider') {
      this.validerDemande(formData);
    } 
    // Si la décision est "demander devis", continuer sans vérification de stock

    // Si la décision est "annuler", continuer sans vérification de stock
    else if (formData['decision'] === 'annuler')  {
      this.annulerDemande(formData);
    } 
    else if (formData['decision'] === 'retourner')  {
      this.retournerDemande(formData);
    }

    else {
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
retournerDemande(evt) {
  const formData = this.demandeF.value;
  formData['decision'] = 'retourner';
  formData['description'] = this.demandeAchatObject.description;

  formData['wfCurrentComment'] = evt.wfCurrentComment ? evt.wfCurrentComment.trim() : '';

  console.log("Confirmation de la demande:", formData);
  const id = +this.route.snapshot.paramMap.get('id');

  // Valider la demande après la mise à jour du statut
  this.demandeAchatService.DemandeAchat_process_Submit(formData).subscribe(() => {
    this.statutEnAttente(); // Met le statut en attente après soumission

setTimeout(() => {
  this.router.navigate(['DemandeAchat/demandeAchat']);
}, 100);
  });
}

validerDemande(evt) {
  const formData = this.demandeF.value;
  formData['decision'] = 'valider';
  formData['description'] = this.demandeAchatObject.description;
  formData['wfCurrentComment'] = evt.wfCurrentComment ? evt.wfCurrentComment.trim() : '';

  // Vérification du stock pour chaque produit demandé

  console.log("Confirmation de la demande:", formData);

  // Valider la demande après la vérification du stock
  this.demandeAchatService.DemandeAchat_process_Submit(formData).subscribe(data => {
      this.updateStatutDemande();
      this.toastr.success("Demande d'achat validée", "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr
      });
  }, error => {
      this.toastr.error("Échec de la validation", "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr
      });
      console.log("Erreur:", error);
  });
}
  annulerDemande(evt) {
    const formData = this.demandeF.value;
    formData['decision'] = 'annuler';
    formData['description'] = this.demandeAchatObject.description;

    formData['wfCurrentComment'] = evt.wfCurrentComment ? evt.wfCurrentComment.trim() : '';
  
    console.log("Confirmation de la demande:", formData);
  
    // Valider la demande après la mise à jour du statut
    this.demandeAchatService.DemandeAchat_process_Submit(formData).subscribe(data => {
      this.updateStatutAnnuler();
      this.toastr.warning(" Demande achat annulé", "", {
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
    );
  }
  updateStatutAnnuler() {
    const id = +this.route.snapshot.paramMap.get('id');
    const nouveauStatut: StatutDA = StatutDA.Rejetee;
  
    this.demandeAchatService.updateStatutAnnuler(id, nouveauStatut).subscribe();
  }
  statutEnAttente() {
    const id = +this.route.snapshot.paramMap.get('id');
    const nouveauStatut: StatutDA = StatutDA.en_attente;
    this.demandeAchatService.statutEnAttente(id, nouveauStatut).subscribe();
  }
 
envoyerDemande(evt) {
    // Logique spécifique pour l'envoi
    const formData = this.demandeF.value;
    formData['decision'] = 'demander devis';
    formData['description'] = this.demandeAchatObject.description;


    formData['wfCurrentComment'] = evt.wfCurrentComment ? evt.wfCurrentComment.trim() : '';
    console.log("this.demanade CONFIRMATION", formData);
    this.demandeAchatService.DemandeAchat_process_Submit(formData).subscribe(data => {
      this.statutEnAttente();
      this.toastr.success(" Vous pouvez maintenant ajouter une demande de devis", "", {
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
