import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DxDataGridComponent, DxFormComponent} from 'devextreme-angular';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AttachementModuleService} from '../attachement.module.service';
import {ToastrService} from 'ngx-toastr';
import {EnvService} from 'src/env.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpParamMethodPost} from '../../ps-tools/class';
import {FormatDate} from '../../shared-service/formatDate';
import {HttpServicesComponent} from '../../ps-tools/http-services/http-services.component';
import {Export} from '../../shared-service/export';
import {CommunFuncService} from '../Commun/commun-func.service';
import {TokenStorageService} from '../../shared-service/token-storage.service';

@Component({
    selector: 'app-template-attachment',
    templateUrl: './template-attachment.component.html',
    styleUrls: ['./template-attachment.component.scss']
})
export class TemplateAttachmentComponent implements OnInit {
    packageName = require('package.json').name
    //All variables
    formatDate = new FormatDate(this.env);
    loadingVisible: any = false;
    maxUploadMultiPartFile = this.env.maxUploadMultiPartFile;
    @ViewChild(DxFormComponent, {static: false}) form: DxFormComponent;/*To access to the card formulaire input */
    @ViewChild('gridofficeTempalte', {static: false}) gridofficeTempalte: DxDataGridComponent;
    //___________________________________________________________________All compoment input__________________________________________________________________________
    @Input() classid: any;/*Id  of class metier*/
    @Input() objectid: any;/*Id of object metier*/
    @Input() attachements: any[] = [];/*lists attachements of object in the objet metier*/
    @Input() objectData;/*objet metier*/
    @Input() fileTemplate;/*request file definition ex : Doc, CIN*/
    @Input() isPublic: any;/* to mention public objet metier : like jrxmltemplate*/
    @Input() showButton = false/* to disable/enable button of attachement widget*/
    @Input('readOnly') readOnly = false
    @Input() fileAccessToken;/*access token to acces to webs services of attchements */
    //___________________________________________________________________All compoment output__________________________________________________________________________
    @Output() newFile = new EventEmitter();/*to emit event of save new attachement and catch this event */
    pstkEnabledAndRunning = false;/*state of pstk capted in application and display avtetissment of pstk in the pdf viewer*/
    avertismentPopUp = false;/* avertissement if pdf is saved signed */
    jsondocviewer = {pdfSrcc: "", visionneuse: "url",};/*objet use to preview attachement in the viewer*/
    base64: any;/*FILE to base BASE64*/
    pgNbr: any;/*page number of PDF file*/
    fileName;/*FILE NAME*/
    fileContent = null;/*FILE CONTENT fron disq file--> File object in angular*/  /*to append it to  "multipartFiles"*/
    blobFile;/*FILE CONTENT fron scanned file--> Blob object in angular*/
    fileType;/*FILE TYPE*/
    sizeInput;/*file size*/
    lockedValue = false;/*LOCKED INITAL*/
    popupDeleteFileVisible = false;/*POPUP DELETE FILE */
    showViewerModal = false;/*VIEWER POPUP VISIBLE*/
    permissionToScanAction;/*permission FILETO SCAN ACTION PERMISSION*/
    permissionToSigAction;/*permision FOR SIGNATURE ACTION*/
    permissionToTopViewer = true;/*PERMISSION FOR Top Viewer */
    saveFromScanner = false;/*to detect SAVE FROM SCANNER OR NOT */
    /*Module PSTK*/
    ModuleScan = require('../ModulePSTK.json').Module_Scan;
    ModuleSign = require('../ModulePSTK.json').Module_Sign;
    ModuleOffice = require('../ModulePSTK.json').Module_Office;
    ModuleMisc = require('../ModulePSTK.json').Module_Misc;
    /*Style of each card*/
    backgroundColor;/*CARD COLOR*/
    /*Module PSTK*/
    boxShadow;/*CARD SHADOW*/
    /*FORM VALIDATOR*/
    editorOptionsIdentificateur;
    /*Style of each card*/
    editorOptionsDateEmission;
    editorOptionsDateExpiration;
    editorOptionsName;
    editorOptionsNameButtonFalse
    /*doc id validator*/
    namePattern = false;
    /*FORM VALIDATOR*/
    massageExpressionRegulier = "";
    validFilename = "^[^<>:;,?\"'*|\\\\\\/]+$";/*reg expresion*/
    validFileMsg;
    /*doc id validator*/
    requiredFile = "";/*to detect is file required*/
    maxCopies = 1;/*init max copie*/
    minCopies = 1;/*init min copie*/
    dateSystem = new Date();/*date limit max of date emission*/
    label;/*label of each card*/
    labelEditable;/*label editable or not*/
    minDateExpiration;/*date limit min of date emission*/
    /*format displayed of date emmision/expiration*/
    FormatDisplayDate: any;
    FormatDisplayDateExpiration: any;
    //to display or not same field of widget
    hasIssueDate;
    /*format displayed of date emmision/expiration*/
    hasExpirationDate;
    hasIssueAdress;
    hasIdRegex;
    hasCopiesNbr;
    hasAddButton = true;
    hasScanButton = true;
    hasRattachButton = true;
    hasLockButton = true;
    hasModelOfficeButton = true;
    //to display or not same field of widget
    disableSave = false;/*disable save if file size are tooo large*/
    officeVisble = true;/*to enable/disable button of office template*/
    openOfficePopUp = false;/*to display office popup*/
    officeTemplateList = [];/*data source of office template*/
    Ref = {value: ''};/*refrence to display it in the toaster*/
    nameFocus;
    pdfMimeType = "application/pdf"/*pdf mime type*/
    @ViewChild(HttpServicesComponent, {static: true}) private httpServicesComponent: HttpServicesComponent
    @Input() authorizationTokenScan = false;
    // @Input() authorizationTokenSign = false;
    @Input() listOfficeNotEmpty = false;

