import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InfoPaiement } from 'src/app/Models/enumerations/info-paiement.model';
import { TypeLivraison } from 'src/app/Models/enumerations/type-livraison.model';
import { NewOffre } from 'src/app/Models/offre.model';
import { BonCommandeService } from 'src/app/Service/bon-commande.service';
import { OffreService } from 'src/app/Service/offre.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-add-bon-commande',
  templateUrl: './add-bon-commande.component.html',
  styleUrls: ['./add-bon-commande.component.scss']
})
export class AddBonCommandeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private bonCommandeService: BonCommandeService,
    private offreService: OffreService, private toastr: ToastrService, private env: EnvService,private router:Router) { }
    @Output() add = new EventEmitter<boolean>();

    offre:NewOffre;
  demandeForm: any = {}; 
  objectData:any;
  decissionWF: any; 
  envoyer:boolean;
  demandeF: FormGroup;
  referenceOffre: string;
  typeLivraisonEnum = TypeLivraison;
  typeLivraisonOptions: string[];
  infoPaiementEnum = InfoPaiement;
  infoPaiementOptions: string[];


  // Initialisez ou obtenez cet objet d'une source appropriée

  // Initialisez ou obtenez cet objet d'une source appropriée

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
     
    this.demandeF= new FormGroup({
      id: new FormControl(''),
      reference: new FormControl(''),
      nomentreprise: new FormControl(''),
      adresseentreprise: new FormControl(''),
      referenceoffre: new FormControl(''),
      prix: new FormControl(null),
      delailivraison: new FormControl(null),
      typelivraison: new FormControl(''),
      fraislivraison: new FormControl(null),
      taxes: new FormControl(null),
      montanttotal: new FormControl(null),
      infopaiement: new FormControl('')
    });
      this.bonCommandeService.getBonCommandetById(id).subscribe(bonCommande => {
        this.objectData = bonCommande;
        console.log("Fetched Successfully :", bonCommande);
        
        
        this.demandeF.patchValue(bonCommande);
        this.bonCommandeService.getReferenceOffre(id).subscribe(
          (referenceOffre) => {
            this.demandeF.patchValue({
              referenceoffre: referenceOffre
            });
            console.log('Référence de l\'offre récupérée :', referenceOffre);
          },
          (error) => {
            console.error('Erreur lors de la récupération de la référence de l\'offre :', error);
          }
        );
        this.bonCommandeService.getPrixByBonCommandeId(id).subscribe(
          (prix) => {
            this.demandeF.patchValue({
              prix: prix
            });
            console.log('prix de l\'offre récupérée :', prix);
          },
          (error) => {
            console.error('Erreur lors de la récupération de la référence de l\'offre :', error);
          }
        );

        this.decissionWF = bonCommande.workflow && bonCommande.workflow.decisionsWF ? bonCommande.workflow.decisionsWF : null;
        this.envoyer = this.decissionWF === "envoyer";

        this.typeLivraisonOptions = Object.values(this.typeLivraisonEnum);
        this.infoPaiementOptions = Object.values(InfoPaiement) as string[];



      });
      // Use the offer ID for other initialization as needed
  }
  loadOffreDetails(offreId: number): void {
    this.offreService.getOffre(offreId).subscribe(offre => {
      this.offre = offre;
      console.log('Offre récupérée :', offre);

      // Faire quelque chose avec les détails de l'offre si nécessaire
    });
  }
  Confirmation(evt) {
    const formData = this.demandeF.value;
    formData['decision'] = evt.decision.trim();
    formData['wfCurrentComment'] = evt.wfCurrentComment;
    console.log("this.demanade CONFIRMATION", formData);

    this.bonCommandeService.BonCommande_process_Submit(formData).subscribe(data => {
      this.toastr.success(" added successfully", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      });

      // Appel de onAddPRD avec l'ID de la demande d'achat après soumission réussie
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
    this.router.navigate(['DemandeAchat/allDemandes']);
  }
  
  popupViewerVisible: any = false;
  showPopupWF() {
    this.popupViewerVisible = true;
  }
  popupHeight = window.innerHeight-50;
  popupWidth = window.innerWidth - window.innerWidth / 3;

}
