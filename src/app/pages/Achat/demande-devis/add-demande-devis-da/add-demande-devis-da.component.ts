import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDemandeAchat } from 'src/app/Models/demande-achat.model';
import { IDemandeDevis, NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { NewFournisseur } from 'src/app/Models/fournisseur.model';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { DevisDaSharedService } from 'src/app/Service/devis-da-shared.service';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-add-demande-devis-da',
  templateUrl: './add-demande-devis-da.component.html',
  styleUrls: ['./add-demande-devis-da.component.scss']
})
export class AddDemandeDevisDaComponent implements OnInit {
  demandeAchatObject: any = {};
  demandeAchat: IDemandeAchat;
  selectedData: NewProduitDemandee[];
  formGroup: FormGroup;
  fournisseurs: NewFournisseur[]; // Liste des fournisseurs
  demandeForm: any;
  @Output() add = new EventEmitter<boolean>();
  decissionWF: any;
  objectData:any;
  valider : boolean=false;

  demandeF= new FormGroup({
    id: new FormControl(''),
    description: new FormControl(''),
    datebesoin: new FormControl(''),
    statut: new FormControl(''),
    datedemande: new FormControl(''),

  });
  demandeDevis!: NewDemandeDevis;

  @Output() RetournEvent = new EventEmitter<any>();

  constructor(private DevisSharedService: DevisDaSharedService, private fournisseurService:FournisseurService,
    private fb: FormBuilder,
    private demandeDevisService: DemandeDevisService,
    private produitDemandeeService: ProduitDemandeeService,
    public demandeAchatService: DemandeAchatService,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private env: EnvService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.selectedData = this.DevisSharedService.getSelectedData();
    console.log('Received selected data:', this.selectedData);

    this.formGroup = new FormGroup({
      formArray: new FormArray(this.selectedData.map(data => this.createFormGroup(data)))
    });
    this.fournisseurService.getFournisseurs().subscribe(
      (data: any[]) => {
        this.fournisseurs = data; // Sauvegarde des fournisseurs dans une variable du composant
      },
      error => {
        console.error('Error fetching fournisseurs:', error);
        // Gestion de l'erreur (ex: affichage d'un message à l'utilisateur)
      }
    );
  }


  get formArray(): FormArray {
    return this.formGroup.get('formArray') as FormArray;
  }

  createFormGroup(data: NewProduitDemandee): FormGroup {
    return new FormGroup({
      nom: new FormControl(data.nom, Validators.required),
      description: new FormControl(data.description, Validators.required),
      quantite: new FormControl(data.quantite, [Validators.required, Validators.min(1)]),
      fournisseur: new FormControl('', Validators.required) // Initialiser avec une valeur vide
    });
  }

  Confirmation(evt) {
    const formData = this.demandeF.value;
    formData['decision'] = evt.decision.trim();
    formData['wfCurrentComment'] = evt.wfCurrentComment;
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
 this.saveDemandeDevis();

      // Redirection vers la liste des demandes
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
    // this.closepopupMeeting();
  }
  Return() {
    this.add.emit(false)
    this.router.navigate(['/DemandeDevis/allDemandesDevis']);
  }
  saveDemandeDevis(): void {
    this.demandeDevisService.saveDemandeDevis(this.demandeDevis).subscribe(
      savedDemandeDevis => {
        console.log('Demande de devis sauvegardée avec succès :', savedDemandeDevis);
      },
      error => {
        console.error('Erreur lors de la sauvegarde de la demande de devis :', error);
      }
    );
  }


  
}
