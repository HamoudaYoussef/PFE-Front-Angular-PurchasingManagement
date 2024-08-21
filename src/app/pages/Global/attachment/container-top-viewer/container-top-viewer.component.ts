import {Component, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {EnvService} from 'src/env.service';
import {FormBuilder} from '@angular/forms';
import {HttpParamMethodGet, HttpParamMethodPatch} from '../../ps-tools/class';
import {HttpServicesComponent} from '../../ps-tools/http-services/http-services.component';
import {AttachementModuleService} from '../attachement.module.service';
import {CommunFuncService} from '../Commun/commun-func.service';

@Component({
    selector: 'app-container-top-viewer',
    templateUrl: './container-top-viewer.component.html',
    styleUrls: ['./container-top-viewer.component.scss']
})
export class ContainerTopViewerComponent implements OnInit {
    @ViewChild(HttpServicesComponent, {static: true}) private httpServicesComponent: HttpServicesComponent;

    @Output() BASE64_Output_Reload = new EventEmitter<any>();/*reload Base64 */
    @Output() BASE64_Output_Save = new EventEmitter<any>();/*save Base64 */
    @Output() closeModal = new EventEmitter<any>();
    @Output() updateWaterMarker = new EventEmitter();/*close Modal event*/

    @Input() BASE64_Input: any;/*Input file in base 64 */
    @Input() totalpage: any = 1;
    @Input() fileAccessToken

    @Input() PcTkExist;/* Check if pctk exist or not */
    @Input() permissionDeniedSig: any;/*Permission to signed*/
    @Input() permissionDenied: any;/*Permission to action PDF*/
    @Input() permissionToTopViewer;/*PERMISSION FOR Top Viewer */


    @Input() FileNameToSigned: any;/*File name to signed*/
    @Output() fileSigned = new EventEmitter<any>();/*File (object File) signed output*/
    @Input() idAttachement; /*File Name input*/
    @Input() objectData; /*File Name input*/
    @Input() filebyId;

    openPopupWaterMarker = false;
    openPopupOcr = false;
    filigraneInitialParam


    Mindefaultvalue: any = 1;
    Indexvalue: any = 1;
    Indexvalueaux: any;
    loadingVisible: any = false;
    pageIndex: any;
    /*Module PSTK*/
    ModuleScan = require('../ModulePSTK.json').Module_Scan
    enabledOCR = false
    dataSourceLanguage
    /*Module PSTK*/
    WaterMarkerForm = this.fb.group({
        /*pdf water Marker*/
        leftmargin: [''],
        topmargin: [''],
        rotation: [''],
        opacity: [0],
        fontSize: [''],
        content: [''],
        color: [''],
        fontStyle: [''],
        fontFamily: ['']
    });
    selected_Item
    public mask_px = [/\d/, /\d/, ',', /\d/, ' ', 'cm'];
    public mask_deg = [/\d/, /\d/, ' ', ' ', 'Degrés'];
    popupDeleteWaterMarker = false
    ConfirmeOCR = false
    selected
    itemsList = []
    disableOCR = false

    constructor(private env: EnvService, private communService: CommunFuncService, private fb: FormBuilder, private toastr: ToastrService, private cookieService: CookieService, private translateService: TranslateService, private fileservice: AttachementModuleService) {
        this.translateService.get(["ATTACHEMENT.4", "ATTACHEMENT.0", "ATTACHEMENT.1", "ATTACHEMENT.2"]).subscribe((res) => {
            let itemTitle = res
            this.itemsList.push({
                id: 1,
                text: itemTitle["ATTACHEMENT.4"],
                disabled: true,
                color: 'High'

            })
            this.itemsList.push({
                id: 2,
                text: itemTitle["ATTACHEMENT.0"],
                color: 'Low'
            })
            this.itemsList.push({
                id: 3,
                text: itemTitle["ATTACHEMENT.1"],
                color: 'Urgent'
            })
            this.itemsList.push({
                id: 4,
                text: itemTitle["ATTACHEMENT.2"],
                disabled: true,
                color: 'Normal'
            })
        })

        this.selected = this.itemsList[1];
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (changes['filebyId'] && changes['filebyId'].previousValue != changes['filebyId'].currentValue) {
            if (this.filebyId.ocrState != null && this.filebyId.ocrState != undefined) {

                if (this.filebyId.ocrState === -1)
                    this.selected = this.itemsList[0];
                else if (this.filebyId.ocrState === 0)
                    this.selected = this.itemsList[1];
                else if (this.filebyId.ocrState === 1)
                    this.selected = this.itemsList[2];
                else if (this.filebyId.ocrState === 2) {
                    this.selected = this.itemsList[3];
                    this.disableOCR = true
                }
            }
            if (this.filebyId.ocrLang != null && this.filebyId.ocrLang != undefined)
                this.selected_Item = this.filebyId.ocrLang
        }
    }

    /*Convert File To Base 64 */
    readBase64(file): Promise<any> {
        const reader = new FileReader();
        const future = new Promise((resolve, reject) => {
            reader.addEventListener('load', function () {
                resolve(reader.result);
            }, false);
            reader.addEventListener('error', function (event) {
                reject(event);
            }, false);
            reader.readAsDataURL(file);
        });
        return future;
    }

    /*Convert File To Base 64 */

    /**************** SIGNATURE PDF ****************/
    async signedEvent(event) {
        this.fileSigned.emit(event)/*Envoie new File */
        await this.readBase64(event).then((data) => {
            let datanew = data.split(',');
            this.BASE64_Input = datanew[1] /*Save the base 64 to == this.BASE64_Input*/
        });
    }

    /**************** SIGNATURE PDF ****************/

    /*To close Modal*/
    closeModalViwer() {
        this.closeModal.emit()
    }

    async deletepagebyindex() {
        this.loadingVisible = true;
        let testCorrectPageIndex = this.verifCorrectPageIndex()
        if (testCorrectPageIndex) {
            let HaveMorethanOnePage = this.verifCorrectPageIndexfordelete()
            if (HaveMorethanOnePage) {
                let authorizationtokenScan = await this.communService.authorizationToken(this.ModuleScan)

                try {
                    this.fileservice.deletepagebyindex(authorizationtokenScan, this.Indexvalue, this.BASE64_Input).subscribe((data: any) => {
                        this.loadingVisible = false;
                        this.BASE64_Output_Reload.emit(data.result['base64Output'])
                        this.BASE64_Input = data.result['base64Output'];
                        this.totalpage = data.result['pgNbr'];
                    }, error1 => {
                        this.loadingVisible = false;
                        this.translateService.get("ATTACHEMENT.DeletepgError").subscribe((res) => {
                            this.toastr.success(error1.error.message, res, {
                                closeButton: true,
                                positionClass: 'toast-top-right',
                                extendedTimeOut: this.env.extendedTimeOutToastr,
                                progressBar: true,
                                disableTimeOut: false,
                                timeOut: this.env.timeOutToastr
                            })
                        })
                    })
                } catch (error) {
                    this.loadingVisible = false
                    this.translateService.get("ATTACHEMENT.DeletepgError").subscribe((res) => {
                        this.toastr.success(error.error.message, res, {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                    })
                }
            } else {
                this.loadingVisible = false;
                this.translateService.get("ATTACHEMENT.warningpgnbr").subscribe((res) => {
                    this.toastr.info("", res, {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                })
            }
        } else {
            this.translateService.get("ATTACHEMENT.warningverifpgnbr").subscribe((res) => {
                this.toastr.info("", res, {
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

    advencedState = false

    switchchange(e) {
        this.advencedState = e.value
    }

    async ScanAfter(before, base64, pageindex, base64FileScanned, scannerName, scannerProfil) {
        this.loadingVisible = true;
        let jsonscanpreference = (scannerProfil);
        let decision = true;
        let authorizationtokenScan = await this.communService.authorizationToken(this.ModuleScan)

        try {
            this.fileservice.scanafter(authorizationtokenScan, pageindex, base64, base64FileScanned, 'Acquire', scannerName, jsonscanpreference.indicateur, jsonscanpreference.isPrevisualisation, jsonscanpreference.typedudocument, jsonscanpreference.rectoverso, jsonscanpreference.resolution, jsonscanpreference.mode, jsonscanpreference.bitDepth, jsonscanpreference.formatpageDto, jsonscanpreference.discardBlankPage, jsonscanpreference.blankpagethreshold).subscribe(
                (BASE64_RESULT) => {
                    this.loadingVisible = false;
                    //TODO Creation d'un fichier a partir base64
                    if (decision) {
                        do {
                            this.translateService.get("ATTACHEMENT.chargepagescanner").subscribe(title => {
                                decision = window.confirm(title);
                            })
                            if (decision) {
                                if (before)
                                    this.Indexvalueaux = this.Indexvalueaux + BASE64_RESULT.result.scannedPgNbr - 2;
                                else {
                                    this.Indexvalueaux = this.Indexvalueaux + BASE64_RESULT.result.scannedPgNbr - 1;
                                }
                                this.ScanAfter(before, BASE64_RESULT.result.base64Output, this.Indexvalueaux, BASE64_RESULT.result.base64Output, scannerName, scannerProfil);
                                break;
                            } else {
                                decision = false;
                                break;
                            }
                        }
                        while (decision)
                    }
                    if (!decision) {
                        decision = false;
                        this.BASE64_Output_Reload.emit(BASE64_RESULT.result.base64Output);
                        this.BASE64_Input = BASE64_RESULT.result.base64Output;
                        this.totalpage = BASE64_RESULT.result['pgNbr'];
                    }
                }, err => {
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

    pdfgetInfo(authorizationToken, Base64) {
        this.fileservice.getpdfinfo(authorizationToken, Base64).subscribe((data: any) => {
                this.totalpage = data.result.totalpage;
            }, error1 =>
                console.error(error1)
        )
    }

    verifCorrectPageIndex() {
        if (this.Indexvalue != undefined && this.Indexvalue != null && this.Indexvalue >= this.Mindefaultvalue && this.Indexvalue <= this.totalpage) {
            return true;
        } else {
            return false;
        }
    }

    verifCorrectPageIndexfordelete() {
        if (this.totalpage > 1) {
            return true;
        } else {
            return false;
        }
    }

    ScanBeforeBoutton() {
        let testCorrectPageIndex = this.verifCorrectPageIndex()
        if (testCorrectPageIndex) {
            //TODO VERIFICATION CONFIG SCANNER VALIDE
            if ((this.cookieService.get('scannerName')) && (this.cookieService.get('scannerProfil'))) {
                this.Indexvalueaux = this.Indexvalue;
                this.fileservice.getscan_preferencesByName(this.cookieService.get('scannerProfil')).subscribe((data: any) => {
                    this.ScanAfter(true, this.BASE64_Input, this.Indexvalue - 2, "", this.cookieService.get('scannerName'), data)
                })
            } else {
                this.translateService.get("ATTACHEMENT.Configscannernonvalide").subscribe((res) => {
                        this.toastr.error(res, "", {
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
        } else {
            this.translateService.get("ATTACHEMENT.botifnbrpg").subscribe((res) => {
                this.toastr.info(res, "", {
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

    ScanAfterBoutton() {
        let testCorrectPageIndex = this.verifCorrectPageIndex()
        if (testCorrectPageIndex) {
            //TODO VERIFICATION CONFIG SCANNER VALIDE
            if ((this.cookieService.get('scannerName')) && (this.cookieService.get('scannerProfil'))) {
                this.Indexvalueaux = this.Indexvalue;
                this.fileservice.getscan_preferencesByName(this.cookieService.get('scannerProfil')).subscribe((data: any) => {
                    this.ScanAfter(false, this.BASE64_Input, this.Indexvalue - 1, "", this.cookieService.get('scannerName'), data)
                })
            } else {
                this.translateService.get("ATTACHEMENT.Configscannernonvalide").subscribe((res) => {
                        this.toastr.error(res, "", {
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
        } else {
            this.translateService.get("ATTACHEMENT.botifnbrpg").subscribe((res) => {
                this.toastr.info(res, "", {
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

    Sauvegarder() {
        this.BASE64_Output_Save.emit(this.BASE64_Input);
    }

    plusindex() {
        if (this.Indexvalue < this.totalpage)
            this.Indexvalue++;
    }

    moinindex() {
        if (this.Indexvalue > this.Mindefaultvalue)
            this.Indexvalue--;

    }

    initWaterMarker() {
        this.openPopupWaterMarker = true
        this.fileservice.getVariables("VAR_FILIGRANE_PARAMETRE").subscribe(data => {
            this.filigraneInitialParam = (data)
            this.WaterMarkerForm.get("leftmargin").setValue(this.pxTocm(this.filigraneInitialParam.leftmargin))
            this.WaterMarkerForm.get("topmargin").setValue(this.pxTocm(this.filigraneInitialParam.topmargin))
            this.WaterMarkerForm.get("rotation").setValue(this.filigraneInitialParam.rotation)
            this.WaterMarkerForm.get("opacity").setValue(this.filigraneInitialParam.opacity)
            this.WaterMarkerForm.get("fontSize").setValue(this.filigraneInitialParam.fontSize)
            this.WaterMarkerForm.get("content").setValue(this.filigraneInitialParam.content)
            this.WaterMarkerForm.get("color").setValue(this.filigraneInitialParam.color)
            this.WaterMarkerForm.get("fontStyle").setValue(this.filigraneInitialParam.fontStyle)
            this.WaterMarkerForm.get("fontFamily").setValue(this.filigraneInitialParam.fontFamily)
        })
    }

    pxTocm(pixel: number): string {
        return ((pixel) * 0.026458).toString()
    }


    ocmTopx(cm) {
        return cm / 0.026458
    }

    Ref = {value: ''};

    submit() {
        this.loadingVisible = true
        let obj = new FormData()
        if (this.WaterMarkerForm.get("fontFamily").value != undefined && this.WaterMarkerForm.get("fontFamily").value != null)
            obj.append("fontFamily", this.WaterMarkerForm.get("fontFamily").value)

        if (this.WaterMarkerForm.get("fontStyle").value != undefined && this.WaterMarkerForm.get("fontStyle").value != null)
            obj.append("fontStyle", this.WaterMarkerForm.get("fontStyle").value)

        if (this.WaterMarkerForm.get("color").value != undefined && this.WaterMarkerForm.get("color").value != null)
            obj.append("color", this.WaterMarkerForm.get("color").value)

        if (this.WaterMarkerForm.get("content").value != undefined && this.WaterMarkerForm.get("content").value != null)
            obj.append("content", this.WaterMarkerForm.get("content").value)

        if (this.WaterMarkerForm.get("fontSize").value != undefined && this.WaterMarkerForm.get("fontSize").value != null)
            obj.append("fontSize", this.WaterMarkerForm.get("fontSize").value)

        if (this.WaterMarkerForm.get("opacity").value != undefined && this.WaterMarkerForm.get("opacity").value != null)
            obj.append("opacity", this.WaterMarkerForm.get("opacity").value.toString())

        if (this.WaterMarkerForm.get("rotation").value != undefined && this.WaterMarkerForm.get("rotation").value != null) {
            obj.append('rotation', this.WaterMarkerForm.get('rotation').value);
        }

        if (this.WaterMarkerForm.get('leftmargin').value != undefined && this.WaterMarkerForm.get('leftmargin').value != null) {
            obj.append('leftmargin', Math.round(this.ocmTopx(parseInt(this.WaterMarkerForm.get('leftmargin').value))).toString());
        }

        if (this.WaterMarkerForm.get('topmargin').value != undefined && this.WaterMarkerForm.get('topmargin').value != null) {
            obj.append('topmargin', Math.round(this.ocmTopx(parseInt(this.WaterMarkerForm.get('topmargin').value))).toString());
        }

        if (this.idAttachement != undefined && this.idAttachement != null) {
            obj.append('id', this.idAttachement);
        }
        const byteArray = new Uint8Array(atob(this.BASE64_Input).split('').map(char => char.charCodeAt(0)));
        let fileContent = new File([byteArray], this.FileNameToSigned, {type: 'application/pdf'});
        if (fileContent != undefined && fileContent != null) {
            obj.append('multipartFiles', fileContent);
        }

        if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null) {
            obj.append('objectData', JSON.stringify(this.objectData));
        }

        this.Ref.value = this.FileNameToSigned;

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + 'AddWatermarkPDF?fileAccessToken=' + this.fileAccessToken, obj);
        this.httpServicesComponent.method(paramsHttp, this.Ref).then(data => {
            if (data['statut'] == true) {
                this.BASE64_Output_Reload.emit(data["value"].base64);
                this.BASE64_Input = data["value"].base64;
                this.openPopupWaterMarker = false

            }
            this.loadingVisible = false

        })

    }

    removeWaterMarker() {
        this.loadingVisible = true

        let obj = new FormData()

        if (this.idAttachement != undefined && this.idAttachement != null)
            obj.append("id", this.idAttachement)
        if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null)
            obj.append("objectData", JSON.stringify(this.objectData));

        const byteArray = new Uint8Array(atob(this.BASE64_Input).split('').map(char => char.charCodeAt(0)));
        let fileContent = new File([byteArray], this.FileNameToSigned, {type: 'application/pdf'});
        if (fileContent != undefined && fileContent != null) {
            obj.append('multipartFiles', fileContent);
        }


        this.Ref.value = this.FileNameToSigned

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + 'RemovetWatermarkPDF?fileAccessToken=' + this.fileAccessToken, obj)
        this.httpServicesComponent.method(paramsHttp, this.Ref).then(data => {
            if (data["statut"] == true) {
                this.BASE64_Output_Reload.emit(data["value"].base64);
                this.BASE64_Input = data["value"].base64;
            }
            this.loadingVisible = false

        })
        this.popupDeleteWaterMarker = false
    }

    submitOCR() {

        let jsonFile = {
            id: null,
            objectDatasecuriteLevel: null,
            ocrState: null,
            ocrDate: null,
            ocrLang: null,
            locked: null,
            transferable: null,
            securiteLevel: null
        }
        jsonFile.id = (this.filebyId).id;
        jsonFile.securiteLevel = (this.filebyId).securiteLevel;
        jsonFile.locked = (this.filebyId).locked;
        jsonFile.transferable = (this.filebyId).transferable;
        jsonFile.objectDatasecuriteLevel = (this.objectData).securiteLevel;
        if (this.enabledOCR === true)
            jsonFile.ocrState = 1
        else if (this.enabledOCR === false)
            jsonFile.ocrState = 0
        jsonFile.ocrDate = new Date()
        jsonFile.ocrLang = this.selected_Item
        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + this.idAttachement, jsonFile)
        this.Ref.value = this.FileNameToSigned

        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.MessageMiseajour", "ATTACHEMENT.editErreur").then(data => {
            if (data["statut"] == true) {
                this.openPopupOcr = false
                this.ConfirmeOCR = true

            }
        })
    }

    onValueChanged($event) {
        if ($event.value.id === 2)
            this.enabledOCR = false
        else if ($event.value.id === 3)
            this.enabledOCR = true

    }


    openOcrPopup() {
        this.openPopupOcr = true
        let paramsHttp = new HttpParamMethodGet(this.env.apiUrlkernel + "getOcrSupportedLanguage", "", null, [])

        this.httpServicesComponent.method(paramsHttp).then(data => {
            if (data["statut"] == true) {
                this.dataSourceLanguage = data["value"]
                this.selected_Item = this.dataSourceLanguage[0]
            }
        })
    }

    /*Select box change*/
    onChange(value) {
        if (value.selectedItem && value.selectedItem != undefined) {
            this.selected_Item = value.selectedItem;
        }
    }

    /*Select box change*/
}