    //All variables
    RefUserName

    constructor(private cookieService: CookieService, private communService: CommunFuncService, private toastr: ToastrService, private env: EnvService, private fileservice: AttachementModuleService, private translateService: TranslateService, private tokenService: TokenStorageService, private router: Router, private route: ActivatedRoute) {
        if (this.cookieService.get('displayname')) {
            this.RefUserName = {displayName: this.cookieService.get('displayname')};
        } else {
            this.RefUserName = {displayName: 'utilisateur'};
        }        //init some card field
        this.editorOptionsDateEmission = {
            max: this.dateSystem,
            readOnly: this.readOnly,
            onValueChanged: this.changeDateEmission.bind(this),
            displayFormat: this.FormatDisplayDate,
        }
        this.editorOptionsDateExpiration = {
            min: this.minDateExpiration,
            readOnly: this.readOnly,
            onValueChanged: this.changeDateExpiration.bind(this),
            displayFormat: this.FormatDisplayDateExpiration,
        }
        //translate validFileMsg
        this.translateService.get('ATTACHEMENT.validFileMsg').subscribe((res) => {
            this.validFileMsg = res;
        });
        //init pstk
        this.pstkEnabledAndRunning = this.cookieService.get("envPstkRunning") === 'true' && this.cookieService.get("PstkEnabled") === 'true'

    }

    ngOnInit(): void {

        //init style of file card
        if (this.objectData) {
            if (this.objectData.mandatoryTemplateFileName) {
                if (this.objectData.mandatoryTemplateFileName.includes(',')) {
                    let listmandotory = this.objectData.mandatoryTemplateFileName.split(',')
                    listmandotory.forEach(i => {
                        if (this.fileTemplate.name == i) {
                            this.backgroundColor = "#edc1c1;"
                            this.boxShadow = "0 2px 5px #f305056b, 0 2px 10px #0000001f !important;"
                        }
                    })
                } else {
                    if (this.fileTemplate.name == this.objectData.mandatoryTemplateFileName) {
                        this.backgroundColor = "#edc1c1;"
                        this.boxShadow = "0 2px 5px #f305056b, 0 2px 10px #0000001f !important;"
                    }
                }
            }
            if (this.objectData.optionalTemplateFileName) {
                if (this.objectData.optionalTemplateFileName.includes(',')) {
                    let listoptional = this.objectData.optionalTemplateFileName.split(',')
                    listoptional.forEach(i => {
                        if (this.fileTemplate.name == i) {
                            this.backgroundColor = "rgb(151 227 146 / 70%);";
                            this.boxShadow = "#b6ebb2 0px 2px 5px, rgb(0 0 0 / 12%) 0px 2px 10px !important;"
                        }
                    })
                } else {
                    if (this.fileTemplate.name == this.objectData.optionalTemplateFileName) {
                        this.backgroundColor = "rgb(151 227 146 / 70%);";
                        this.boxShadow = "#b6ebb2 0px 2px 5px, rgb(0 0 0 / 12%) 0px 2px 10px !important;"
                    }
                }
            }
            if (this.objectData.defaultTemplateFileName) {
                (this.objectData.defaultTemplateFileName).forEach(i => {
                    if (this.fileTemplate.name == i) {
                        this.backgroundColor = "aliceblue;";
                        this.boxShadow = "aliceblue 0px 2px 5px, rgb(0 0 0 / 12%) 0px 2px 10px !important;"
                    }
                })
            }
        }
        if (this.fileTemplate && this.fileTemplate.description !== null && this.fileTemplate.description !== undefined && this.fileTemplate.description !== "" && this.fileTemplate.description !== {})
            this.massageExpressionRegulier += this.fileTemplate.description
    }

