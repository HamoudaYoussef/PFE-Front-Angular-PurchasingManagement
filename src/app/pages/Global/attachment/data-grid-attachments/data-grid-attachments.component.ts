import {EnvService} from 'src/env.service';
import {TranslateService} from '@ngx-translate/core';
import {Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChange, ViewChild} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {DxDataGridComponent, DxFormComponent} from 'devextreme-angular';
import {AttachementModuleService} from '../attachement.module.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Object} from '../template-attachment/template-attachment.component';
import * as FileSaver from 'file-saver';
import {
    HttpParamMethodDelete,
    HttpParamMethodPatch,
    HttpParamMethodPost,
    HttpParamMethodPutNEwFormat
} from '../../ps-tools/class';
import {HttpServicesComponent} from '../../ps-tools/http-services/http-services.component';
import {Export} from '../../shared-service/export';
import {CommunFuncService} from '../Commun/commun-func.service';
import {DatePipe} from '@angular/common';
import {FormatDate} from '../../shared-service/formatDate';
import {loadMessages} from "devextreme/localization";
import frMessages from "devextreme/localization/messages/fr.json";

import arMessages from 'devextreme/localization/messages/ar.json';

@Component({
    selector: 'app-data-grid-attachments',
    templateUrl: './data-grid-attachments.component.html',
    styleUrls: ['./data-grid-attachments.component.scss']
})
export class DataGridAttachmentsComponent implements OnInit {
    packageName = require('package.json').name
    @ViewChild('gridfile', {static: false}) gridfile: DxDataGridComponent;
    @ViewChild('formulaire', {static: false}) formulaire: DxFormComponent;
    @ViewChild('gridofficeTempalte', {static: false}) gridofficeTempalte: DxDataGridComponent;
    @Input() withoutviewer: Boolean = false;
    @Output() jsondocviewerEventFromGrid = new EventEmitter<any>();
    @Output() FileDeletedToAddToremaingFileDefPopup = new EventEmitter<any>();

    /*Monitoring file actions*/
    @Input() canDelete: Boolean = true
    @Input() canlock: Boolean = true
    @Input() showSplliter: Boolean = false
    @Input() canUploadfile: Boolean = true
    @Input() canTransfert: Boolean = true
    @Input() canActionPDF: Boolean = true
    @Input() canClone: Boolean = true
    @Output() ouvrirPopUpSave = new EventEmitter();
    @Input() canDonwloadfile: Boolean = true
    @Input() canModiffile: Boolean = true
    @Input() canShowfile: Boolean = true
    @Input() hasModelOfficeButton: Boolean = true
    /*Visible column in data grid */
    @Input() visibleCellIndex: Boolean = true
    /*Monitoring file actions*/
    @Input() visibleCellId: Boolean = false
    @Input() visibleCellFileType: Boolean = true
    @Input() visibleCelldocTitle: Boolean = false
    @Input() visibleCellfileName: Boolean = false
    @Input() visibleCelldocId: Boolean = true;
    @Input() visibleCelldocIssueDate: Boolean = false;
    @Input() visibleCelldocExpirationDate: Boolean = false;
    @Input() visibleCellissueAdress: Boolean = false;
    @Input() visibleCelldocSize: Boolean = true;
    @Input() visibleCellsysdateUpdated: Boolean = true;
    @Input() visibleCellResponsable: Boolean = true;
    @Input() visibleCellsecuriteLevel: Boolean = true;
    @Input() visibleCellSignedOrLockedState: Boolean = true;
    @Input() flipped;/*flipped to thumbnail*/

    @Input() archiveButtonVisible: Boolean = true;
    @Input() flipedDatagridButtonVisible: Boolean = true;

    /*Visible column in data grid */
    @Input() classid: any;
    @Input() objectid: any;
    @Input() objectData;
    @Input() levelMin: number;
    @Input() attachements: any;
    @Input() ContainerViewer;
    @Input() fileAccessToken;
    @Input() Refresh;
    canUnLock: boolean;
    @Output() filppedout = new EventEmitter();
    @Output() newFile = new EventEmitter();
    jsondocviewer = {pdfSrcc: "", visionneuse: "url"};/*Viewer*/
    loadingVisible: any = false;
    filedatasource: any = []
    count: any;
    //language
    arabe = false;
    arabertl = "ltr";
    //language
    dateSystem = new Date()
    selectedRows: any;/* [(selectedRowKeys)]*/
    selectedRowKeys: any;
    dataSourcepersonne: any;
    datarnage: any[] = [] /*SECURITY LEVEL MARGE*/
    AllSL;
    formatDate = new FormatDate(this.env);/*DATE FORMATTER*/
    base64: any;/*BASE64 OF FILE not crypted !!!! */
    fileName: any;/*FILE NAME TO DISPLAY*/
    filebyId: any;
    idFileViewer: any;/*FILE ID*/
    idcmis: any;/*FILE ID*/
    fileType/*FILE TYPE*/
    popupDeleteFileVisible: any = false;/*DELETE FILE POPUP*/
    isarchiveiconDisabled: any = true;/*ARCHIVE ICON*/
    visibleTrueModal = false/*POPUP FILE VIEWER VISIBLE */
    minDateExpiration
    massageExpressionRegulier = ""
    /*DEVICE TYPE*/
    isMobile
    isTablet
    isDesktopDevice
    /*DEVICE TYPE*/
    innerWidth = false;
    fileContent/*FILE OBJECT CONTENT AFTER SIGNATURE OR SCAN BEFORE/AFTER**/
    permissionDenied/*PERMISSION FOR SCAN BEFORE/AFTER */
    permissionDeniedSig = false/*PERMISSION FOR SIGNATURE */
    permissionToTopViewer = true/*PERMISSION FOR Top Viewer */
    avertismentPopUp = false/*AVERTISSMENTOF FILE SIGNED*/
    pgNbr/*PGNBRE*/
    /*Module PSTK*/
    ModuleScan = require('../ModulePSTK.json').Module_Scan
    ModuleOffice = require('../ModulePSTK.json').Module_Office
    ModuleSign = require('../ModulePSTK.json').Module_Sign
    ModuleMisc = require('../ModulePSTK.json').Module_Misc;

    /*FOR MODIF IN DISK*/
    disabledSaved = true
    /*Module PSTK*/
    fileBusy = false
    itemsList = [];
    /*FOR MODIF IN DISK*/
    validDocTitle = "^[^<>:;,?\"'*|\\\\\\/]+$"
    validFilename = "^[^\\\\\\/\\:\\*\\?\\\"\\<\\>\\|\\.]+(\\.[^\\\\\\/\\:\\*\\?\\\"\\<\\>\\|\\.]+)+$"
    validDocTitleMSG
    validFileMsg
    popupModifFileVisible = false
    saveFromScanner
    blobContent
    popupDeleteFileVisibleAttached = false
    FileForm/*FileFormulaire*/
    openOfficePopUp = false;
    officeTemplateList = [];
    fileTemplate;
    editorOptionsName;
    namePattern = false;
    FormatDisplayDate: any;
    FormatDisplayDateExpiration: any;
    editorOptionsDateEmission;
    maxCopies = 1;
    minCopies = 1;
    editorOptionsIdentificateur;
    editorOptionsDateExpiration;
    backgroundColor;/*CARD COLOR*/
    boxShadow;/*CARD SHADOW*/
    labelEditable = false;
    editorOptions;
    resp = null;
    FormatDisplayDateDEmiss: any;
    FormatDisplayDateDExpir: any;
    upladPopUP = false;
    visible = false;
    sizeInput;
    disableSave = false;
    fileTodelete;
    UploadFile;
    /*GET BY OBJECT IF AND CLASS ID*/
    idFileRemplace;
    id;/*fileSelected id*/
    pstkEnabledAndRunning = false;
    Ref = {value: ''};
    RefUserName;
    @ViewChild(HttpServicesComponent, {static: true}) private httpServicesComponent: HttpServicesComponent;
    @Input() authorizationTokenScan = false;
    @Input() authorizationTokenOffice = false;
    @Input() listOfficeNotEmpty = false;
    // @Input() authorizationTokenSign = false;
    // @Input() authorizationTokenMisc = false;
    currentlang

    constructor(private deviceService: DeviceDetectorService, public env: EnvService, private http: HttpClient,
                private toastr: ToastrService, private cookieService: CookieService, public communService: CommunFuncService, private datepipe: DatePipe,
                private fileservice: AttachementModuleService, private fb: FormBuilder, private translateService: TranslateService) {


        if (this.cookieService.get('displayname')) {
            this.RefUserName = {displayName: this.cookieService.get('displayname')};
        } else {
            this.RefUserName = {displayName: 'utilisateur'};
        }
        if (localStorage.getItem(this.packageName + '_' + 'locale') == 'ar') {

            this.arabe = true;
            this.arabertl = 'rtl';


        } else {
            this.arabe = false;
            this.arabertl = 'ltr';


        }


        // if (localStorage.getItem(this.packageName + '_' + 'locale') != null) {
        //     translateService.use(localStorage.getItem(this.packageName + '_' + 'locale'));
        // } else {
        //     translateService.use('fr');
        // }
        //     translateService.use('fr');
        this.currentlang = this.translateService.currentLang;

        this.deletefile = this.deletefile.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.UploadFileStep1 = this.UploadFileStep1.bind(this);
        this.viewFile = this.viewFile.bind(this);
        this.lockFile = this.lockFile.bind(this);
        this.unlockFile = this.unlockFile.bind(this);
        this.transferable = this.transferable.bind(this);
        this.Untransferable = this.Untransferable.bind(this);
        this.cloned = this.cloned.bind(this);
        this.istrashIconVisibe = this.istrashIconVisibe.bind(this);
        this.isuploadVisibe = this.isuploadVisibe.bind(this);
        this.isDownloadFileVisibe = this.isDownloadFileVisibe.bind(this);
        this.iscloneIconVisibe = this.iscloneIconVisibe.bind(this);
        this.isunlockIconVisibe = this.isunlockIconVisibe.bind(this);
        this.islockIconVisibe = this.islockIconVisibe.bind(this);
        this.istransferableIconVisibe = this.istransferableIconVisibe.bind(this);
        this.isuntransferableIconVisibe = this.isuntransferableIconVisibe.bind(this);
        this.onEditorPreparing = this.onEditorPreparing.bind(this);
        this.isactionPdf = this.isactionPdf.bind(this);
        this.isVisible = this.isVisible.bind(this);
        this.isAttachmentExist = this.isAttachmentExist.bind(this);
        // this.lazyy();
        /*TRANSLATE ERROR OF message Patern Identificateur*/
        this.translateService.get("ATTACHEMENT.messagePaternIdentificateur").subscribe((res) => {
            this.massageExpressionRegulier = res;
        })
        this.translateService.get(["ATTACHEMENT.validFileMsg", "ATTACHEMENT.validDocTitleMSG"]).subscribe((res) => {
            this.validFileMsg = res["ATTACHEMENT.validFileMsg"];
            this.validDocTitleMSG = res["ATTACHEMENT.validDocTitleMSG"];
        })
        this.translateService.get(["ATTACHEMENT.open", "ATTACHEMENT.recu&sup", "ATTACHEMENT.generatepdf"]).subscribe((res) => {
            let itemTitle = res
            this.itemsList.push({
                id: 1,
                text: itemTitle["ATTACHEMENT.open"],
                icon: 'fas fa-arrow-circle-down',
                disabled: true,
                template: 'itemFileNotModif'
            })
            this.itemsList.push({
                id: 2,
                text: itemTitle['ATTACHEMENT.recu&sup'],
                icon: 'fas fa-arrow-circle-up',
                disabled: this.disabledSaved,
                template: 'itemNotRecuSupp'
            })
            this.itemsList.push({
                id: 3,
                text: itemTitle['ATTACHEMENT.generatepdf'],
                icon: 'fa fa-file-pdf-o'
            });
        })
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktopDevice = this.deviceService.isDesktop();
    }

