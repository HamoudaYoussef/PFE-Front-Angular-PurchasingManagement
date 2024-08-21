## COMPSANT CONFIG PSTK

# Version 1.1.1



![img.png](img.png)


Input
      
[//]: # (to open popup)

    @Input() popupSetingPSTK = false
  

   

Output

      /*Send data  */
        @Output() submitEvent = new EventEmitter<any>();

[//]: # (to send data of info of pstk)
        @Output() pstkInfoEvent = new EventEmitter<any>(); 
[//]: # (to send data if pstk enabled)

        @Output() pstkEnabledEvent = new EventEmitter<any>();
[//]: # (to send data of closin pstk popup)

        @Output() closepopupSetingPSTK = new EventEmitter<any>();

Exemple d'appel :  
*dans html parent
[//]: # (ajouter ca dans header)

          <!--Config PSTK component -->
                <i class="fas fa-exclamation-triangle" aria-hidden="true"
                   style="    filter: drop-shadow(2px 0px 2px  #f34235) ;color:white; font-size: 16px;margin: 2px;"
                   title="{{this.pstkInfo}} "
                   *ngIf="this.pstkEnabled() === true && this.PstkRunning()=== false && this.submmited==true "></i>
                <i class="fas fa-gem" aria-hidden="true"
                   style="    filter:drop-shadow(0px 0px 0.2px #890a0a); color: grey;font-size: 16px;margin: 2px;cursor: pointer !important;"
                   (click)="showpupupconfigpstk()" title="{{'ATTACHEMENT.pstkNotRun' | translate}}"
                   *ngIf="this.pstkEnabled() === false || this.submmited==false"></i>
                <i class="fas fa-gem" aria-hidden="true"
                   style="    filter: drop-shadow(0px 0px 0.2px #890a0a); color: #1a9580;font-size: 16px;margin: 2px; cursor: pointer !important;"
                   (click)="showpupupconfigpstk()" title="{{this.pstkInfo}}"
                   *ngIf="this.pstkEnabled() === true && this.submmited==true"></i>
                <!--Config PSTK component -->



[//]: # (ca c'est l'appel)

                <app-config-pstk [popupSetingPSTK]="popupSetingPSTK"
                (submitEvent)="submitEvent($event)"
                (pstkInfoEvent)="pstkInfoEvent($event)"
                (closepopupSetingPSTK)="closepopupSetingPSTK($event)"
                #configPstkComponent
                ></app-config-pstk>
*dans ts parent

    /*Config PSTK component*/
    popupSetingPSTK = false
    submmited = false
    pstkInfo
    pstkEnable
    PstkisRunning
    @ViewChild(ConfigPstkComponent) private configPstkComponent: ConfigPstkComponent;

    /*Config PSTK component*/


     /*Config PSTK component*/

    showpupupconfigpstk() {
        this.popupSetingPSTK = true
    }

    submitEvent(e) {
        this.submmited = e
    }

    pstkInfoEvent(e) {
        this.pstkInfo = e
    }

    closepopupSetingPSTK(e) {
        this.popupSetingPSTK = e
    }

    pstkEnabled() {
        if (this.configPstkComponent != undefined)
            return this.configPstkComponent.pstkEnabled()
        else return this.pstkEnable

    }

    PstkRunning() {
        if (this.configPstkComponent != undefined)
            return this.configPstkComponent.PstkRunning()
        else return this.PstkisRunning
    }
    ngAfterViewInit() {
        this.configPstkComponent.ngOnInit()

        this.pstkEnable = this.configPstkComponent.pstkEnabled()
        this.PstkisRunning = this.configPstkComponent.PstkRunning()
 
    }
    /*Config PSTK component*/