    ngAfterViewChecked() {
        //init fields of card input
        (this.fileTemplate && this.fileTemplate.fileRequired && this.fileTemplate.fileRequired == true) ? this.requiredFile = "required" : this.requiredFile = ""
        if (this.fileTemplate && this.fileTemplate.maxCopies && this.fileTemplate.maxCopies != null && this.fileTemplate.maxCopies != undefined && this.fileTemplate.maxCopies != 0)
            this.maxCopies = this.fileTemplate.maxCopies
        if (this.fileTemplate && this.fileTemplate.minCopies && this.fileTemplate.minCopies != null && this.fileTemplate.minCopies != undefined && this.fileTemplate.minCopies != 0)
            this.minCopies = this.fileTemplate.minCopies
        if (this.fileTemplate && this.fileTemplate.idRegex !== null && this.fileTemplate.idRegex !== undefined && this.fileTemplate.idRegex !== "" && this.fileTemplate.idRegex !== {})
            this.namePattern = true
        if (this.fileTemplate && this.fileTemplate.hasIssueDate !== null && this.fileTemplate.hasIssueDate !== undefined && this.fileTemplate.hasIssueDate !== "" && this.fileTemplate.hasIssueDate !== {})
            this.hasIssueDate = this.fileTemplate.hasIssueDate
        if (this.fileTemplate && this.fileTemplate.hasExpirationDate !== null && this.fileTemplate.hasExpirationDate !== undefined && this.fileTemplate.hasExpirationDate !== "" && this.fileTemplate.hasExpirationDate !== {})
            this.hasExpirationDate = this.fileTemplate.hasExpirationDate
        if (this.fileTemplate && this.fileTemplate.hasIssueAdress !== null && this.fileTemplate.hasIssueAdress !== undefined && this.fileTemplate.hasIssueAdress !== "" && this.fileTemplate.hasIssueAdress !== {})
            this.hasIssueAdress = this.fileTemplate.hasIssueAdress
        if (this.fileTemplate && this.fileTemplate.hasIdRegex !== null && this.fileTemplate.hasIdRegex !== undefined && this.fileTemplate.hasIdRegex !== "" && this.fileTemplate.hasIdRegex !== {})
            this.hasIdRegex = this.fileTemplate.hasIdRegex
        if (this.fileTemplate && this.fileTemplate.label !== null && this.fileTemplate.label !== undefined && this.fileTemplate.label !== "" && this.fileTemplate.label !== {})
            this.label = this.fileTemplate.label

        if (this.fileTemplate && this.fileTemplate.labelEditable !== null && this.fileTemplate.labelEditable !== undefined && this.fileTemplate.labelEditable !== "" && this.fileTemplate.labelEditable !== {})
            this.labelEditable = this.fileTemplate.labelEditable
        if (this.fileTemplate && this.fileTemplate.hasCopiesNbr !== null && this.fileTemplate.hasCopiesNbr !== undefined && this.fileTemplate.hasCopiesNbr !== "" && this.fileTemplate.hasCopiesNbr !== {})
            this.hasCopiesNbr = this.fileTemplate.hasCopiesNbr
        if (this.fileTemplate && this.fileTemplate.hasAddButton !== null && this.fileTemplate.hasAddButton !== undefined && this.fileTemplate.hasAddButton !== "" && this.fileTemplate.hasAddButton !== {})
            this.hasAddButton = this.fileTemplate.hasAddButton
        if (this.fileTemplate && this.fileTemplate.hasScanButton !== null && this.fileTemplate.hasScanButton !== undefined && this.fileTemplate.hasScanButton !== "" && this.fileTemplate.hasScanButton !== {})
            this.hasScanButton = this.fileTemplate.hasScanButton
        if (this.fileTemplate && this.fileTemplate.hasRattachButton !== null && this.fileTemplate.hasRattachButton !== undefined && this.fileTemplate.hasRattachButton !== "" && this.fileTemplate.hasRattachButton !== {})
            this.hasRattachButton = this.fileTemplate.hasRattachButton
        if (this.fileTemplate && this.fileTemplate.hasLockButton !== null && this.fileTemplate.hasLockButton !== undefined && this.fileTemplate.hasLockButton !== "" && this.fileTemplate.hasLockButton !== {})
            this.hasLockButton = this.fileTemplate.hasLockButton
        if (this.fileTemplate && this.fileTemplate.hasModelOfficeButton !== null && this.fileTemplate.hasModelOfficeButton !== undefined && this.fileTemplate.hasModelOfficeButton !== "" && this.fileTemplate.hasModelOfficeButton !== {})
            this.hasModelOfficeButton = this.fileTemplate.hasModelOfficeButton
        let newLabel = this.findInseredDocumentLabel(this.label, 1)
        this.editorOptionsName = {
            value: newLabel,
            readOnly: !this.labelEditable,
        }
        this.editorOptionsNameButtonFalse = {
            value: newLabel,
            readOnly: !this.labelEditable || this.readOnly
        }
        this.editorOptionsIdentificateur = {
            readOnly: this.readOnly,
        }
    }