    ngOnInit(): void {
        console.log("refresh3", this.Refresh)

        this.getfilesByClassIdAndObjectId(this.classid, this.objectid, this.fileAccessToken);


    }

    CreateAttatchment() {
        this.loadingVisible = true
        if (!(this.fileContent == null && this.fileTemplate.fileRequired == true)) {
            let obj = new FormData()
            obj.append("docTitle", this.fileName)
            obj.append("objectData", JSON.stringify(this.objectData))
            obj.append("objectDatasecuriteLevel", "0")
            obj.append("reqFileDefName", this.env.docPardefaut)
            obj.append("classId", this.objectData.classId)
            obj.append("objectId", this.objectData.id)
            obj.append("locked", "false")
            obj.append("Public", "false")
            if (this.fileContent != null)
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

            if ((this.objectData) != undefined && (this.objectData).securiteLevel != null && (this.objectData).securiteLevel != undefined)
                obj.append("objectDatasecuriteLevel", (this.objectData).securiteLevel);
            if (this.saveFromScanner == true) {
                if ((this.cookieService.get('scannerProfil')) != undefined)
                    obj.append("preferenceName", (this.cookieService.get('scannerProfil')));
            }

            let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'createAttachement' + "?fileAccessToken=" + this.fileAccessToken, obj)
            this.httpServicesComponent.method(paramsHttp, this.Ref).then(data => {
                this.refresh();
                if (data["statut"] == true)
                    this.newFile.emit(this.fileTemplate)
                this.loadingVisible = false

            })
        } else if ((this.fileContent == null || this.fileContent == undefined) && this.fileTemplate.fileRequired == true) {
            this.loadingVisible = false
            // this.Ref.value = this.form.instance.option("formData").docTitle
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


    ShowButton: boolean = false

    isRowHovered: { [key: string]: boolean } = {};
    hoveredRowId: string | null = null;

    onRowMouseEnter(event: any) {
        this.ShowButton = true
    }

    onRowMouseLeave(event: any) {

        this.ShowButton = false

    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (changes['levelMin']) {
            this.getSL();
            this.visible = true
        }
        console.log("refresh", changes['Refresh'])
        console.log("changes['Refresh'].previousValue", changes['Refresh'].previousValue)
        console.log("changes['Refresh'].currentValue", changes['Refresh'].currentValue)


        if (changes['Refresh'] && changes['Refresh'].previousValue != changes['Refresh'].currentValue) {
            console.log("refresh", this.Refresh)
            this.refresh()


        }

        // only run when property "data" changed
        if (changes['attachements'] && changes['attachements'].previousValue != changes['attachements'].currentValue) {
            this.filedatasource = this.attachements
            // if (this.showSplliter == true&&  this.attachements.length>0) {
            //     console.log("Show firs",this.filedatasource)
            //
            //     this.viewFileInNGOnChange(this.filedatasource[0],false);
            //
            //
            // }

            this.filedatasource = this.filedatasource.sort((a, b) =>
                b.id - a.id
            )
            this.count = this.attachements.length;
            if (this.count == 0) {
                this.isarchiveiconDisabled = true;

            } else if (this.count != 0) {
                this.isarchiveiconDisabled = false;
            }
        }
    }

    selectedLicensepstk

    async verifLicensePSTKDatagridAttachement() {
        this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
        if (!this.pstkEnabledAndRunning) {
            /*            this.translateService.get('ATTACHEMENT.PstkNotEncours').subscribe((res) => {
                            this.toastr.info(res, '', {
                                closeButton: true,
                                positionClass: 'toast-top-right',
                                extendedTimeOut: this.env.extendedTimeOutToastr,
                                progressBar: true,
                                disableTimeOut: false,
                                timeOut: this.env.timeOutToastr
                            });
                        });*/
            // this.authorizationTokenScan = false;
            this.authorizationTokenOffice = false;
            // this.authorizationTokenSign = false;
        } else {
            /*IN DATAGRID ATTACHEMENT ALL WE NEED MODULE PSTK OF SCAN && OFFICE*/
            let defaultPort;

            /*IN D}ATAGRID ATTACHEMENT ALL WE NEED MODULE PSTK OF SCAN && OFFICE && SIG*/
            if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '') {
                defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
            } else {
                defaultPort = this.env.pstkport;
            }
            if (this.cookieService.get(this.ModuleOffice) === 'undefined'
                || this.cookieService.get(this.ModuleOffice) === undefined
                || this.cookieService.get(this.ModuleOffice) === '') {


                if (this.cookieService.get('selectedLicensepstk') != ''
                    && this.cookieService.get('selectedLicensepstk') != undefined && this.cookieService.get('selectedLicensepstk') != null
                    && this.cookieService.get('selectedLicensepstk') != 'undefined' && this.cookieService.get('selectedLicensepstk') != 'null') {
                    this.selectedLicensepstk = this.cookieService.get('selectedLicensepstk');


                    if (this.selectedLicensepstk === 'Machine') {
                        // return new Promise(async (resolve) => {
                        await this.fileservice.checkPSTK(defaultPort, null, null, null, null).subscribe(async (res: any) => {
                            if (res.result.Module.Module_Scan) {
                                this.authorizationTokenScan = true;
                            }
                            // else if (res.result.Module.Module_Office) {
                            //     this.authorizationTokenOffice = true;
                            // }
                        });
                        // }).then(res => {
                        //     return res;
                        // })
                    } else if (this.selectedLicensepstk === 'Serveur') {
                        // let authorizationtokenScan
                        let authorizationtokenOffice
                        // await this.fileservice.getToken(this.ModuleScan).then(
                        //     (res: any) => {
                        //         if (res && res.res.body.authorizationToken) {
                        //             authorizationtokenScan = res.res.body.authorizationToken;
                        //         }
                        //     }, (error) => {
                        //         // console.error(error);
                        //         authorizationtokenScan = null;
                        //     }
                        // );
                        await this.fileservice.getToken(this.ModuleOffice).then(
                            (res: any) => {
                                if (res && res.res.body.authorizationToken) {
                                    authorizationtokenOffice = res.res.body.authorizationToken;
                                }
                            }, (error) => {
                                // console.error(error);
                                authorizationtokenOffice = null;
                            }
                        );
                        await this.fileservice.checkPSTK(defaultPort, null, null, null, authorizationtokenOffice).subscribe((res: any) => {
                                // if (res.result.Module.Module_Misc) {
                                //     this.authorizationTokenMisc = true;
                                // }
                                // if (res.result.Module.Module_Sign) {
                                //     this.authorizationTokenSign = true;
                                // }
                                if (res.result.Module.Module_Office)
                                    this.authorizationTokenOffice = true;
                                // if (res.result.Module.Module_Scan) {
                                //     this.authorizationTokenScan = true;
                                // }
                            }
                        )
                    }
                }
            } else {
                // let authorizationtokenScan
                let authorizationtokenOffice

                authorizationtokenOffice = this.cookieService.get(this.ModuleOffice);
                // authorizationtokenScan = this.cookieService.get(this.ModuleScan);

                await this.fileservice.checkPSTK(defaultPort, null, null, null, authorizationtokenOffice).subscribe((res: any) => {
                        // if (res.result.Module.Module_Misc) {
                        //     this.authorizationTokenMisc = true;
                        // }
                        // if (res.result.Module.Module_Sign) {
                        //     this.authorizationTokenSign = true;
                        // }
                        if (res.result.Module.Module_Office)
                            this.authorizationTokenOffice = true;
                        /*if (res.result.Module.Module_Scan) {
                            this.authorizationTokenScan = true;
                        }*/
                    }
                )
            }
        }
    }

    screen() {
        return 'sm';
    }

    /*refresh get by id*/
    refresh() {
        this.getfilesByClassIdAndObjectId(this.classid, this.objectid, this.fileAccessToken);
        // this.verifLicensePSTKDatagridAttachement()
    }

    /*refresh get by id*/

    /*GET BY OBJECT IF AND CLASS ID*/
    getfilesByClassIdAndObjectId(classeid, objectid, fileAccessToken) {
        this.fileservice.getfilesByClassIdAndObjectId(classeid, objectid, fileAccessToken).subscribe((data: []) => {
            this.filedatasource = data
            this.filedatasource = this.filedatasource.sort((a, b) =>
                b.id - a.id
            )
            this.count = data.length;
            if (this.count == 0) {
                this.isarchiveiconDisabled = true;

            } else if (this.count != 0) {
                this.isarchiveiconDisabled = false;
            }
        }, (err) => {
            this.translateService.get("ATTACHEMENT.ErrorreloadFile").subscribe((res) => {
                this.toastr.error(res, "", {
                    closeButton: true,
                    positionClass: 'toast-top-right',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                })
            })
        })
    }

