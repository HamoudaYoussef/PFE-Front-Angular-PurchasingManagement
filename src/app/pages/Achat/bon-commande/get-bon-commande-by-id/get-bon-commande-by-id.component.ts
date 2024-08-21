import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BonCommandeService } from 'src/app/Service/bon-commande.service';
import { IBonCommande, NewBonCommande } from '../../../../Models/bon-commande.model';
import { StatutBonCommande } from 'src/app/Models/enumerations/statut-bc.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-get-bon-commande-by-id',
  templateUrl: './get-bon-commande-by-id.component.html',
  styleUrls: ['./get-bon-commande-by-id.component.scss']
})
export class GetBonCommandeByIdComponent implements OnInit {

  constructor(private route: ActivatedRoute,private bonCommandeService:BonCommandeService,
     private toastr: ToastrService, private env: EnvService,private router:Router) { }

  @Output() add = new EventEmitter<boolean>();

  bcForm: any = {}; 
  objectData:any;
  decissionWF: any; 
  envoyer:boolean;
  demandeForm: any = {};  // Initialisez ou obtenez cet objet d'une source appropriée
  bcadd: any;
  idoffre=  +this.route.snapshot.paramMap.get('id');
  bcObject: any = {};  // Initialisez ou obtenez cet objet d'une source appropriée
  bonCommande: IBonCommande;


  demandeF= new FormGroup({
    id: new FormControl(this.route.snapshot.paramMap.get('id')),
  });

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.bonCommandeService.getBonCommandetById(id).toPromise().then(
      data => {
      this.bcObject = data
      console.log("this.demandeAchatObject : {}", this.bcObject)

      this.bonCommande = data;
      this.objectData=data
            
            console.log("Fetched Successfully :", data);
            this.decissionWF = data.workflow && data.workflow.decisionsWF ? data.workflow.decisionsWF : null;

            console.log("DECICIONS WK ::: "+ this.decissionWF);
          
            this.decissionWF = data['workflow']['decisionsWF'];
            if(this.decissionWF=="pour validation"){
              this.envoyer=true;
              console.log("envoyer",this.envoyer)
            }else {
              this.envoyer=false;
            }
          },
          error => {
            console.log("Error :", error);
          });
  }

  Confirmation(evt) {
    const formData = this.demandeF.value;
    formData['decision'] = evt.decision.trim();
    formData['wfCurrentComment'] = evt.wfCurrentComment;
    console.log("this.demanade CONFIRMATION", formData);
  
    if (evt.decision.trim()  === 'valider') {
      this.validerDemande(evt);
    } else if (evt.decision.trim()  === 'envoyer') {
      this.envoyerDemande(evt);
    }
  }

validerDemande(evt) {
  const nouveauStatut: StatutBonCommande = StatutBonCommande.VALIDE;
  const id = +this.route.snapshot.paramMap.get('id');
  const formData = this.demandeF.value;
  formData['decision'] = evt.decision.trim();
  formData['wfCurrentComment'] = evt.wfCurrentComment;
  console.log("this.demanade CONFIRMATION", formData);
  // Mettre à jour le statut
  this.bonCommandeService.updateStatutBC(id, nouveauStatut).subscribe(
    statutData => {
      console.log("Statut mis à jour avec succès");

      // Valider la demande après la mise à jour du statut
      this.bonCommandeService.BonCommande_process_Submit(formData).subscribe(
        data => {
          this.toastr.success("Demande validée avec succès", "", {
            closeButton: true,
            positionClass: 'toast-top-right',
            extendedTimeOut: this.env.extendedTimeOutToastr,
            progressBar: true,
            disableTimeOut: false,
            timeOut: this.env.timeOutToastr
          });
          // Rediriger vers la liste des demandes
       //   this.router.navigate(['DemandeAchat/allDemandes']);
        },
        error => {
          this.toastr.error("Échec de la validation", "", {
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
    },
    error => {
      this.toastr.error("Échec de la mise à jour du statut", "", {
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

envoyerDemande(evt) {
    // Logique spécifique pour l'envoi
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
