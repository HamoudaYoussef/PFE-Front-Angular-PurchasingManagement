import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { format } from 'date-fns';
import { IDemandeAchat } from 'src/app/Models/demande-achat.model';
import { IDemandeDevis, NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { NewFournisseur } from 'src/app/Models/fournisseur.model';
import { IProduitDemandee, NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { NewProduit } from 'src/app/Models/produit.model';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { DevisDaSharedService } from 'src/app/Service/devis-da-shared.service';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { EnvService } from 'src/env.service';
import { IProduitCommandee } from 'src/app/Models/produit-commandee.model';

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
  produitDemandee: NewProduit;
  fournisseurs: NewFournisseur[]; // Liste des fournisseurs
  demandeForm: any;
  @Output() add = new EventEmitter<boolean>();
  decissionWF: any;
  objectData: any;
  valider: boolean = false;
  currentDate: string;

  demandeF = new FormGroup({
    id: new FormControl(''),
    description: new FormControl(''),
    datebesoin: new FormControl(''),
    statut: new FormControl(''),
    datedemande: new FormControl(''),
  });

  demandeDevis!: NewDemandeDevis;

  @Output() RetournEvent = new EventEmitter<any>();

  constructor(
    private DevisSharedService: DevisDaSharedService,
    private fournisseurService: FournisseurService,
    private demandeDevisService: DemandeDevisService,
    public demandeAchatService: DemandeAchatService,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.selectedData = this.DevisSharedService.getSelectedData();
    console.log('Received selected data:', this.selectedData);
  


    this.formGroup = new FormGroup({
      formArray: new FormArray(this.selectedData.map(data => this.createFormGroup(data)))
    });

    this.fournisseurService.getFournisseursSimple().subscribe(
      (data: any[]) => {
        this.fournisseurs = data; // Sauvegarde des fournisseurs dans une variable du composant
      },
      error => {
        console.error('Error fetching fournisseurs:', error);
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
    });
  }
  demandeDevisForm = this.fb.group({
    nom: ['', Validators.required],
    description: ['', Validators.required],
    fournisseur: ['', Validators.required]
  });

  Return() {
    this.add.emit(false);
    this.router.navigate(['/DemandeDevis/allDemandesDevis']);
  }

  saveDemandeDevis(): void {
    const formArray = this.formArray;
    // Vérifiez si le tableau de formulaires est vide
    if (formArray.length === 0) {
      this.toastr.error('Aucun produit à sauvegarder');
      return;
    }
  
    // Vérification de la validité du formulaire global
    if (!this.formGroup.valid) {
      this.toastr.error('Un ou plusieurs formulaires sont invalides');
      return;
    }
  
    // Récupérer les produits demandés depuis le formulaire
   /* const produitCommandee: IProduitCommandee[] = formArray.controls
      .map((productFormGroup: FormGroup) => ({
        id: null,
        nom: productFormGroup.get('nom')?.value,
        description: productFormGroup.get('description')?.value,
        quantite: productFormGroup.get('quantite')?.value,
        fournisseurId: productFormGroup.get('fournisseur')?.value ,// Associer le fournisseur
        demandeAchatId: null,
        img:null,

      })*/
   // );
      const fournisseurId = parseInt(this.demandeDevisForm.get('fournisseur')?.value, 10);

      // Assurez-vous que la conversion a réussi
      if (isNaN(fournisseurId)) {
        this.toastr.error('Fournisseur sélectionné est invalide.');
        return;
      }
      this.currentDate = format(new Date(), 'dd/MM/yyyy HH:mm:ss');

  
    // Créer la demande de devis
    /*const demandeDevis: IDemandeDevis = {
      id: null,
      nom: this.demandeDevisForm.get('nom')?.value,
    description: this.demandeDevisForm.get('description')?.value,
    quantite: null,
    datedemande: null,
    produitDemandees: produitsDemandees,
    fournisseurId: fournisseurId,
    demandeAchatId: null // Associer le fournisseur

    };*/
  
    // Soumettre la demande de devis
  /*  this.demandeDevisService.saveDemandeDevisWithout(demandeDevis).subscribe(
      savedDemandeDevis => {
        this.toastr.success('Demande de devis sauvegardée avec succès');
        console.log('Demande de devis sauvegardée avec succès :', savedDemandeDevis);
        this.Return(); // Rediriger après la sauvegarde
      },
      error => {
        console.error('Erreur lors de la sauvegarde de la demande de devis :', error);
        this.toastr.error('Erreur lors de la sauvegarde de la demande de devis');
      }
    );*/
  }
  
  
  
  
  
  
}
