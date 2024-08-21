import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { IDemandeAchat, NewDemandeAchat } from '../../../../Models/demande-achat.model';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
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
import { NewProduit } from 'src/app/Models/produit.model';

@Component({
  selector: 'app-add-demande-devis',
  templateUrl: './add-demande-devis.component.html',
  styleUrls: ['./add-demande-devis.component.scss']
})
export class AddDemandeDevisComponent implements OnInit {
  objectData:any;
  demandeForm: any;
  demandeDevis: NewDemandeDevis;
  demandesDevis: NewDemandeDevis [];
  produitDemandeeList: NewProduitDemandee[] = [];

  decissionWF: any;
  envoyer: boolean = false;
  demandeAchatObject: any = {};
  demandeAchat: IDemandeAchat;
  fournisseurs: NewFournisseur[]; 
  currentdate = new Date();
  // Liste des fournisseurs
  demandeF= new FormGroup({
    id: new FormControl(this.route.snapshot.paramMap.get('id')),
    description: new FormControl(''),
    datebesoin: new FormControl(''),
    statut: new FormControl(StatutDA.en_attente),
    datedemande: new FormControl(this.currentdate)
  });

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
    private fournisseurService:FournisseurService
  ) {
    this.demandeForm = this.fb.group({
      produits: this.fb.array([])
    });

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

    this.loadProduitsByDemandeAchatId();
    this.loadFournisseurs();
  }

  loadProduitsByDemandeAchatId(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.produitDemandeeService.getProduitDemandeByDemandeAchatId(id).subscribe(
      produits => {
        this.produitDemandeeList = produits;
        this.initializeProduitsForms(produits);
      },
      error => {
        console.error('Error loading produits:', error);
      }
    );
  }

  loadFournisseurs(): void {
    this.fournisseurService.getFournisseurs().subscribe(
      (data: NewFournisseur[]) => {
        this.fournisseurs = data;
      },
      error => {
        console.error('Error fetching fournisseurs:', error);
      }
    );
  }
  initializeProduitsForms(produits: NewProduitDemandee[]): void {
    this.produitsForms.clear(); // Clear existing forms before initializing new ones

    produits.forEach(produit => {
      const produitFormGroup = this.createProduitFormGroup(produit);
      this.produitsForms.push(produitFormGroup);
    });
  }
  
  createProduitFormGroup(produit: NewProduitDemandee): FormGroup {
    return this.fb.group({
      nom: [produit.nom, Validators.required],
      description: [produit.description, Validators.required],
      quantite: [produit.quantite, [Validators.required, Validators.min(1)]],
      fournisseur: [null, Validators.required] // Ajout du champ fournisseur
    });
  }
  Confirmation(evt) {
    const formData = this.demandeF.value;
    formData['decision'] = evt.decision.trim();
    formData['wfCurrentComment'] = evt.wfCurrentComment;
    console.log("this.demanade CONFIRMATION", formData);

    this.demandeAchatService.DemandeAchat_process_Submit(formData).subscribe(
      data => {
        this.toastr.success(" added successfully", "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr
        });

        this.saveDemandeDevis();
        this.router.navigate(['DemandeDevis/allDemandesDevis']);
      },
      error => {
        this.toastr.error("failed to add ", "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr
        });
        console.log("error", error);
      }
    );
  }

  Return() {
    this.add.emit(false);
    this.router.navigate(['DemandeAchat/allDemandes']);
  }

  saveDemandeDevis(): void {
    const demandeDevis: IDemandeDevis = {
      id: null,
      nom: this.demandeForm.value.produits[0].nom, // assuming the form array has at least one product
      description: this.demandeForm.value.produits[0].description,
      quantite: this.demandeForm.value.produits[0].quantite,
      demandeAchatId:+this.route.snapshot.paramMap.get('id'),
      fournisseurId: this.demandeForm.value.produits[0].fournisseur
    };

    this.demandeDevisService.saveDemandeDevis(demandeDevis).subscribe(
      savedDemandeDevis => {
        console.log('Demande de devis sauvegardée avec succès :', savedDemandeDevis);
      },
      error => {
        console.error('Erreur lors de la sauvegarde de la demande de devis :', error);
      }
    );
  }
  saveAllDemandeDevis(): void {
    this.demandeDevisService.saveAll(this.demandesDevis).subscribe(
      savedDemandeDevis => {
        console.log('Demande de devis sauvegardée avec succès :', savedDemandeDevis);
      },
      error => {
        console.error('Erreur lors de la sauvegarde de la demande de devis :', error);
      }
    );
  }

  get produitsForms() {
    return this.demandeForm.get('produits') as FormArray;
  }

  popupViewerVisible: any = false;
  showPopupWF() {
    this.popupViewerVisible = true;
  }

  popupHeight = window.innerHeight - 50;
  popupWidth = window.innerWidth - window.innerWidth / 3;
}