    /*GET BY OBJECT IF AND CLASS ID*/

    /*Host Listener to the sl change dx-lookup*/
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth < 576) {
            this.innerWidth = true

        } else {
            this.innerWidth = false
        }
    }

    /*Host Listener to the sl change dx-lookup*/
    // lazyy() {
    //     this.dataSourcepersonne = {
    //         store: new CustomStore({
    //             key: "sid",
    //             load: (loadOptions) => {
    //                 let params: any = "";
    //                 if (loadOptions.skip == undefined && loadOptions.take == undefined) {
    //                     params += '?page=' + 0;
    //                     params += '&size=' + this.env.pageSize;
    //                 } else {
    //                     params += '?page=' + loadOptions.skip / loadOptions.take || 0;
    //                     params += '&size=' + loadOptions.take || this.env.pageSize;
    //                 }
    //                 if (loadOptions.searchValue) {
    //                     params += '&' + loadOptions.searchExpr + '.contains=' + loadOptions.searchValue;
    //                 }
    //                 return this.http.get(`${this.env.moduleNameKernel}` + this.env.WS.getAllAclSid + params,
    //                     {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
    //                     .toPromise()
    //                     .then((result: any[]) => {
    //                         return result;
    //                     });
    //             },
    //             byKey: (key) => {
    //                 return null
    //             }
    //         }),
    //         paginate: true,
    //         pageSize: this.env.pageSize
    //
    //     };
    // }

    /*Get all Employer*/

    /******************************SECURITE LEVEL****************************/

    /******************************SECURITE LEVEL get Marge Security Level ****************************/

    getMargeLevelFile() {
        let min
        this.levelMin != null ? min = this.levelMin : min = 0
        let max = this.cookieService.get('securityLevel')
        this.datarnage = this.AllSL.filter(x => (x.level >= min && x.level <= max)).map(x => x).sort((a, b) =>
            a.level - b.level
        );

    }

    /******************************SECURITE LEVEL get Marge Security Level ****************************/
    getSL() {
        if (this.communService.verifDateOfSavedLocaStorage(this.packageName + '_' + "SL")) {
            this.AllSL = JSON.parse(localStorage.getItem(this.packageName + '_' + "SL")).data
            this.getMargeLevelFile();

        } else {
            this.fileservice.getAllSL().subscribe(async (data: any) => {
                    this.AllSL = await data;

                    let jsonData = {
                        data: this.AllSL,
                        date: this.datepipe.transform(new Date(), 'yyyy-MM-dd')
                    }
                    localStorage.setItem(this.packageName + '_' + "SL", JSON.stringify(jsonData))

                    this.getMargeLevelFile();

                }, () =>
                    this.translateService.get("ATTACHEMENT.ErrorMargeLevelFile").subscribe((res) => {
                        this.toastr.error("", res, {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                    })
            )
        }
    }


    returnLabel(securiteLevel: any): any {
        if (this.datarnage.length != 0) {
            let rslt = this.datarnage.find(({level}) => level === securiteLevel)
            if (rslt != null && rslt != undefined)
                return rslt.label;
            else
                return securiteLevel
        } else
            return securiteLevel
    }

    valueChangedSecuriteLevel(data) {
        let obj = new FormData()
        obj.append("securiteLevel", data.value)
        if (this.selectedRowKeys.cmisId != null && this.selectedRowKeys.cmisId != undefined)
            obj.append("cmisId", this.selectedRowKeys.cmisId)
        if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null)
            obj.append("objectData", JSON.stringify(this.objectData));
        if ((this.objectData) != undefined && (this.objectData) != null && (this.objectData).securiteLevel != null && (this.objectData).securiteLevel != undefined)
            obj.append("objectDatasecuriteLevel", (this.objectData).securiteLevel);

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + 'attachementsSetContent/' + this.selectedRowKeys.id + '?fileAccessToken=' + this.fileAccessToken, obj);
        this.Ref.value = this.selectedRowKeys.docTitle
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.NiveausecuriteMiseajour", "ATTACHEMENT.ErrorupdatesecurtylFile").then(data => {
            this.refresh();
        })
    }

    /******************************SECURITE LEVEL****************************/

    ActuelDatatoChange

    /*ATTACHED FILE FROM CARD INTERFACE*/
    attached() {

        document.getElementById("addfile").click();
    }

    /*DELETE FILE FROM CARD */
    deleteFile() {
        this.fileName = null
        this.fileContent = null
        this.popupDeleteFileVisibleAttached = false
        this.saveFromScanner = false;
        this.pgNbr = null
        this.upladPopUP = false
        this.sizeInput = null
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

            if (this.objectid != undefined)
                obj.objectId = this.objectid
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

    Scanner(scannerName, scannerProfil, filename, title, authorizationToken) {
        this.loadingVisible = true;
        this.fileName = null

        let jsonScanPreference = (scannerProfil);
        let decision = true;
        try {
            this.fileservice.Scanner(authorizationToken,
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
                    this.fileType = res.result.fileMimeType;
                    this.pstkEnabledAndRunning = this.cookieService.get("envPstkRunning") === 'true'
                    let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan)

                    this.permissionDenied = (this.pstkEnabledAndRunning && verifLicensePSTKScan);
                    this.permissionToTopViewer = (this.fileType === 'application/pdf');
                    const byteArray = new Uint8Array(atob(res.result.data).split('').map(char => char.charCodeAt(0)));
                    this.fileContent = new File([byteArray], res.result.tmpFileName, {type: this.fileType});
                    this.fileName = res.result.tmpFileName;
                    this.sizeInput = this.communService.formatBytes(byteArray.length);
                    this.base64 = res.result.data;
                    this.pgNbr = res.result.pgNbr;
                    let arraybuffer = this.communService.base64ToArrayBuffer(this.base64);
                    if (byteArray.length > this.env.maxUploadMultiPartFile)/*presq 1MO*/
                    {
                        this.disableSave = true;
                        this.translateService.get('ATTACHEMENT.errorMaxSize').subscribe((res) => {
                                this.toastr.error(res + this.communService.formatBytes(this.env.maxUploadMultiPartFile), '', {
                                    closeButton: true,
                                    positionClass: 'toast-top-right',
                                    extendedTimeOut: this.env.extendedTimeOutToastr,
                                    progressBar: true,
                                    disableTimeOut: false,
                                    timeOut: this.env.timeOutToastr
                                });
                            }
                        );
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
                        this.blobContent = new Blob([arraybuffer], {type: this.fileType});
                        this.fileContent = new File([arraybuffer], res.result.tmpFileName, {type: this.fileType});
                        this.fileName = res.result.tmpFileName;
                    }
                }, (err) => {
                    this.loadingVisible = false;
                    this.translateService.get('ATTACHEMENT.AquireFailed').subscribe(title => {
                        this.toastr.error(err.error.result.textError, title, {


                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        });
                    });
                }
            );
        } catch (error) {
            this.translateService.get("ATTACHEMENT.Configscannernonvalide").subscribe((res) => {
                this.toastr.error('', res + " ", {
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

    /*ATTACHED FILE FROM CARD INTERFACE*/


    /*DETECTE AND CAPT FILE ADD FROM INTERFACE FRONT */
    async fileChange(input) {
        this.loadingVisible = true;
        this.fileContent = null;
        this.fileName = null;
        this.fileContent = input.files[0];
        this.fileName = input.files[0].name;
        let fileSize = input.files[0].size;
        this.sizeInput = this.communService.formatBytes(fileSize);

        if (fileSize > this.env.maxUploadMultiPartFile)/*presq 1MO*/
        {
            this.disableSave = true;
            this.translateService.get('ATTACHEMENT.errorMaxSize').subscribe((res) => {
                    this.toastr.error(res + this.communService.formatBytes(this.env.maxUploadMultiPartFile), "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                }
            )
            this.loadingVisible = false;
        } else {
            this.disableSave = false;
            this.fileType = this.fileContent.type;
            this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
            let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan)
            this.permissionDenied = (this.pstkEnabledAndRunning && verifLicensePSTKScan);
            this.permissionToTopViewer = (this.fileType === 'application/pdf');

            this.avertismentPopUp = false;
            this.fileContent.arrayBuffer().then(async (arrayBuffer) => {
                this.blobContent = new Blob([new Uint8Array(arrayBuffer)], {type: this.fileType});
                this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(arrayBuffer));

            })
            this.loadingVisible = false;
        }
        this.CreateAttatchment()
    }

    /*DETECTE AND CAPT FILE ADD FROM INTERFACE FRONT */

    /************************ attachements Set Content *****************************/
    attachementsSetContent() {
        this.loadingVisible = true;
        let obj = new FormData();
        if (this.fileContent != null && this.fileContent != undefined) {
            obj.append('multipartFiles', this.fileContent);
        }
        if (this.UploadFile.cmisId != null && this.UploadFile.cmisId != undefined) {
            obj.append('cmisId', this.UploadFile.cmisId);
        }
        if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null) {
            obj.append('objectData', JSON.stringify(this.objectData));
        }
        if ((this.objectData) != undefined && (this.objectData) != null && (this.objectData).securiteLevel != null && (this.objectData).securiteLevel != undefined) {
            obj.append('objectDatasecuriteLevel', (this.objectData).securiteLevel);
        }
        this.Ref.value = this.UploadFile.docTitle;
        this.loadingVisible = false;
        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + 'attachementsSetContent/' + this.UploadFile.id + '?fileAccessToken=' + this.fileAccessToken, obj);
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.MessageMiseajour", "ATTACHEMENT.editErreur").then(data => {
            this.refresh();

            if (data['statut'] == true) {
                this.closeViwerPopUp()
                this.deleteFile()
            }
        })
    }

    /************************ attachements Set Content *****************************/

    /************************ attachements view File Not Added *****************************/
    async viewFileNotAdded() {
        if (this.fileContent != null && this.blobContent != null) {
            this.loadingVisible = true;
            this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'
            let verifLicensePSTKSign: any = await this.communService.verifLicensePSTK(this.ModuleSign);
            this.permissionDeniedSig = (this.ContainerViewer && this.pstkEnabledAndRunning && verifLicensePSTKSign);
            this.permissionToTopViewer = (this.fileType === 'application/pdf');
            var fileURL = URL.createObjectURL(this.blobContent);
            this.jsondocviewer.pdfSrcc = fileURL;
            this.jsondocviewer.visionneuse = 'url';

            if (this.fileType === 'application/pdf') {
                let obj = new FormData();
                if (this.fileContent != null && this.fileContent != undefined) {
                    obj.append('multipartFiles', this.fileContent);
                }
                let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'IsSigned', obj);
                this.Ref.value = this.fileName;

                this.httpServicesComponent.method(paramsHttp, this.Ref, 'ATTACHEMENT.rattachement', 'ATTACHEMENT.rattachmentEroor', false).then(data => {
                    if (data['statut'] == true) {
                        this.avertismentPopUp = data['value'];
                    }
                });
            }


            this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'
            let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan)

            if (this.fileType === 'application/pdf' && this.pstkEnabledAndRunning && verifLicensePSTKScan) {
                let authorizationtokenScan = await this.communService.authorizationToken(this.ModuleScan)

                this.fileservice.getpageNbre(authorizationtokenScan, this.base64).then(res => {
                    this.pgNbr = res.result.totalpage;
                }, err => {
                    // console.error(err);
                });
            }

            this.visibleTrueModal = false;

            this.loadingVisible = false;
        }
    }

    /************************ attachements view File Not Added *****************************/

    /*save new file */
    save(fileTemplate) {
        this.loadingVisible = true;
        if (this.formulaire.instance.validate().isValid) {
            let jsonFile = fileTemplate
            if (this.resp)
                jsonFile.responsable = this.resp
            jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;

            let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
            this.Ref.value = jsonFile.docTitle

            this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.MessageMiseajour", "ATTACHEMENT.editErreur").then(data => {
                if (data["statut"] == true) {
                    this.popupModifFileVisible = false;
                    this.refresh();
                    this.loadingVisible = false;

                } else {
                    this.loadingVisible = false;
                }
            })
        } else {
            this.translateService.get("formInvalide").subscribe((res) => {
                this.loadingVisible = false;
                this.toastr.error(res, '', {
                    closeButton: true,
                    positionClass: 'toast-top-right',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                });
            })
        }
    }

    /*save new file */

    /*change responsable*/
    changeResp(e) {
        this.resp = (e.value)
    }

    /*change responsable*/

    /*MIN DATE emission*/
    changeDateEmission(e) {
        this.minDateExpiration = e.value
        this.FormatDisplayDate = this.formatDate.formatDFshortNEW(e.value)
        this.editorOptionsDateEmission = {
            max: this.dateSystem,
            displayFormat: this.FormatDisplayDate,
        }
    }

    /*MIN DATE expiration*/

    changeDateExpiration(e) {
        this.FormatDisplayDateExpiration = this.formatDate.formatDFshortNEW(e.value);
        this.editorOptionsDateExpiration = {
            min: this.minDateExpiration,
            displayFormat: this.FormatDisplayDateExpiration,
        };
    }

    /*MIN DATE expiration*/

    /*row click View File Or Download*/
    rowclickViewFileOrDownload(evt: any) {


        if (evt.column.dataField === 'Actions' || evt.column.dataField === 'securiteLevel') {
        } else {
            // const namefile = evt.row.data.fileName.split('.');
            const fileType = evt.row.data.filesTypeDTO.type;
            if (fileType === "application/json" || fileType === "text/plain" || fileType === "image/jpeg" ||
                fileType === "image/png" || fileType === "image/gif" || fileType === "image/tiff" || fileType === "image/bmp" ||
                fileType === "image/svg+xml" || fileType === "application/pdf") {
                if (this.showSplliter == true) {
                    console.log("UIN Splitter", evt)

                    this.viewFile(evt, false);


                } else {
                    this.viewFile(evt, true);

                }
            } else {
                this.downloadFile(evt);
            }
        }
    }


    /*row click View File Or Download*/

    /*prepare edit for edit dto */
    onEditorPreparing(evt: any): void {
        // if (evt.column.dataField === 'Actions' || evt.column.dataField === 'securiteLevel') {
        //     this.popupModifFileVisible = false;
        // } else {
        this.popupModifFileVisible = true;

        console.log("ici ::> ", evt)


        this.fileTemplate = evt.row.data;
        if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.maxCopies && this.fileTemplate.requestFileDefinition.maxCopies != null && this.fileTemplate.requestFileDefinition.maxCopies != undefined && this.fileTemplate.requestFileDefinition.maxCopies != 0) {
            this.maxCopies = this.fileTemplate.maxCopies;
        }
        if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.minCopies && this.fileTemplate.requestFileDefinition.minCopies != null && this.fileTemplate.requestFileDefinition.minCopies != undefined && this.fileTemplate.requestFileDefinition.minCopies != 0) {
            this.minCopies = this.fileTemplate.minCopies;
        }
        if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.labelEditable !== null && this.fileTemplate.requestFileDefinition.labelEditable !== undefined && this.fileTemplate.requestFileDefinition.labelEditable !== '' && this.fileTemplate.requestFileDefinition.labelEditable !== {}) {
            this.labelEditable = this.fileTemplate.requestFileDefinition.labelEditable;
        }
        this.editorOptionsName = {
            readOnly: !this.labelEditable,
        };
        if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.description !== null && this.fileTemplate.requestFileDefinition.description !== undefined && this.fileTemplate.requestFileDefinition.description !== '' && this.fileTemplate.requestFileDefinition.description !== {}) {
            this.massageExpressionRegulier += this.fileTemplate.requestFileDefinition.description;
        }
        if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.idRegex !== null && this.fileTemplate.requestFileDefinition.idRegex !== undefined && this.fileTemplate.requestFileDefinition.idRegex !== '' && this.fileTemplate.requestFileDefinition.idRegex !== {}) {
            this.namePattern = true;
        }

        this.FormatDisplayDateDEmiss = this.formatDate.formatDFshortNEW(this.fileTemplate.docExpirationDate);

        this.FormatDisplayDateDExpir = this.formatDate.formatDFshortNEW(this.fileTemplate.docIssueDate);
        this.editorOptionsDateExpiration = {
            min: this.minDateExpiration,
            onValueChanged: this.changeDateExpiration.bind(this),
            displayFormat: this.FormatDisplayDateDExpir,

        };
        this.editorOptionsDateEmission = {
            max: this.dateSystem,
            onValueChanged: this.changeDateEmission.bind(this),
            displayFormat: this.FormatDisplayDateDEmiss,

        };
        this.editorOptions = {
            dataSource: this.dataSourcepersonne,
            valueExpr: 'sid',
            displayExpr: 'sid',
            searchEnabled: 'true',
            searchExpr: 'sid',
            stylingMode: 'filled',
            labelMode: 'static',
            onValueChanged: this.changeResp.bind(this),

        };


        if (this.fileTemplate && this.fileTemplate.maxCopies && this.fileTemplate.maxCopies != null && this.fileTemplate.maxCopies != undefined && this.fileTemplate.maxCopies != 0) {
            this.maxCopies = this.fileTemplate.maxCopies;
        }
        if (this.fileTemplate && this.fileTemplate.minCopies && this.fileTemplate.minCopies != null && this.fileTemplate.minCopies != undefined && this.fileTemplate.minCopies != 0) {
            this.minCopies = this.fileTemplate.minCopies;
        }

        if (this.objectData) {
            if (this.objectData.mandatoryTemplateFileName) {
                if (this.objectData.mandatoryTemplateFileName.includes(',')) {
                    let listmandotory = this.objectData.mandatoryTemplateFileName.split(',');
                    listmandotory.forEach(i => {
                        if (this.fileTemplate.requestFileDefinition.name == i) {
                            this.backgroundColor = '#edc1c1;';
                            this.boxShadow = '0 2px 5px #f305056b, 0 2px 10px #0000001f !important;';
                        }
                    });
                } else {
                    if (this.fileTemplate.requestFileDefinition.name == this.objectData.mandatoryTemplateFileName) {
                        this.backgroundColor = '#edc1c1;';
                        this.boxShadow = '0 2px 5px #f305056b, 0 2px 10px #0000001f !important;';
                    }
                }
            }
            if (this.objectData.optionalTemplateFileName) {
                if (this.objectData.optionalTemplateFileName.includes(',')) {
                    let listoptional = this.objectData.optionalTemplateFileName.split(',');
                    listoptional.forEach(i => {
                        if (this.fileTemplate.requestFileDefinition.name == i) {
                            this.backgroundColor = 'rgb(151 227 146 / 70%);';
                            this.boxShadow = '#b6ebb2 0px 2px 5px, rgb(0 0 0 / 12%) 0px 2px 10px !important;';
                        }
                    });
                } else {
                    if (this.fileTemplate.requestFileDefinition.name === this.objectData.optionalTemplateFileName) {
                        this.backgroundColor = 'rgb(151 227 146 / 70%);';
                        this.boxShadow = '#b6ebb2 0px 2px 5px, rgb(0 0 0 / 12%) 0px 2px 10px !important;';
                    }
                }
            }
            if (this.objectData.defaultTemplateFileName) {
                (this.objectData.defaultTemplateFileName).forEach(i => {
                    if (this.fileTemplate.requestFileDefinition.name == i) {
                        this.backgroundColor = 'aliceblue;';
                        this.boxShadow = 'aliceblue 0px 2px 5px, rgb(0 0 0 / 12%) 0px 2px 10px !important;';
                    }
                });
            }
        }

        if (evt.dataField === 'docTitle') {
            if (evt.row.data.requestFileDefinition.labelEditable === false) {
                evt.editorOptions.readOnly = true;
            } else if (evt.row.data.requestFileDefinition.labelEditable === true) {
                evt.editorOptions.readOnly = false;
            }
        }
        if (evt.dataField === 'docId') {
            if (evt.row.data.requestFileDefinition.idRegex !== null &&
                evt.row.data.requestFileDefinition.idRegex !== undefined &&
                evt.row.data.requestFileDefinition.idRegex !== {} &&
                evt.row.data.requestFileDefinition.idRegex !== '') {
                evt.validationRules = [{
                    type: 'pattern',
                    message: this.massageExpressionRegulier,
                    pattern: evt.row.data.requestFileDefinition.idRegex
                }];
            }
        }


        if (evt.dataField === 'docExpirationDate') {
            if (evt.row.data.requestFileDefinition.hasExpirationDate === 'Notapplicable') {
                evt.editorOptions.readOnly = true;
            }
        }

        if (evt.dataField === 'docIssueDate') {
            if (evt.row.data.requestFileDefinition.hasIssueDate === 'Notapplicable') {
                evt.editorOptions.readOnly = true;
            }
        }

        if (evt.dataField === 'issueAdress') {
            if (evt.row.data.requestFileDefinition.hasIssueAdress === 'Notapplicable') {
                evt.editorOptions.readOnly = true;
            }
        }

        if (evt.dataField === 'docIssueDate') {
            this.minDateExpiration = evt.value;
        }
        // }
    }

    creatingIcon(icon) {
        if (icon !== null && icon !== undefined && icon !== "" && icon !== {})
            return "fa " + icon
    }

    /*prepare edit for edit dto */


    /***********************************download state*/
    isDownloadFileVisibe(e) {
        return e.row.data.docSize != null && this.canDonwloadfile;
    }

    /***********************************download state*/


    /*****************************************delete state*/
    istrashIconVisibe(e) {

        return e.row.data.locked == false && this.ContainerViewer && this.canDelete;
    }

    /*****************************************upload state*/
    isuploadVisibe(e) {
        return e.row.data.locked == false && this.ContainerViewer && this.canUploadfile;
    }

    /*****************************************delete state*/


    /******************************************clonestate*/
    iscloneIconVisibe(e) {
        return e.row.data.docSize != null && this.ContainerViewer && this.canClone;
    }

    /*********************************LOCKED /unlocked  STATE*/
    isunlockIconVisibe(e) {
        this.canUnLock = e.row.data.canUnLock;
        return e.row.data.locked == true && this.canUnLock == true && this.ContainerViewer && this.canlock;
    }


    islockIconVisibe(e) {
        return e.row.data.locked == false && this.ContainerViewer && this.canlock;
    }

    /*********************************LOCKED /unlocked  STATE*/


    /*TRANSFERABLE/untransferable FIRST STATE*/
    istransferableIconVisibe(e) {
        return e.row.data.transferable == true && this.ContainerViewer && e.row.data.docSize != null && this.canTransfert;
    }

    ShowIConBOolean: boolean[] = [];

    ShowICON(rowIndex) {
        this.ShowIConBOolean[rowIndex] = true
    }


    isuntransferableIconVisibe(e) {
        return e.row.data.transferable == false && this.ContainerViewer && e.row.data.docSize != null && this.canTransfert;
    }

    /*TRANSFERABLE/untransferable FIRST STATE*/

    //VISIBLE TO MODIF FILE IN DISK

    /*visible to show all the other types*/
    isVisible(e) {
        if (e.row.data.fileName != null && e.row.data.fileName != undefined) {
            const fileType = e.row.data.filesTypeDTO.type;
            if (fileType === "application/json" || fileType === "text/plain" || fileType === "image/jpeg" ||
                fileType === "image/png" || fileType === "image/gif" || fileType === "image/tiff" || fileType === "image/bmp" ||
                fileType === "image/svg+xml" || fileType === "application/pdf") {
                return e.row.data.fileType && e.row.data.fileType != "application/pdf" && e.row.data.docSize != null && this.canShowfile;
            } else return false
        } else return false
    }

    /*visible to show all the other types*/

    /*visible to show pdf viewer to action pdf*/
    isactionPdf(e) {
        return e.row.data.fileType && e.row.data.fileType === "application/pdf" && e.row.data.docSize != null && this.canActionPDF;
    }

    /*visible to show pdf viewer to action pdf*/

    //VISIBLE TO MODIF FILE IN DISK
    isAttachmentExist(data) {
        this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
        return data.row.data.fileType && data.row.data.docSize != null && this.canModiffile && this.pstkEnabledAndRunning && this.authorizationTokenOffice;
    }

    //VISIBLE TO MODIF FILE IN DISK

    /*Display Icon in data grid from filename */
    getdefaultlabel(data: any, title: string) {
        let rslt

        if (data === true) {
            this.translateService.get("ATTACHEMENT.getdefaultlabelOfFileTypeScan", {value: title.substring(title.lastIndexOf('.') + 1, title.length)}).subscribe((res) => {
                rslt = res
            })
        } else if (data === false || data == null) {
            this.translateService.get("ATTACHEMENT.getdefaultlabelOfFileTypeRatcher", {value: title.substring(title.lastIndexOf('.') + 1, title.length)}).subscribe((res) => {
                rslt = res
            })
        }
        return rslt;
    }

    /*Display Icon in data grid from filename */


    /*Display Icon from filedto label*/
    displayScannedTitle(data: any, title) {
        let rslt
        if (title != null) {
            if (data === true) {
                this.translateService.get("ATTACHEMENT.getdefaultlabelOfFileTypeScan", {value: title}).subscribe((res) => {
                    rslt = res
                })
            } else if (data === false || data == null) {
                this.translateService.get("ATTACHEMENT.getdefaultlabelOfFileTypeRatcher", {value: title}).subscribe((res) => {
                    rslt = res
                })
            }
        } else {
            if (data === true)
                return this.translateService.get("ATTACHEMENT.fileScanner").subscribe((res) => {
                    rslt = res
                });
            else if (data === false || data == null)
                this.translateService.get("ATTACHEMENT.fileRattached").subscribe((res) => {
                    rslt = res
                });
        }
        return rslt
    }

    // /*Display Icon from filedto label*/
    //
    // /*Display Signature Icon*/
    // displaySignedDateTitleDev(data: any) {
    //     this.translateService.get("ATTACHEMENT.signed").subscribe((res) => {
    //         if (data != null)
    //             return res + this.formatDate.formatDFshort(data);
    //     })
    // }
    //
    // /*Display Signature Icon*/


    /*CLONED*/
    cloned(e) {
        let jsonFile = e.row.data
        let paramsHttp = new HttpParamMethodPutNEwFormat(this.env.apiUrlkernel + "AttachmentCloned/" + jsonFile.id + "?fileAccessToken=" + this.fileAccessToken, jsonFile)
        this.Ref.value = jsonFile.docTitle

        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.cloned", "ATTACHEMENT.clonelError").then(data => {
            // if (data["statut"] == true) {
            this.refresh();
            // }
        })
    }

    /*CLONED*/

    /*LOCKED*/
    lockFile(e) {
        let jsonFile = e.row.data
        jsonFile.locked = true
        jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;
        this.Ref.value = jsonFile.docTitle

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.locked", "ATTACHEMENT.lockedError").then(data => {
            // if (data["statut"] == true) {
            this.refresh();
            // }
        })
    }

    /*LOCKED*/

    /*Unlocked*/

    unlockFile(e) {
        let jsonFile = e.row.data
        jsonFile.locked = false;
        jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;
        this.Ref.value = jsonFile.docTitle

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.Unlocked", "ATTACHEMENT.UnlockedError").then(data => {
            // if (data["statut"] == true) {
            this.refresh();
            // }
        })
    }

    /*Unlocked*/

    /*unTRANSFERABLE*/
    Untransferable(e) {
        let jsonFile = e.row.data;
        jsonFile.transferable = false;
        jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;
        this.Ref.value = jsonFile.docTitle

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.UnTransferable", "ATTACHEMENT.UnTransferableError").then(data => {
            // if (data["statut"] == true) {
            this.refresh();
            // }
        })
    }

    /*unTRANSFERABLE*/

    /*TRANSFERABLE*/
    transferable(e) {
        let jsonFile = e.row.data;
        jsonFile.transferable = true;
        jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;
        this.Ref.value = jsonFile.docTitle

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.Transferable", "ATTACHEMENT.TransferableError").then(data => {
            // if (data["statut"] == true) {
            this.refresh();
            // }
        })
    }

    /*TRANSFERABLE*/


    /*Modif File with pctk*/
    async openOption(e, data) {
        this.loadingVisible = true
        let authorizationtokenOffice = await this.communService.authorizationToken(this.ModuleOffice)


        try {
            if (e.itemData.id == 1) {
                this.base64 = null
                this.fileservice.extractfileByIdJson(data.id, this.fileAccessToken).subscribe((response: any) => {
                    this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(response));
                    this.fileservice.openFileForEdit(authorizationtokenOffice, data.fileName, data.classId + '_' + data.objectId + '_' + data.docTitle, this.base64).then(res => {
                        this.checkIfFileExist(e, data)
                        this.Ref.value = data.fileName

                        this.translateService.get("ATTACHEMENT.ModifFile", this.Ref).subscribe((res) => {
                            this.toastr.success(res, "", {
                                closeButton: true,
                                positionClass: 'toast-top-right',
                                extendedTimeOut: this.env.extendedTimeOutToastr,
                                progressBar: true,
                                disableTimeOut: false,
                                timeOut: this.env.timeOutToastr
                            })
                        })
                        this.loadingVisible = false
                    }, err => {
                        this.Ref.value = data.fileName

                        this.translateService.get("ATTACHEMENT.ModifFileEchec", this.Ref).subscribe((res) => {
                            this.toastr.error(err.stack, res, {
                                closeButton: true,
                                positionClass: 'toast-top-right',
                                extendedTimeOut: this.env.extendedTimeOutToastr,
                                progressBar: true,
                                disableTimeOut: false,
                                timeOut: this.env.timeOutToastr
                            })
                        })
                        this.loadingVisible = false
                    })
                }, error => {
                    this.Ref.value = data.fileName

                    this.translateService.get("ATTACHEMENT.getbyid", this.Ref).subscribe((res) => {
                        this.toastr.error("", res, {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                    })
                    this.loadingVisible = false
                })
            } else if (e.itemData.id == 2) {
                let enableDelete
                if (this.fileBusy === false)
                    enableDelete = true
                else
                    enableDelete = false
                this.fileservice.SaveFileAfterEdit(authorizationtokenOffice, data.fileName, data.classId + '_' + data.objectId + '_' + data.docTitle, enableDelete).then(async (res) => {
                    let responseBase64 = await res.result.Base64contents
                    let arraybuffer = this.communService.base64ToArrayBuffer(responseBase64);
                    let fileContent = new File([arraybuffer], data.fileName, {type: data.fileType});

                    let obj = new FormData()
                    obj.append("multipartFiles", fileContent)
                    if (data.cmisId != null && data.cmisId != undefined)
                        obj.append("cmisId", data.cmisId)
                    if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null)
                        obj.append("objectData", JSON.stringify(this.objectData));
                    if ((this.objectData) != undefined && (this.objectData) != null && (this.objectData).securiteLevel != null && (this.objectData).securiteLevel != undefined)
                        obj.append("objectDatasecuriteLevel", (this.objectData).securiteLevel);
                    this.Ref.value = data.docTitle

                    let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + 'attachementsSetContent/' + data.id + '?fileAccessToken=' + this.fileAccessToken, obj)
                    this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.save_delete", "ATTACHEMENT.save_deleteMAJfailed").then(data => {
                        // if (data["statut"] == true) {
                        this.refresh();
                        // }
                        this.loadingVisible = false
                    })
                }, err => {
                    this.Ref.value = this.fileName

                    this.translateService.get("ATTACHEMENT.SaveAfterEditError", this.Ref).subscribe((res) => {
                        this.toastr.error(res, '', {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                    })
                    this.loadingVisible = false
                })
            } else if (e.itemData.id == 3) {
                this.base64 = null
                this.fileservice.extractfileByIdJson(data.id, this.fileAccessToken).subscribe((response: any) => {
                    this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(response));
                    this.fileservice.docXToPdf(authorizationtokenOffice, data.fileName, data.classId + '_' + data.objectId + '_' + data.docTitle, this.base64).then(res => {

                        const namefile = data.fileName.split(".")
                        let pdfFile = namefile[0] + '.pdf';

                        const byteArray = new Uint8Array(atob(res.result.Base64contents).split('').map(char => char.charCodeAt(0)));
                        let fileContent = new File([byteArray], pdfFile, {type: "application/pdf"});

                        let obj = new FormData()
                        obj.append("multipartFiles", fileContent)

                        this.fileservice.ClonedDocXToPdf(data.id, obj, this.fileAccessToken).subscribe((response: any) => {
                            this.Ref.value = data.fileName

                            this.translateService.get("ATTACHEMENT.NewDocxToPDFFile", this.Ref).subscribe((res) => {
                                this.toastr.success(res, "", {
                                    closeButton: true,
                                    positionClass: 'toast-top-right',
                                    extendedTimeOut: this.env.extendedTimeOutToastr,
                                    progressBar: true,
                                    disableTimeOut: false,
                                    timeOut: this.env.timeOutToastr
                                })
                            })
                            this.refresh();
                            this.loadingVisible = false
                        }, err => {
                            this.Ref.value = data.fileName

                            this.translateService.get("ATTACHEMENT.NewDocxToPDFEchec", this.Ref).subscribe((res) => {
                                this.toastr.error(err.stack, res, {
                                    closeButton: true,
                                    positionClass: 'toast-top-right',
                                    extendedTimeOut: this.env.extendedTimeOutToastr,
                                    progressBar: true,
                                    disableTimeOut: false,
                                    timeOut: this.env.timeOutToastr
                                })
                            })
                            this.loadingVisible = false
                        })
                    }, err => {
                        this.Ref.value = data.fileName

                        this.translateService.get("ATTACHEMENT.DocxToPDFEchec", this.Ref).subscribe((res) => {
                            this.toastr.error(err.stack, res, {
                                closeButton: true,
                                positionClass: 'toast-top-right',
                                extendedTimeOut: this.env.extendedTimeOutToastr,
                                progressBar: true,
                                disableTimeOut: false,
                                timeOut: this.env.timeOutToastr
                            })
                        })
                        this.loadingVisible = false
                    })
                }, error => {
                    this.Ref.value = data.fileName

                    this.translateService.get("ATTACHEMENT.getbyid", this.Ref).subscribe((res) => {
                        this.toastr.error(res, "", {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                    })
                    this.loadingVisible = false
                })
            }
        } catch (error) {
            this.Ref.value = data.fileName

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

    /*Modif File with pctk*/

    /*check If File Exist sur disq && open sur editor */

    async checkIfFileExist(e, data) {
        let authorizationtokenOffice = await this.communService.authorizationToken(this.ModuleOffice)


        let lockedfile = false
        if (data.locked == true)
            lockedfile = true
        this.fileservice.checkIfFileExist(authorizationtokenOffice, data.fileName, data.classId + '_' + data.objectId + '_' + data.docTitle).then(async (res) => {
            if (res.result.codeError === "PSTK_44") {/*    "PSTK_44": "No such file Exist!", === Deleted FALSE */
                this.disabledSaved = true


                const fileType = data.filesTypeDTO.type
                //all word file mime type
                if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                    fileType === "application/msword" ||
                    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.template" ||
                    fileType === "application/vnd.ms-word.template.macroEnabled.12") {
                    this.translateService.get(["ATTACHEMENT.open", "ATTACHEMENT.recu&sup", "ATTACHEMENT.generatepdf"]).subscribe((res) => {
                        let itemTitle = res
                        this.itemsList = [
                            {
                                id: 1,
                                text: itemTitle["ATTACHEMENT.open"],
                                icon: 'fas fa-arrow-circle-down',
                                disabled: false,
                                template: 'itemFileNotModif'
                            },
                            {
                                id: 2,
                                text: itemTitle["ATTACHEMENT.recu&sup"],
                                icon: 'fas fa-arrow-circle-up',
                                disabled: this.disabledSaved || lockedfile || !this.ContainerViewer,
                                template: 'itemNotRecuSupp'
                            },
                            {
                                id: 3,
                                text: itemTitle["ATTACHEMENT.generatepdf"], icon: 'fa fa-file-pdf-o'
                            }
                        ];
                    })
                } else {
                    this.translateService.get(["ATTACHEMENT.open", "ATTACHEMENT.recu&sup", "ATTACHEMENT.generatepdf"]).subscribe((res) => {
                        let itemTitle = res
                        this.itemsList = [
                            {
                                id: 1,
                                text: itemTitle["ATTACHEMENT.open"],
                                icon: 'fas fa-arrow-circle-down',
                                disabled: false,
                                template: 'itemFileNotModif'
                            },
                            {
                                id: 2,
                                text: itemTitle["ATTACHEMENT.recu&sup"],
                                icon: 'fas fa-arrow-circle-up',
                                disabled: this.disabledSaved || lockedfile || !this.ContainerViewer,
                                template: 'itemNotRecuSupp'
                            }
                        ];
                    })
                }
                e.component.option('items', this.itemsList)
            } else if (res.result.codeError === "PSTK_45") {/*    "PSTK_45": "File Exist", === deleted TRUE */
                this.disabledSaved = false

                const fileType = data.filesTypeDTO.type
                //all word file mime type
                if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                    fileType === "application/msword" ||
                    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.template" ||
                    fileType === "application/vnd.ms-word.template.macroEnabled.12") {
                    this.translateService.get(["ATTACHEMENT.open", "ATTACHEMENT.recu&sup", "ATTACHEMENT.generatepdf"]).subscribe((res) => {
                        let itemTitle = res
                        this.itemsList = [
                            {
                                id: 1,
                                text: itemTitle["ATTACHEMENT.open"],
                                icon: 'fas fa-arrow-circle-down',
                                disabled: false,
                                template: 'itemFileNotModif'
                            },
                            {
                                id: 2,
                                text: itemTitle["ATTACHEMENT.recu&sup"],
                                icon: 'fas fa-arrow-circle-up',
                                disabled: false || lockedfile || !this.ContainerViewer,
                                template: 'itemNotRecuSupp'
                            },
                            {
                                id: 3,
                                text: itemTitle["ATTACHEMENT.generatepdf"],
                                icon: 'fa fa-file-pdf-o'
                            }
                        ];
                    })
                } else {
                    this.translateService.get(["ATTACHEMENT.open", "ATTACHEMENT.recu&sup", "ATTACHEMENT.generatepdf"]).subscribe((res) => {
                        let itemTitle = res
                        this.itemsList = [
                            {
                                id: 1,
                                text: itemTitle["ATTACHEMENT.open"],
                                icon: 'fas fa-arrow-circle-down',
                                disabled: false,
                                template: 'itemFileNotModif'
                            },
                            {
                                id: 2,
                                text: itemTitle["ATTACHEMENT.recu&sup"],
                                icon: 'fas fa-arrow-circle-up',
                                disabled: false || lockedfile || !this.ContainerViewer,
                                template: 'itemNotRecuSupp'
                            }
                        ];
                    })
                }
                this.fileservice.extractfileByIdJson(data.id, this.fileAccessToken).subscribe((response: any) => {
                    this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(response));
                    this.fileservice.checkIfFileBusy(authorizationtokenOffice, data.fileName, data.classId + '_' + data.objectId + '_' + data.docTitle, this.base64).then
                    (() => {
                        this.fileBusy = false
                        const fileType = data.filesTypeDTO.type
                        //all word file mime type
                        if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                            fileType === "application/msword" ||
                            fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.template" ||
                            fileType === "application/vnd.ms-word.template.macroEnabled.12") {
                            this.translateService.get(["ATTACHEMENT.open", "ATTACHEMENT.recu&sup", "ATTACHEMENT.generatepdf"]).subscribe((res) => {
                                let itemTitle = res
                                this.itemsList = [
                                    {
                                        id: 1,
                                        text: itemTitle["ATTACHEMENT.open"],
                                        icon: 'fas fa-arrow-circle-down',
                                        disabled: this.fileBusy,
                                        template: 'itemModif'
                                    },
                                    {
                                        id: 2,
                                        text: itemTitle["ATTACHEMENT.recu&sup"],
                                        icon: 'fas fa-arrow-circle-up',
                                        disabled: false || lockedfile || !this.ContainerViewer,
                                        template: 'itemNotRecuSupp'
                                    },
                                    {
                                        id: 3,
                                        text: itemTitle["ATTACHEMENT.generatepdf"],
                                        icon: 'fa fa-file-pdf-o'
                                    }
                                ];
                            })
                        } else {
                            this.translateService.get(["ATTACHEMENT.open", "ATTACHEMENT.recu&sup", "ATTACHEMENT.generatepdf"]).subscribe((res) => {
                                let itemTitle = res
                                this.itemsList = [
                                    {
                                        id: 1,
                                        text: itemTitle["ATTACHEMENT.open"],
                                        icon: 'fas fa-arrow-circle-down',
                                        disabled: this.fileBusy,
                                        template: 'itemModif'
                                    },
                                    {
                                        id: 2,
                                        text: itemTitle["ATTACHEMENT.recu&sup"],
                                        icon: 'fas fa-arrow-circle-up',
                                        disabled: false || lockedfile || !this.ContainerViewer,
                                        template: 'itemNotRecuSupp'
                                    }
                                ];
                            })
                        }
                    }, () => {
                        this.fileBusy = true
                        const fileType = data.filesTypeDTO.type
                        //all word file mime type
                        if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                            fileType === "application/msword" ||
                            fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.template" ||
                            fileType === "application/vnd.ms-word.template.macroEnabled.12") {
                            this.translateService.get(["ATTACHEMENT.open", "ATTACHEMENT.recu&sup", "ATTACHEMENT.generatepdf"]).subscribe((res) => {
                                let itemTitle = res
                                this.itemsList = [
                                    {
                                        id: 1,
                                        text: itemTitle["ATTACHEMENT.open"],
                                        icon: 'fas fa-arrow-circle-down',
                                        disabled: this.fileBusy,
                                        template: 'itemFileNotModif'
                                    },
                                    {
                                        id: 2,
                                        text: itemTitle["ATTACHEMENT.recu&sup"],
                                        icon: 'fas fa-arrow-circle-up',
                                        disabled: false || lockedfile || !this.ContainerViewer,
                                        template: 'itemRecuSupp'
                                    },
                                    {
                                        id: 3,
                                        text: itemTitle["ATTACHEMENT.generatepdf"],
                                        icon: 'fa fa-file-pdf-o'
                                    }
                                ];
                            })
                        } else {
                            this.translateService.get(["ATTACHEMENT.open", "ATTACHEMENT.recu&sup", "ATTACHEMENT.generatepdf"]).subscribe((res) => {
                                let itemTitle = res
                                this.itemsList = [
                                    {
                                        id: 1,
                                        text: itemTitle["ATTACHEMENT.open"],
                                        icon: 'fas fa-arrow-circle-down',
                                        disabled: this.fileBusy,
                                        template: 'itemFileNotModif'
                                    },
                                    {
                                        id: 2,
                                        text: itemTitle["ATTACHEMENT.recu&sup"],
                                        icon: 'fas fa-arrow-circle-up',
                                        disabled: false || lockedfile || !this.ContainerViewer,
                                        template: 'itemRecuSupp'
                                    }
                                ];
                            })
                        }
                    });
                    e.component.option('items', this.itemsList)
                }, error => {
                    this.Ref.value = data.fileName

                    this.translateService.get("ATTACHEMENT.getbyid", this.Ref).subscribe((res) => {
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
                })
            }
        }, err => {
            this.disabledSaved = true
            this.translateService.get("ATTACHEMENT.checkIfFileExistError").subscribe((res) => {
                this.toastr.error(err.stack, res, {
                    closeButton: true,
                    positionClass: 'toast-top-right',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                })
            })
            this.loadingVisible = false

        })
    }

    async viewFileInNGOnChange(data, ShowPopupBoolean) {
        console.log("data", data)
        this.loadingVisible = true;

        this.fileName = data.fileName;
        this.filebyId = data;

        this.id = data.id;
        this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'

        this.closeViwerPopUp();
        if (data.signed === true && data.locked === false && this.pstkEnabledAndRunning) {
            this.avertismentPopUp = ShowPopupBoolean;
        }
        this.idFileViewer = data.id
        this.idcmis = data.cmisId
        this.fileType = data.fileType
        if (this.idFileViewer != null) {

            try {
                let verifLicensePSTKScan: any
                let verifLicensePSTKSign: any

                this.fileservice.extractfileByIdJson(this.idFileViewer, this.fileAccessToken).subscribe(async (response: any) => {
                    if (this.fileType) {
                        this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(response));
                        if (this.fileType == 'application/pdf') {
                            this.permissionToTopViewer = true;
                            verifLicensePSTKScan = await this.communService.verifLicensePSTK(this.ModuleScan)
                            this.permissionDenied = data.locked == false && this.ContainerViewer && this.pstkEnabledAndRunning && verifLicensePSTKScan;
                            verifLicensePSTKSign = await this.communService.verifLicensePSTK(this.ModuleSign);
                            this.permissionDeniedSig = (this.ContainerViewer && this.pstkEnabledAndRunning && verifLicensePSTKSign);
                        } else {
                            this.permissionToTopViewer = false;
                        }
                        let blobFile = new Blob([new Uint8Array(response)], {type: this.fileType});
                        var fileURL = URL.createObjectURL(blobFile);
                        this.jsondocviewer.visionneuse = 'url';
                        this.jsondocviewer.pdfSrcc = fileURL
                        this.jsondocviewerEventFromGrid.emit(this.jsondocviewer)
                        if (this.fileType === 'application/pdf' && this.pstkEnabledAndRunning && verifLicensePSTKScan) {
                            let authorizationtokenScan = await this.communService.authorizationToken(this.ModuleScan)

                            this.fileservice.getpageNbre(authorizationtokenScan, this.base64).then(res => {
                                this.pgNbr = res.result.totalpage;
                                this.loadingVisible = false;
                                this.visibleTrueModal = ShowPopupBoolean;
                            }, err => {
                                this.loadingVisible = false;
                                this.visibleTrueModal = ShowPopupBoolean;
                            });
                        } else {
                            this.loadingVisible = false
                            this.visibleTrueModal = ShowPopupBoolean
                        }

                    }
                }, error => {
                    this.Ref.value = data.fileName

                    this.translateService.get("ATTACHEMENT.getbyid", this.Ref).subscribe((res) => {
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
                })
            } catch (error) {
                this.Ref.value = data.fileName

                this.translateService.get("ATTACHEMENT.getbyid", this.Ref).subscribe((res) => {
                    this.toastr.error(res, "", {
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
    }

    /*check If File Exist sur disq && open sur editor */

    /*view file in popup */
    async viewFile(data, ShowPopupBoolean) {
        console.log("data", data)
        this.loadingVisible = true;

        this.fileName = data.row.data.fileName;
        this.filebyId = data.row.data;

        this.id = data.row.data.id;
        this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'

        this.closeViwerPopUp();
        if (data.row.data.signed === true && data.row.data.locked === false && this.pstkEnabledAndRunning) {
            this.avertismentPopUp = ShowPopupBoolean;
        }
        this.idFileViewer = data.row.data.id
        this.idcmis = data.row.data.cmisId
        this.fileType = data.row.data.fileType
        if (this.idFileViewer != null) {

            try {
                let verifLicensePSTKScan: any
                let verifLicensePSTKSign: any

                this.fileservice.extractfileByIdJson(this.idFileViewer, this.fileAccessToken).subscribe(async (response: any) => {
                    if (this.fileType) {
                        this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(response));
                        if (this.fileType == 'application/pdf') {
                            this.permissionToTopViewer = true;
                            verifLicensePSTKScan = await this.communService.verifLicensePSTK(this.ModuleScan)
                            this.permissionDenied = data.row.data.locked == false && this.ContainerViewer && this.pstkEnabledAndRunning && verifLicensePSTKScan;
                            verifLicensePSTKSign = await this.communService.verifLicensePSTK(this.ModuleSign);
                            this.permissionDeniedSig = (this.ContainerViewer && this.pstkEnabledAndRunning && verifLicensePSTKSign);
                        } else {
                            this.permissionToTopViewer = false;
                        }
                        let blobFile = new Blob([new Uint8Array(response)], {type: this.fileType});
                        var fileURL = URL.createObjectURL(blobFile);
                        this.jsondocviewer.visionneuse = 'url';
                        this.jsondocviewer.pdfSrcc = fileURL
                        this.jsondocviewerEventFromGrid.emit(this.jsondocviewer)
                        if (this.fileType === 'application/pdf' && this.pstkEnabledAndRunning && verifLicensePSTKScan) {
                            let authorizationtokenScan = await this.communService.authorizationToken(this.ModuleScan)

                            this.fileservice.getpageNbre(authorizationtokenScan, this.base64).then(res => {
                                this.pgNbr = res.result.totalpage;
                                this.loadingVisible = false;
                                this.visibleTrueModal = ShowPopupBoolean;
                            }, err => {
                                this.loadingVisible = false;
                                this.visibleTrueModal = ShowPopupBoolean;
                            });
                        } else {
                            this.loadingVisible = false
                            this.visibleTrueModal = ShowPopupBoolean
                        }

                    }
                }, error => {
                    this.Ref.value = data.fileName

                    this.translateService.get("ATTACHEMENT.getbyid", this.Ref).subscribe((res) => {
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
                })
            } catch (error) {
                this.Ref.value = data.fileName

                this.translateService.get("ATTACHEMENT.getbyid", this.Ref).subscribe((res) => {
                    this.toastr.error(res, "", {
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
    }

    /*view file in popup */

    /*CLOSE POPUP OF VIEWER */
    closeViwerPopUp() {
        this.visibleTrueModal = false;
        this.base64 = null;
        this.pgNbr = null
        this.fileType = null;
        this.idFileViewer = null
        this.avertismentPopUp = false
        this.permissionDeniedSig = false
        this.permissionDenied = false
        this.permissionToTopViewer = false
    }

    /*CLOSE POPUP OF VIEWER */


    /***************************** save file content *****************************/
    BASE64_Output_Save($event: any) {
        this.loadingVisible = true;
        this.base64 = $event;
        let obj = new FormData();
        if (this.fileContent != null && this.fileContent != undefined) {
            obj.append('multipartFiles', this.fileContent);
        }
        if (this.idcmis != null && this.idcmis != undefined) {
            obj.append('cmisId', this.idcmis);
        }
        if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null) {
            obj.append('objectData', JSON.stringify(this.objectData));
        }
        if ((this.objectData) != undefined && (this.objectData) != null && (this.objectData).securiteLevel != null && (this.objectData).securiteLevel != undefined) {
            obj.append('objectDatasecuriteLevel', (this.objectData).securiteLevel);
        }
        this.Ref.value = this.fileName;

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + 'attachementsSetContent/' + this.idFileViewer + '?fileAccessToken=' + this.fileAccessToken, obj);
        this.httpServicesComponent.method(paramsHttp, this.Ref, 'ATTACHEMENT.save_delete', 'ATTACHEMENT.save_deleteMAJfailed').then(data => {
            this.refresh();

            if (data['statut'] == true) {
                this.closeViwerPopUp();
            }
            this.loadingVisible = false;
        });
    }

    /***************************** save file content *****************************/

    /*reload after save*/
    getBASE64_Output($event: any) {
        this.reloadViewer($event);
    }

    /*reload after save*/

    /*reload file viewer*/
    reloadViewer(base64) {
        let arraybuffer = this.communService.base64ToArrayBuffer(base64);
        this.fileContent = new File([arraybuffer], this.fileName, {type: this.fileType});
        var fileURL = URL.createObjectURL(this.fileContent);
        this.jsondocviewer.pdfSrcc = fileURL;
        this.jsondocviewer.visionneuse = "url";
    }

    /*reload file viewer*/


    /***************************** SIGNATURE PDF*****************************/
    async signedEvent(event) {
        this.fileContent = event
        var fileURL = URL.createObjectURL(this.fileContent);
        this.jsondocviewer.pdfSrcc = fileURL;
        this.jsondocviewer.visionneuse = "url";
    }

    /***************************** SIGNATURE PDF*****************************/

    /*reload file after add water marker */
    updateWaterMarkerrs(event) {
        this.loadingVisible = true
        if (this.idFileViewer != null) {

            try {
                this.fileservice.extractfileByIdJson(this.idFileViewer, this.fileAccessToken).subscribe(async (response: any) => {
                    if (this.fileType) {
                        this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(response));
                        let blobFile = new Blob([new Uint8Array(response)], {type: this.fileType});
                        var fileURL = URL.createObjectURL(blobFile);
                        this.jsondocviewer.visionneuse = 'url';
                        this.jsondocviewer.pdfSrcc = fileURL;
                    }
                    this.loadingVisible = false
                }, error => {
                    this.Ref.value = this.fileName

                    this.translateService.get("ATTACHEMENT.getbyid", this.Ref).subscribe((res) => {
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
                })
            } catch (error) {
                this.loadingVisible = false
                this.Ref.value = this.fileName

                this.translateService.get("ATTACHEMENT.getbyid", this.Ref).subscribe((res) => {
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
    }

    /*reload file after add water marker */

    /*Donwload ZIP FILE*/
    downloadtout() {
        this.loadingVisible = true;
        try {
            let postattachmentDto = new FormData();
            postattachmentDto.append("classId", this.classid);
            postattachmentDto.append("objectId", this.objectid);
            if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null)
                postattachmentDto.append("objectData", JSON.stringify(this.objectData));
            this.fileservice.downloadtous(postattachmentDto, this.fileAccessToken).subscribe((data: any) => {
                    var fileName = data.headers.get('filename')
                    var fileSigned = new File([(data.body)], fileName, {type: "application/octet-stream",});
                    FileSaver.saveAs(fileSigned, fileName);
                    this.loadingVisible = false;
                }, () =>
                    this.translateService.get("ATTACHEMENT.zipFile").subscribe((res) => {
                        this.toastr.error(res, "", {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                        this.loadingVisible = false;
                    })
            )
        } catch (error) {
            this.translateService.get("ATTACHEMENT.zipFile").subscribe((res) => {
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

    /*Donwload ZIP FILE*/


    /*flipped to thumbnail*/
    filpped() {
        this.flipped = !this.flipped;
        this.filppedout.emit(this.flipped)
    }

    /*flipped to thumbnail*/

    /*datagrid attachement prepare*/
    onToolbarPreparinggridfile(e) {
        if (this.ContainerViewer) {
            e.toolbarOptions.items.unshift(
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: 'plus',
                        onClick: this.ouvrirPopUpSaveFunction.bind(this),
                    }
                }
            );
        }
        e.toolbarOptions.items.unshift(
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    hint: 'Rafraîchir',
                    icon: 'refresh',
                    onClick: this.refresh.bind(this)
                }
            },
            // {
            //     location: 'center',
            //     template: 'titreGrid'
            // },

        )
        if (this.isarchiveiconDisabled) {
            e.toolbarOptions.items.unshift(
                {
                    location: 'after',
                    template: 'bouttonarchive'
                },
            );
        }

    }

    ouvrirPopUpSaveFunction() {
        if (this.objectData.remaingRequestFileDefinitions.length == 0) {
            document.getElementById("NewFile").click();
        } else {
            this.ouvrirPopUpSave.emit(true)

        }
    }

    resetGridFile() {
        localStorage.removeItem(this.packageName + '_' + 'gridfile');
        window.location.reload();
    }

    /*datagrid attachement prepare*/

    /*DELETE AND CONFIRME DELETE FILE*/
    Confirmdelete() {
        this.popupDeleteFileVisible = false;
        let paramsHttp = new HttpParamMethodDelete(this.env.apiUrlkernel + "attachementRemove?id=" + this.fileTodelete.id + "&fileAccessToken=" + this.fileAccessToken, '')
        this.Ref.value = this.fileTodelete.docTitle

        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.deleted", "ATTACHEMENT.deleteError").then(data => {
            if (data["statut"] == true) {
                this.refresh();
                // this.newFile.emit(this.fileTemplate);
                this.FileDeletedToAddToremaingFileDefPopup.emit(this.fileTodelete.requestFileDefinition)
            }
        })
    }

    FiletoPush

    deletefile(e: any) {
        this.fileTodelete = e.row.data;
        console.log("fileTodelete", this.fileTodelete.requestFileDefinition)

        this.popupDeleteFileVisible = true;
    }

    /*DELETE AND CONFIRME DELETE FILE*/

    /* open uplad Popup*/
    UploadFileStep1(e: any) {
        this.upladPopUP = true
        this.UploadFile = e.row.data
        this.idFileRemplace = e.row.data.id;
        this.fileName = null
        this.sizeInput = null
    }

    /* open uplad Popup*/


    /*DONWLOAD FILE*/
    downloadFile(dataa: any) {
        try {

            this.loadingVisible = true;
            this.fileservice.extractfileById(dataa.row.data.id, this.fileAccessToken).subscribe(async (data: any) => {
                var fileName = await data.headers.get('filename')
                const f1 = new Blob([(data.body)], {type: dataa.row.data.fileType});
                // window.open(data)
                FileSaver.saveAs(f1, fileName);
                this.loadingVisible = false;
                this.Ref.value = fileName

                this.translateService.get("ATTACHEMENT.extractFileWithSuccess", this.Ref).subscribe((res) => {
                    this.toastr.success(res, "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                }), err =>
                    this.translateService.get("ATTACHEMENT.downloadFileErr", this.Ref).subscribe((res) => {
                        this.toastr.error(res, "", {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                        this.loadingVisible = false;
                    })
            }, err => {
                this.translateService.get("ATTACHEMENT.downloadFileErr", this.Ref).subscribe((res) => {
                    this.toastr.error(res, "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                })
                this.loadingVisible = false
            })
        } catch (error) {
            this.translateService.get("ATTACHEMENT.downloadFileErr", this.Ref).subscribe((res) => {
                this.toastr.error('', res + " ", {
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

    /*DONWLOAD FILE*/


    /*Office*/
    initofficeVisble() {
        return !(this.objectid != null && this.classid != null)
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

    /*office template*/

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
        )
    }

    resetGrid() {
        localStorage.removeItem(this.packageName + '_' + 'gridofficeTempalte');
        window.location.reload();
    }

    async officeTemplateAttach(title, classid, objectid) {
        let mmInbound = this.objectData
        this.loadingVisible = true
        try {
            await this.fileservice.officeTemplateAttach(title, classid, objectid, mmInbound).subscribe(async (res: any) => {
                    this.fileType = res.headers.get('Content-Type')
                    this.fileName = await res.headers.get('filename')
                    this.blobContent = new Blob([(res.body)], {type: this.fileType});
                    this.sizeInput = this.communService.formatBytes(res.body.size);
                    this.fileContent = new File([(res.body)], this.fileName, {type: this.fileType});
                    this.openOfficePopUp = false
                    if (res.body.size > this.env.maxUploadMultiPartFile)/*presq 1MO*/
                    {
                        this.disableSave = true
                        this.translateService.get("ATTACHEMENT.errorMaxSize").subscribe((res) => {
                                this.toastr.error(res + this.communService.formatBytes(this.env.maxUploadMultiPartFile), "", {
                                    closeButton: true,
                                    positionClass: 'toast-top-right',
                                    extendedTimeOut: this.env.extendedTimeOutToastr,
                                    progressBar: true,
                                    disableTimeOut: false,
                                    timeOut: this.env.timeOutToastr
                                })
                            }
                        )
                    } else {
                        this.disableSave = false;
                    }
                    this.Ref.value = this.fileName;
                    this.loadingVisible = false;
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
                }
                , err => {
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

    selelectedRowdata: any;

    /*select value clicked from data grid*/
    /* Dans le cas requestfiledefinition length égal à 0*/
    blobFile;/*FILE CONTENT fron scanned file--> Blob object in angular*/
    maxUploadMultiPartFile = this.env.maxUploadMultiPartFile;
    permissionToScanAction;/*permission FILETO SCAN ACTION PERMISSION*/
    permissionToSigAction;/*permision FOR SIGNATURE ACTION*/
    pdfMimeType = "application/pdf"/*pdf mime type*/

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

    lockedValue = false;/*LOCKED INITAL*/

    saveNewFile() {
        this.loadingVisible = true
        let obj = new FormData()
        if (this.fileContent != null)
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
        if ((this.objectData) != undefined && (this.objectData).securiteLevel != null && (this.objectData).securiteLevel != undefined)
            obj.append("objectDatasecuriteLevel", (this.objectData).securiteLevel);
        if (this.saveFromScanner == true) {
            if ((this.cookieService.get('scannerProfil')) != undefined)
                obj.append("preferenceName", (this.cookieService.get('scannerProfil')));
        }


        obj.append("reqFileDefName", "وثائق أخرى")
        if (this.classid != undefined)
            obj.append("classId", this.classid)
        if (this.objectid != undefined)
            obj.append("objectId", this.objectid)
        let test: any = false
        // obj.append("Public", test)
        obj.append("locked", JSON.stringify(this.lockedValue))
        let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'createAttachement' + "?fileAccessToken=" + this.fileAccessToken, obj)
        this.httpServicesComponent.method(paramsHttp, this.Ref).then(data => {


        })


    }

}