    //return size of scren
    screen() {
        return 'sm';
    }

    //auto increment card labem
    findInseredDocumentLabel(label, index) {
        if (this.attachements && this.attachements.length > 0) {
            let inseredDocumentNbr = this.attachements.filter(x => (x.docTitle == label)).map(x => x).length
            if (inseredDocumentNbr != 1) {
                return label
            } else {
                const words = label.split(' ');
                label = words[0]
                let newLabel = label + ' ' + index
                index++
                return this.findInseredDocumentLabel(newLabel, index)
            }
        } else {
            return label
        }
    }


    /*FOR SCANNER */
    scanner_and_save() {
        this.loadingVisible = true;
        this.saveFromScanner = false;
        if ((this.cookieService.get('scannerName')) != 'null' && (this.cookieService.get('scannerName')) != ' ' && (this.cookieService.get('scannerName')) != '' && (this.cookieService.get('scannerName')) != 'undefined' &&
            (this.cookieService.get('scannerProfil')) != 'undefined' && (this.cookieService.get('scannerProfil')) != '' && (this.cookieService.get('scannerProfil') != ' ' && (this.cookieService.get('scannerProfil') != 'null'))) {

            let obj = new Object();
            if (this.classid != undefined) {
                obj.classId = this.classid;
            }

            if (this.objectid != undefined) {
                obj.objectId = this.objectid;
            }

            this.fileservice.getscan_preferencesByName(this.cookieService.get('scannerProfil')).subscribe(async (data: any) => {
                    let selectedprofile = await data

                    obj.preferenceName = (this.cookieService.get('scannerProfil'));

                    if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null) {
                        obj.objectData = JSON.stringify(this.objectData);
                    }
                    this.fileservice.pdfgetDefaultInfo(obj).subscribe(
                        async (res) => {
                            let authorizationtokenScan = await this.communService.authorizationToken(this.ModuleScan)
                            this.loadingVisible = false;

                            this.Scanner(this.cookieService.get('scannerName'), selectedprofile, 'new', res.title, authorizationtokenScan);
                            this.saveFromScanner = true;

                        }, error => {
                            this.loadingVisible = false;

                            this.saveFromScanner = false;
                            // console.error(error);
                        }
                    );
                }
            );

        } else {
            this.loadingVisible = false;

            this.translateService.get('ATTACHEMENT.Configscannernonvalide').subscribe((res) => {
                    this.toastr.error(res, '', {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    });
                }
            );
        }
    }

    displayErrorToasterOfMaxFileSize() {
        this.translateService.get("ATTACHEMENT.errorMaxSize").subscribe((res) => {
                this.toastr.error(res + this.communService.formatBytes(this.maxUploadMultiPartFile), "", {
                    closeButton: true,
                    positionClass: 'toast-top-right',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                })
            }
        )
    }

    Scanner(scannerName, scannerProfil, filename, title, authorizationToken) {
        this.loadingVisible = true;
        this.fileName = null
        let jsonScanPreference = (scannerProfil);
        let decision = true;
        try {
            this.fileservice.Scanner(
                authorizationToken,
                'Acquire',
                scannerName,
                jsonScanPreference.indicateur,
                jsonScanPreference.isPrevisualisation,
                jsonScanPreference.typedudocument.toLowerCase(),
                +jsonScanPreference.rectoverso,
                jsonScanPreference.resolution,
                jsonScanPreference.mode,
                jsonScanPreference.bitDepth,
                jsonScanPreference.formatpageDto.label,
                jsonScanPreference.discardBlankPage,
                filename,
                7,
                jsonScanPreference.showlankpagethreshold,
                title,
                jsonScanPreference.enableOcr
            ).then(async (res) => {
                    this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'
                    this.fileType = res.result.fileMimeType;
                    this.fileName = res.result.tmpFileName;
                    this.base64 = res.result.data;
                    this.pgNbr = res.result.pgNbr;
                    let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan)

                    this.permissionToScanAction = (this.fileType === this.pdfMimeType && this.pstkEnabledAndRunning && verifLicensePSTKScan);
                    this.permissionToTopViewer = (this.fileType === this.pdfMimeType);
                    const byteArray = new Uint8Array(atob(this.base64).split('').map(char => char.charCodeAt(0)));
                    this.fileContent = new File([byteArray], this.fileName, {type: this.fileType});
                    this.sizeInput = this.communService.formatBytes(byteArray.length);
                    let arraybuffer = this.communService.base64ToArrayBuffer(this.base64);/*prepare data to be append in the comming scan if use enable it*/
                    //verif max size
                    if (byteArray.length > this.maxUploadMultiPartFile)/*presq 1MO*/{
                        this.disableSave = true;
                        this.displayErrorToasterOfMaxFileSize();
                    } else {
                        this.disableSave = false;
                    }
                    this.loadingVisible = false;
                    if (decision) {
                        do {
                            this.translateService.get('ATTACHEMENT.chargepagescanner').subscribe(title => {
                                decision = window.confirm(title);
                            });
                            if (decision) {
                                this.Scanner(this.cookieService.get('scannerName'), scannerProfil, res.result.tmpFileName, title, authorizationToken);
                                break;
                            } else {
                                decision = false;
                                break;
                            }
                        }
                        while (decision);
                    }
                    if (!decision) {
                        decision = false;
                        this.fileName = res.result.tmpFileName;
                        this.blobFile = new Blob([arraybuffer], {type: this.fileType});
                        this.fileContent = new File([arraybuffer], this.fileName, {type: this.fileType});
                        /*Save Automatique aprés rattachement */
                        this.save();
                    }
                }, (err) => {
                    this.loadingVisible = false;
                    this.translateService.get("ATTACHEMENT.AquireFailed").subscribe(title => {
                        this.toastr.error(err.error.result.textError, title, {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                    })
                }
            );
        } catch (error) {
            this.translateService.get("ATTACHEMENT.Configscannernonvalide").subscribe((res) => {
                this.toastr.error(res, " ", {
                    closeButton: true,
                    positionClass: 'toast-top-right',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                })
            })
            this.loadingVisible = false
        }
    }

    /*DELETE FILE FROM CARD */
    deleteFile() {

        this.fileName = null
        this.fileContent = null
        this.popupDeleteFileVisible = false
        this.saveFromScanner = false;
        this.pgNbr = null
        this.sizeInput = null
        this.showsave = false
    }

    /*ON SELECTED FILE  CHANGE*/
    async viewFile() {
        if (this.fileType === "application/json" || this.fileType === "text/plain" || this.fileType === "image/jpeg" ||
            this.fileType === "image/png" || this.fileType === "image/gif" || this.fileType === "image/tiff" || this.fileType === "image/bmp" ||
            this.fileType === "image/svg+xml" || this.fileType === "application/pdf") {
            if (this.fileContent != null || this.blobFile != null) {
                this.loadingVisible = true;
                this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'
                let verifLicensePSTKSign: any = await this.communService.verifLicensePSTK(this.ModuleSign);

                this.permissionToSigAction = (this.fileType === this.pdfMimeType && this.pstkEnabledAndRunning && verifLicensePSTKSign)
                this.permissionToTopViewer = (this.fileType === this.pdfMimeType)
                var fileURL = URL.createObjectURL(this.blobFile);
                this.jsondocviewer.pdfSrcc = fileURL;
                this.jsondocviewer.visionneuse = "url";

                if (this.fileType === this.pdfMimeType) {
                    /*to check if pdf signed or not*/
                    let obj = new FormData()
                    if (this.fileContent != null && this.fileContent != undefined)
                        obj.append("multipartFiles", this.fileContent)
                    let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'IsSigned', obj)
                    this.Ref.value = this.fileName
                    this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.rattachement", "ATTACHEMENT.rattachmentEroor", false).then(data => {
                        if (data["statut"] == true)
                            this.avertismentPopUp = data["value"]
                    })
                    /*to check if pdf signed or not*/
                }


                let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan)

                this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'
                /*if pdf and pstk enabled get nbr pag pf pdf*/
                if (this.fileType === this.pdfMimeType && this.pstkEnabledAndRunning && verifLicensePSTKScan) {
                    let authorizationToken = await this.communService.authorizationToken(this.ModuleScan)

                    this.fileservice.getpageNbre(authorizationToken, this.base64).then(res => {
                        this.pgNbr = res.result.totalpage
                    }, err => {
                        console.error(err)
                    })
                }


                this.loadingVisible = false;
                this.showViewerModal = true;

            }
        } else {
            var fileURL = URL.createObjectURL(this.blobFile);

// create a link element
            var downloadLink = document.createElement("a");

// set the link's href to the object URL
            downloadLink.href = fileURL;

// set the link's download attribute to specify the filename
            downloadLink.download = this.fileName;

// simulate a click on the link to initiate the download
            downloadLink.click();
        }

    }

    /*VIEWER POPUP VISIBLE == close viewer File*/
    closeviewFile() {
        this.showViewerModal = false;
    }

    /*MAX DATE EMISSION*/
    changeDateEmission(e) {
        this.minDateExpiration = e.value
        this.FormatDisplayDate = this.formatDate.formatDFshortNEW(e.value)
        this.editorOptionsDateEmission = {
            max: this.dateSystem,
            readOnly: this.readOnly,
            displayFormat: this.FormatDisplayDate,
        }
    }

    /*MIN DATE EXPIRATION*/
    changeDateExpiration(e) {
        this.FormatDisplayDateExpiration = this.formatDate.formatDFshortNEW(e.value)
        this.editorOptionsDateExpiration = {
            min: this.minDateExpiration,
            readOnly: this.readOnly,
            displayFormat: this.FormatDisplayDateExpiration,
        }
    }

    showsave: boolean = false

    /*ATTACHED FILE FROM CARD INTERFACE*/
    attached() {
        document.getElementById("addfile" + this.fileTemplate.label).click();
    }

    /*lOCEKED FILE FROM CARD INTERFACE*/
    locked() {
        this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'
        this.lockedValue = !this.lockedValue
        this.permissionToScanAction = this.permissionToScanAction && this.pstkEnabledAndRunning && (this.lockedValue === false)
    }

    /*DETECTE AND CAPT FILE ADD FROM INTERFACE FRONT */
    async fileChange(input) {
        this.loadingVisible = true
        console.log("input.files[0]", input.files[0])
        this.fileContent = input.files[0]
        this.fileName = this.fileContent.name
        this.fileType = this.fileContent.type
        let fileSize = this.fileContent.size
        this.sizeInput = this.communService.formatBytes(fileSize)

        if (fileSize > this.maxUploadMultiPartFile)/*presq 1MO*/{
            this.disableSave = true
            this.displayErrorToasterOfMaxFileSize()
        } else {
            this.disableSave = false
            this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'
            let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan)

            this.permissionToScanAction = (this.fileType === this.pdfMimeType && this.pstkEnabledAndRunning && verifLicensePSTKScan)
            this.permissionToTopViewer = (this.fileType === this.pdfMimeType)

            this.avertismentPopUp = false
            // if (this.fileType === this.pdfMimeType) {
            //     /*to check if pdf signed or not*/
            //     let obj = new FormData()
            //     if (this.fileContent != null && this.fileContent != undefined)
            //         obj.append("multipartFiles", this.fileContent)
            //     let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel+'IsSigned', obj)
            //     this.Ref.value = this.fileName
            //     this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.rattachement", "ATTACHEMENT.rattachmentEroor", false).then(data => {
            //         if (data["statut"] == true)
            //             this.avertismentPopUp = data["value"]
            //     })
            //     /*to check if pdf signed or not*/
            // }


            this.fileContent.arrayBuffer().then(async (arrayBuffer) => {
                this.blobFile = new Blob([new Uint8Array(arrayBuffer)], {type: this.fileType});
                this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(arrayBuffer));
                /*if pdf and pstk enabled get nbr pag pf pdf*/
                // if (this.fileType === this.pdfMimeType && this.pstkEnabledAndRunning && this.authorizationTokenScan!=null) {
                //     let authorizationToken = await this.authorizationToken(this.ModuleScan)
                //
                //     this.fileservice.getpageNbre(authorizationToken, this.base64).then(res => {
                //         this.pgNbr = res.result.totalpage
                //     }, err => {
                //         console.error(err)
                //     })
                // }

            });
            this.loadingVisible = false
            this.showsave = true
            /*Save Automatique aprés rattachement */
            // this.save()
        }
    }

    creatingIcon(icon) {
        if (icon !== null && icon !== undefined && icon !== "" && icon !== {})
            return "fa " + icon
    }

    /******************* createAttachement *************/
    save() {
        this.loadingVisible = true
        if (this.form.instance.validate().isValid && !(this.fileContent == null && this.fileTemplate.fileRequired == true)) {
            let obj = new FormData()
            if (this.fileContent != null && this.fileContent != undefined)
                obj.append("multipartFiles", this.fileContent)
            else if (this.fileContent === null || this.fileContent === undefined) {
                this.translateService.get("ATTACHEMENT.fileEmpty", this.Ref).subscribe((res) => {
                    this.toastr.warning(res, "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                })
            }
            if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null)
                obj.append("objectData", JSON.stringify(this.objectData));
            if ((this.objectData) != undefined && (this.objectData) != null && (this.objectData).securiteLevel != null && (this.objectData).securiteLevel != undefined)
                obj.append("objectDatasecuriteLevel", (this.objectData).securiteLevel);
            if (this.saveFromScanner == true) {
                if ((this.cookieService.get('scannerProfil')) != undefined)
                    obj.append("preferenceName", (this.cookieService.get('scannerProfil')));
            }
            if (this.formatDate.formatDFshort(this.form.instance.option("formData").dateExpiration) != undefined && (this.fileTemplate.hasExpirationDate === 'MANDATORY' || this.fileTemplate.hasExpirationDate === 'OPTIONAL'))
                obj.append("docExpirationDate", this.formatDate.formatDshort(this.form.instance.option("formData").dateExpiration))
            if (this.formatDate.formatDFshort(this.form.instance.option("formData").dateEmission) != undefined && (this.fileTemplate.hasIssueDate === 'MANDATORY' || this.fileTemplate.hasIssueDate === 'OPTIONAL'))
                obj.append("docIssueDate", this.formatDate.formatDshort(this.form.instance.option("formData").dateEmission))
            if (this.form.instance.option("formData").lieuEmission != undefined && (this.fileTemplate.hasIssueAdress === 'MANDATORY' || this.fileTemplate.hasIssueAdress === 'OPTIONAL'))
                obj.append("issueAdress", this.form.instance.option("formData").lieuEmission)
            if (this.form.instance.option("formData").docId != undefined)
                obj.append("docId", this.form.instance.option("formData").docId)
            if (this.form.instance.option("formData").docCopies != undefined)
                obj.append("docCopies", this.form.instance.option("formData").docCopies)
            if (this.fileTemplate.name != undefined)
                obj.append("reqFileDefName", this.fileTemplate.name)
            if (this.form.instance.option("formData").docTitle != undefined)
                console.log("this.form.instance.option(\"formData\").docTitle", this.form.instance.option("formData").docTitle)
            obj.append("docTitle", this.form.instance.option("formData").docTitle)
            if (this.classid != undefined)
                obj.append("classId", this.classid)
            if (this.objectid != undefined)
                obj.append("objectId", this.objectid)
            if (this.isPublic != undefined)
                obj.append("Public", this.isPublic)
            obj.append("locked", JSON.stringify(this.lockedValue))
            this.Ref.value = this.form.instance.option("formData").docTitle
            let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'createAttachement' + "?fileAccessToken=" + this.fileAccessToken, obj)
            this.httpServicesComponent.method(paramsHttp, this.Ref).then(data => {
                if (data["statut"] == true)
                    this.newFile.emit(this.fileTemplate)
                this.loadingVisible = false
                this.showsave = false


            })
        } else if ((this.fileContent == null || this.fileContent == undefined) && this.fileTemplate.fileRequired == true) {
            this.loadingVisible = false
            this.Ref.value = this.form.instance.option("formData").docTitle
            this.translateService.get("ATTACHEMENT.fileRequired", this.Ref).subscribe((res) => {
                this.toastr.error(res, "", {
                    closeButton: true,
                    positionClass: 'toast-top-right',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                })
            })
        }

    }


    BASE64_Output_Save($event) {
        let arraybuffer = this.communService.base64ToArrayBuffer($event);
        this.blobFile = new Blob([new Uint8Array(arraybuffer)], {type: this.fileContent.type});
        this.base64 = $event


        this.translateService.get("ATTACHEMENT.recupere").subscribe((res) => {
            this.toastr.success(res, "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        })
        this.showViewerModal = false;

    }

    getBASE64_Output($event) {
        this.reloadViewer($event);
    }

    reloadViewer(base64) {
        let arraybuffer = this.communService.base64ToArrayBuffer(base64);
        this.blobFile = new Blob([new Uint8Array(arraybuffer)], {type: this.fileContent.type});
        this.fileContent = new File([arraybuffer], this.fileName, {type: this.fileContent.type});
        var fileURL = URL.createObjectURL(this.fileContent);
        this.jsondocviewer.pdfSrcc = fileURL;
        this.jsondocviewer.visionneuse = "url";
    }

    signedEvent(event) {
        let arraybuffer = this.communService.base64ToArrayBuffer(this.base64);
        this.blobFile = new Blob([new Uint8Array(arraybuffer)], {type: this.fileContent.type});
        this.fileContent = event
        var fileURL = URL.createObjectURL(this.fileContent);
        this.jsondocviewer.pdfSrcc = fileURL;
        this.jsondocviewer.visionneuse = "url";
    }

    /*enable office template button*/
    initofficeVisble() {
        this.officeVisble = !(this.objectid != null && this.classid != null)
        return this.officeVisble
    }

    /*Office template*/
    OfficeTemplatePopUpOpen() {
        let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'findOfficeTemplate', this.objectData)
        this.httpServicesComponent.method(paramsHttp, '', "ATTACHEMENT.OfficeTemplateSucces", "ATTACHEMENT.OfficeTemplateError", false).then(data => {
            if (data["statut"] == true) {
                this.officeTemplateList = data["value"]
                this.openOfficePopUp = true
            }
        })
    }

    exportGridToPDF() {
        Export.exportGridToPDF(this.gridofficeTempalte.instance)
    }

    refreshgrid() {
        this.gridofficeTempalte.instance.refresh()
        this.OfficeTemplatePopUpOpen()
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift(
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    icon: 'refresh',
                    onClick: this.refreshgrid.bind(this),
                }
            },
            {
                location: 'center',
                template: 'titreDataGrid'
            },
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    hint: 'reset',
                    icon: 'undo',
                    onClick: this.resetGrid.bind(this),
                }
            })
    }

    resetGrid() {
        localStorage.removeItem(this.packageName + '_' + 'gridofficeTempalte');
        window.location.reload();
    }

    officeTemplatrePopUpClose() {
        this.openOfficePopUp = false
    }


    async officeTemplateAttach(title, classid, objectid, objectData) {
        this.loadingVisible = true
        try {
            await this.fileservice.officeTemplateAttach(title, classid, objectid, objectData).subscribe(async (res: any) => {
                    this.fileType = res.headers.get('Content-Type')
                    this.fileName = await res.headers.get('filename')
                    this.blobFile = new Blob([(res.body)], {type: this.fileType});
                    this.sizeInput = this.communService.formatBytes(res.body.size);
                    this.fileContent = new File([(res.body)], this.fileName, {type: this.fileType});
                    this.openOfficePopUp = false;
                    if (res.body.size > this.maxUploadMultiPartFile)/*presq 1MO*/
                    {
                        this.disableSave = true;
                        this.displayErrorToasterOfMaxFileSize();
                    } else {
                        this.disableSave = false;
                    }
                    this.Ref.value = this.fileName;
                    this.translateService.get('ATTACHEMENT.ModeleSucces', this.Ref).subscribe((res) => {
                        this.toastr.success(res, '', {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        });
                    });
                    this.loadingVisible = false;

                    /*Save Automatique aprés rattachement */
                }, () => {
                    this.loadingVisible = false
                    this.Ref.value = this.fileName

                    this.translateService.get("ATTACHEMENT.Modeleechec", this.Ref).subscribe((res) => {
                        this.toastr.error(res, "", {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                    })
                }
            )
        } catch (error) {
            this.Ref.value = this.fileName
            this.translateService.get("ATTACHEMENT.SaveAfterEditError", this.Ref).subscribe((res) => {
                this.toastr.error(res, " ", {
                    closeButton: true,
                    positionClass: 'toast-top-right',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                })
            })
            this.loadingVisible = false
        }
    }

    /*office template*/

}

export class Object {
    classId: any
    objectId: any
    preferenceName: any
    objectData: any
}
