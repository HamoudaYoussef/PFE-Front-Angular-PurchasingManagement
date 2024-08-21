import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {Location} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {EnvService} from "../../../../../env.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-workflow-decision',
    templateUrl: './workflow-decision.component.html',
    styleUrls: ['./workflow-decision.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WorkflowDecisionComponent implements OnInit, OnChanges {
    @Output() decisionEvent = new EventEmitter<any>();
    @Output() saveEvent = new EventEmitter<any>();
    @Output() RetournEvent = new EventEmitter<any>();

    @Input() object: any;
    @Input() SaveObject: any;
    @Input() showButton: Boolean = true

    @Input() decisions: any[] = [];

    @Input() access: any = true;
    @Input() type: any = true;
    @Input() showInmodal: any = false;
    @Input() disabled: any = false;
    @Input() haveanalert: any = false;
    clicked: Boolean = false
    languageAcual
    AllPartieDemandresse



    constructor(public location: Location, private toastr: ToastrService, private env: EnvService, private translateService: TranslateService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.languageAcual = this.translateService.currentLang
        this.clicked = this.disabled;


        //console.log("haveanalert :::> ", this.haveanalert);

    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    onClickDecision(object, decision, commentaire) {

        if (!this.haveanalert || (this.haveanalert && decision)) {
            this.clicked = true
            object['decision'] = decision;
            object['commentaire'] = commentaire;
            this.decisionEvent.emit(object);
            this.clicked = false
        } else {

            this.toastr.error("Vérifier listes des dossiers", "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })

        }


    }


    Return() {
        this.RetournEvent.emit("retourn")
    }

    ConvertirDateFromStringToZoneDateTime() {
        var currentDate = new Date();

        var isoString = currentDate.toISOString();
        this.SaveObject.value.projectDepositDate = isoString
    }

    // Save() {
    //     this.ConvertirDateFromStringToZoneDateTime()
    //     if (this.SaveObject.value.categorieName != undefined) {
    //         this.SaveObject.value.categorieName = this.SaveObject.value.categorieName.categorieName
    //         this.SaveObject.value.categorieId = this.SaveObject.value.categorieName.id
    //     }
    //
    //     this.SaveObject.value.type = this.type
    //     if (this.route.snapshot.params['id'] != undefined) {
    //         this.SaveObject.value.id = this.object.id
    //         this.ConsultativeService.UpdateSaveDemandeAffaire(this.route.snapshot.params['id'], this.SaveObject.value).subscribe(reclamations => {
    //
    //
    //             this.translateService.get("تم تسجيل اخر التحديثات").subscribe((res) => {
    //                 this.toastr.success(res, "", {
    //                     closeButton: true,
    //                     positionClass: 'toast-top-right',
    //                     extendedTimeOut: this.env.extendedTimeOutToastr,
    //                     progressBar: true,
    //                     disableTimeOut: false,
    //                     timeOut: this.env.timeOutToastr
    //                 })
    //             })
    //
    //             this.router.navigate(['AffaireConsultative/AllDemandeAffaire'])
    //
    //         }, error => {
    //             this.toastr.error("خطأ اثناء تسجيل البيات   ", error.error.title, {
    //                 closeButton: true,
    //                 positionClass: 'toast-top-right',
    //                 extendedTimeOut: this.env.extendedTimeOutToastr,
    //                 progressBar: true,
    //                 disableTimeOut: false,
    //                 timeOut: this.env.timeOutToastr
    //             })
    //
    //
    //         })
    //     }
    // }

    Save(){
        this.saveEvent.emit("save")
    }


}


