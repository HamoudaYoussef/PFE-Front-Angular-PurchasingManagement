import {Component, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild} from '@angular/core';
import {AttachementModuleService} from './attachement.module.service';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {EnvService} from '../../../../env.service';
import {CommunFuncService} from './Commun/commun-func.service';
import {HttpServicesComponent} from '../ps-tools/http-services/http-services.component';
import {
    HttpParamMethodDelete,
    HttpParamMethodGetById,
    HttpParamMethodPatch,
    HttpParamMethodPost,
    HttpParamMethodPutNEwFormat
} from '../../../pages/Global/ps-tools/class';
import {FormatDate} from "../shared-service/formatDate";

@Component({
    selector: 'app-attachment',
    templateUrl: './attachment.component.html',
    styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {
    @Input('objectData') objectData/*Model of Get by ID*/
    @Input('URL') URL;
    @Input() withoutviewer: Boolean = false;
    @Input() classid: any;
    @Input() ShowSplitter: Boolean = false;
    @Input() objectid: any;
    @Input() isPublic: any;
    @Input() ReadOnly: Boolean = false;
    @Output() refreshedReqFileDef = new EventEmitter<any>();
    @Input() ModeGridVsThumbnail: boolean = false;/*true === cad thumbnail // false === cad grid */
    requestFileDef = [];
    attachements;
    levelMin
    ContainerViewer
    fileAccessToken = ''
    /*Monitoring Datagrid actions*/
    @Input() canDeleteDatagrid: Boolean = true
    @Input() canlockDatagrid: Boolean = true
    @Input() canUploadfileDatagrid: Boolean = true
    @Input() canTransfertDatagrid: Boolean = true
    @Input() canActionPDFDatagrid: Boolean = true
    @Input() canCloneDatagrid: Boolean = true
    @Input() canDonwloadfileDatagrid: Boolean = true
    @Input() canModiffileDatagrid: Boolean = true
    @Input() canShowfileDatagrid: Boolean = true

    @Output() jsondocviewerEvent = new EventEmitter<any>();
    @Input() archiveButtonVisible: Boolean = true;
    @Input() flipedDatagridButtonVisible: Boolean = true;

    /*Monitoring Datagrid actions*/


    /*Visible column in data grid */
    @Input() visibleCellIndex: Boolean = true
    @Input() visibleCellId: Boolean = false
    @Input() visibleCellFileType: Boolean = true
    @Input() visibleCelldocTitle: Boolean = true
    @Input() visibleCellfileName: Boolean = true
    @Input() visibleCelldocId: Boolean = true
    @Input() visibleCelldocIssueDate: Boolean = false
    @Input() visibleCelldocExpirationDate: Boolean = false
    @Input() visibleCellissueAdress: Boolean = false
    @Input() visibleCelldocSize: Boolean = true
    @Input() visibleCellsysdateUpdated: Boolean = true
    @Input() visibleCellResponsable: Boolean = true
    @Input() visibleCellsecuriteLevel: Boolean = false
    @Input() visibleCellSignedOrLockedState: Boolean = true
    /*Visible column in data grid */
    authorizationTokenScan = false;
    authorizationTokenOffice = false;
    // authorizationTokenSign = false;
    // authorizationTokenMisc = false;
    pstkEnabledAndRunning = false;/*state of pstk capted in application and display avtetissment of pstk in the pdf viewer*/
    /*Module PSTK*/
    ModuleScan = require('./ModulePSTK.json').Module_Scan
    ModuleOffice = require('./ModulePSTK.json').Module_Office;
    ModuleSign = require('./ModulePSTK.json').Module_Sign;
    ModuleMisc = require('./ModulePSTK.json').Module_Misc;
    /*Module PSTK*/
    RefUserName
    @ViewChild(HttpServicesComponent, {static: true}) private httpServicesComponent: HttpServicesComponent;

    constructor(private cookieService: CookieService, private communService: CommunFuncService, private env: EnvService, private toastr: ToastrService, private fileservice: AttachementModuleService, private translateService: TranslateService) {
        if (this.cookieService.get('displayname')) {
            this.RefUserName = {displayName: this.cookieService.get('displayname')};
        } else {
            this.RefUserName = {displayName: 'utilisateur'};
        }
        this.verifLicensePSTKDatagridAttachement()
    }

    listOfficeNotEmpty

    ngOnInit(): void {

        let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'findOfficeTemplate', this.objectData)
        this.httpServicesComponent.method(paramsHttp, '', null, null, false).then(data => {
            if (data["statut"] == true) {
                this.listOfficeNotEmpty = data["value"].length > 0
            }
        })
        // /*FOR JRXML etc .....*/
        // if (this.objectData === undefined || this.objectData === null) {
        //     let id = 15
        //     let url = 'jrxmlTemplate/'
        //      this.http.get(this.env.BackUrl + this.url).subscribe((res) => {
        //             if (res != undefined) {
        //                 this.objectData =res
        //             }
        //         }
        //     )
        // }

    }


    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (changes['objectData'] && changes['objectData'].previousValue != changes['objectData'].currentValue) {
            if (this.objectData != null) {
                if (this.objectData.remaingRequestFileDefinitions)
                    this.requestFileDef = this.objectData.remaingRequestFileDefinitions
                if (this.objectData.attachements)
                    this.attachements = this.objectData.attachements
                else
                    this.refresh()
                if (this.objectData.securiteLevel != undefined)
                    this.levelMin = this.objectData.securiteLevel
                if (this.objectData.fileAccessToken != undefined)
                    this.fileAccessToken = this.objectData.fileAccessToken
            }
            // if (changes['ReadOnly'] && changes['ReadOnly'].previousValue != changes['ReadOnly'].currentValue) {
            if (this.isPublic && !this.ReadOnly)
                this.ContainerViewer = true
            else if (this.isPublic && this.ReadOnly)
                this.ContainerViewer = false
            else if (this.ReadOnly === null || !this.ReadOnly)
                this.ContainerViewer = (this.GetPermession() == 'WRITE' && (this.GetuserPermission() == 'WRITE' || this.GetuserPermission() == 'INH_WRITE'))
            else if (this.ReadOnly)
                this.ContainerViewer = false
            // }
        }
    }

    /*refresh get by id*/
    refresh() {
        this.getfilesByClassIdAndObjectId(this.classid, this.objectid, this.fileAccessToken)
    }

    /*GET BY OBJECT IF AND CLASS ID*/
    getfilesByClassIdAndObjectId(classeid, objectid, fileAccessToken) {
        this.fileservice.getfilesByClassIdAndObjectId(classeid, objectid, fileAccessToken).subscribe((data: []) => {
            this.attachements = data
        }, () => {
            this.attachements = []

        })
    }

    /*GET BY OBJECT IF AND CLASS ID*/
    GetPermession() {
        let permerssionMode = false
        let permession: PermissionmMode
        if (this.objectData && this.objectData.components)
            permession = this.objectData.components.find(({name}) => name === 'AttachmentComponent');
        if (permession)
            return permession.mode
        else return permerssionMode;
    }

    GetuserPermission() {
        return this.objectData.userPermission
    }

    refreshedReqFileDef2

    /*REFRESH GRID OF ATTACHEMENT */
    refreshDataGrid(e) {
        console.log("ereeereee", e)
        console.log("requestFileDefbeforeChange", this.requestFileDef)

        const indexElement = this.requestFileDef.findIndex((b) => b.docTitle === e.docTitle);

        if (indexElement !== -1) {
            this.requestFileDef.splice(indexElement, 1);

        }
        // this.refreshedReqFileDef.emit(true)/*getbyid*/
        this.popUpSave = false
        this.refreshedReqFileDef2 = e
        console.log("requestFileDefAfterChange", this.requestFileDef)
    }

    /*thubnail*/

    changeFlipped(e) {
        this.ModeGridVsThumbnail = e;
        this.refresh()
    }

    popUpSave = false

    jsondocviewerEventFunctionAttatchment(e) {
        this.jsondocviewerEvent.emit(e)
    }

    async ouvrirPopUpSave(e) {
        if (e == true) {/*&& this.attachements && this.attachements.length>0*/
            this.popUpSave = true;
            let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan)
            this.authorizationTokenScan = verifLicensePSTKScan
        }
    }

    selectedLicensepstk;

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
            this.authorizationTokenScan = false;
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
            if (this.cookieService.get('selectedLicensepstk') != ''
                && this.cookieService.get('selectedLicensepstk') != undefined && this.cookieService.get('selectedLicensepstk') != null
                && this.cookieService.get('selectedLicensepstk') != 'undefined' && this.cookieService.get('selectedLicensepstk') != 'null')
                this.selectedLicensepstk = this.cookieService.get('selectedLicensepstk');

            if ((this.cookieService.get(this.ModuleScan) === 'undefined'
                    || this.cookieService.get(this.ModuleScan) === undefined
                    || this.cookieService.get(this.ModuleScan) === '')
                &&
                (this.cookieService.get(this.ModuleOffice) === 'undefined'
                    || this.cookieService.get(this.ModuleOffice) === undefined
                    || this.cookieService.get(this.ModuleOffice) === '')) {
                if (this.selectedLicensepstk === 'Machine') {
                    // return new Promise(async (resolve) => {
                    await this.fileservice.checkPSTK(defaultPort, null, null, null, null).subscribe(async (res: any) => {
                        if (res.result.Module.Module_Scan) {
                            this.authorizationTokenScan = true;
                        } else if (res.result.Module.Module_Office) {
                            this.authorizationTokenOffice = true;
                        }
                    });
                    // }).then(res => {
                    //     return res;
                    // })
                } else if (this.selectedLicensepstk === 'Serveur') {
                    let authorizationtokenScan
                    let authorizationtokenOffice
                    await this.fileservice.getToken(this.ModuleScan).then(
                        (res: any) => {
                            if (res && res.res.body.authorizationToken) {
                                authorizationtokenScan = res.res.body.authorizationToken;
                            }
                        }, (error) => {
                            // console.error(error);
                            authorizationtokenScan = null;
                        }
                    );
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
                    await this.fileservice.checkPSTK(defaultPort, null, authorizationtokenScan, null, authorizationtokenOffice).subscribe((res: any) => {
                            // if (res.result.Module.Module_Misc) {
                            //     this.authorizationTokenMisc = true;
                            // }
                            // if (res.result.Module.Module_Sign) {
                            //     this.authorizationTokenSign = true;
                            // }
                            if (res.result.Module.Module_Office)
                                this.authorizationTokenOffice = true;
                            if (res.result.Module.Module_Scan) {
                                this.authorizationTokenScan = true;
                            }
                        }
                    )
                }
            } else if (this.cookieService.get(this.ModuleOffice) != 'undefined'
                && this.cookieService.get(this.ModuleOffice) != undefined
                && this.cookieService.get(this.ModuleOffice) != '') {
                if (this.selectedLicensepstk === 'Machine') {
                    // return new Promise(async (resolve) => {
                    await this.fileservice.checkPSTK(defaultPort, null, null, null, null).subscribe(async (res: any) => {
                        if (res.result.Module.Module_Scan) {
                            this.authorizationTokenScan = true;
                        } else if (res.result.Module.Module_Office) {
                            this.authorizationTokenOffice = true;
                        }
                    });
                    // }).then(res => {
                    //     return res;
                    // })
                } else if (this.selectedLicensepstk === 'Serveur') {
                    let authorizationtokenScan
                    let authorizationtokenOffice
                    await this.fileservice.getToken(this.ModuleScan).then(
                        (res: any) => {
                            if (res && res.res.body.authorizationToken) {
                                authorizationtokenScan = res.res.body.authorizationToken;
                            }
                        }, (error) => {
                            // console.error(error);
                            authorizationtokenScan = null;
                        }
                    );
                    authorizationtokenOffice = this.cookieService.get(this.ModuleOffice);

                    await this.fileservice.checkPSTK(defaultPort, null, authorizationtokenScan, null, authorizationtokenOffice).subscribe((res: any) => {
                            // if (res.result.Module.Module_Misc) {
                            //     this.authorizationTokenMisc = true;
                            // }
                            // if (res.result.Module.Module_Sign) {
                            //     this.authorizationTokenSign = true;
                            // }
                            if (res.result.Module.Module_Office)
                                this.authorizationTokenOffice = true;
                            if (res.result.Module.Module_Scan) {
                                this.authorizationTokenScan = true;
                            }
                        }
                    )
                }

            } else if (this.cookieService.get(this.ModuleScan) != 'undefined'
                && this.cookieService.get(this.ModuleScan) != undefined
                && this.cookieService.get(this.ModuleScan) != '') {
                if (this.selectedLicensepstk === 'Machine') {
                    // return new Promise(async (resolve) => {
                    await this.fileservice.checkPSTK(defaultPort, null, null, null, null).subscribe(async (res: any) => {
                        if (res.result.Module.Module_Scan) {
                            this.authorizationTokenScan = true;
                        } else if (res.result.Module.Module_Office) {
                            this.authorizationTokenOffice = true;
                        }
                    });
                    // }).then(res => {
                    //     return res;
                    // })
                } else if (this.selectedLicensepstk === 'Serveur') {
                    let authorizationtokenScan
                    let authorizationtokenOffice

                    authorizationtokenScan = this.cookieService.get(this.ModuleScan);

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
                    await this.fileservice.checkPSTK(defaultPort, null, authorizationtokenScan, null, authorizationtokenOffice).subscribe((res: any) => {
                            // if (res.result.Module.Module_Misc) {
                            //     this.authorizationTokenMisc = true;
                            // }
                            // if (res.result.Module.Module_Sign) {
                            //     this.authorizationTokenSign = true;
                            // }
                            if (res.result.Module.Module_Office)
                                this.authorizationTokenOffice = true;
                            if (res.result.Module.Module_Scan) {
                                this.authorizationTokenScan = true;
                            }
                        }
                    )
                }
            } else {
                let authorizationtokenScan
                let authorizationtokenOffice

                authorizationtokenOffice = this.cookieService.get(this.ModuleOffice);
                authorizationtokenScan = this.cookieService.get(this.ModuleScan);

                await this.fileservice.checkPSTK(defaultPort, null, authorizationtokenScan, null, authorizationtokenOffice).subscribe((res: any) => {
                        // if (res.result.Module.Module_Misc) {
                        //     this.authorizationTokenMisc = true;
                        // }
                        // if (res.result.Module.Module_Sign) {
                        //     this.authorizationTokenSign = true;
                        // }
                        if (res.result.Module.Module_Office)
                            this.authorizationTokenOffice = true;
                        if (res.result.Module.Module_Scan) {
                            this.authorizationTokenScan = true;
                        }
                    }
                )
            }
        }

    }

    RecalFileTodelete(e: any) {
        if (e.name != this.env.docPardefaut)
            this.requestFileDef.push(e)


    }
}


export class PermissionmMode {
    name
    mode
}
