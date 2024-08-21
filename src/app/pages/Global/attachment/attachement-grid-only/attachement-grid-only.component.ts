import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input, OnChanges,
    OnInit,
    Output,
    SimpleChange,
    ViewChild
} from '@angular/core';
import {DxDataGridComponent, DxFormComponent} from "devextreme-angular";
import {FormatDate} from "../../shared-service/formatDate";
import {HttpServicesComponent} from "../../ps-tools/http-services/http-services.component";
import {DeviceDetectorService} from "ngx-device-detector";
import {EnvService} from "../../../../../env.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {CookieService} from "ngx-cookie-service";
import {CommunFuncService} from "../Commun/commun-func.service";
import {DatePipe} from "@angular/common";
import {AttachementModuleService} from "../attachement.module.service";
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {
    HttpParamMethodDelete,
    HttpParamMethodPatch,
    HttpParamMethodPost,
    HttpParamMethodPutNEwFormat
} from "../../ps-tools/class";
import {Object} from "../template-attachment/template-attachment.component";
import {Export} from "../../shared-service/export";
import * as FileSaver from 'file-saver';
import {DomSanitizer} from "@angular/platform-browser";

import {Router} from "@angular/router";
import {TokenStorageService} from "../../shared-service/token-storage.service";
import {loadMessages, locale} from "devextreme/localization";
import frMessages from "devextreme/localization/messages/fr.json";
import arMessages from "devextreme/localization/messages/ar.json";
import {ColorState} from "../../shared-service/colorState";
import CustomStore from "devextreme/data/custom_store";
import notify from "devextreme/ui/notify";

@Component({
    selector: 'app-attachement-grid-only',
    templateUrl: './attachement-grid-only.component.html',
    styleUrls: ['./attachement-grid-only.component.scss'],

})
export class AttachementGridOnlyComponent implements OnInit, OnChanges {
    format
    public currentlang: any = "ar";
    alignment = "right"
    public pageSize = this.env.pageSize
    isGridBoxOpened: boolean;

    showHeaderFilter: boolean;
    searchExpr: any;
    editorOptions: any;
    @ViewChild(DxDataGridComponent, {static: false}) datagridAutresFichiers: DxDataGridComponent;
    packageName = require('package.json').name
    ListTypeFichiers = [{
        label: "مكتب الضبط",
    },
        {label: "كتابة الرئيس الأول"}]
    @Input() ObjectProjet: any;
    @Input() classid: any;
    @Input() objectid: any;
    @Input() objectData: any;
    @Input() ReadOnly: any;
    @Input() showSplliter: any;
    @ViewChild(HttpServicesComponent, {static: true}) private httpServicesComponent: HttpServicesComponent;
    @Output() AppelWsGetById: EventEmitter<any> = new EventEmitter<any>();
    @Output() jsondocviewerEventFromGrid = new EventEmitter<any>();


    constructor(private sanitizer: DomSanitizer, private ref: ChangeDetectorRef, public env: EnvService, private router: Router, private http: HttpClient, private toastr: ToastrService,
                private tokenStorage: TokenStorageService, private translateService: TranslateService, private cookieService: CookieService, public communService: CommunFuncService, private fileservice: AttachementModuleService) {

        this.showHeaderFilter = true;
        this.editorOptions = {placeholder: 'Search city or state'};
        this.searchExpr = ['label']


        if (this.tokenStorage.getToken() == null) {
            this.router.navigate(['/login']);
        }
        if (localStorage.getItem("locale")) {
            translateService.use(localStorage.getItem("locale"));


            locale(localStorage.getItem("locale"));
            this.currentlang = localStorage.getItem("locale");

        } else {
            translateService.use("ar");
            locale("ar");
            this.currentlang = "ar";

        }
        if (this.currentlang === "fr") {
            loadMessages(frMessages);
        } else if (this.currentlang === "ar") {
            loadMessages(arMessages);

            loadMessages({
                'ar': {
                    // Common
                    'dxDataGrid-columnChooserTitle': 'اختيار الأعمدة',
                    'add': 'طلب استشارة قانونية ',
                    'dxDataGrid-columnChooserEmptyText': 'سحب العمود هنا لإخفاءه',
                    'dxDataGrid-groupPanelEmptyText': 'اسحب عنوان العمود هنا لتجميع البيانات حسب هذا العمود',
                    'dxDataGrid-groupPanelPlaceholder': 'اسحب العناوين هنا لتجميع البيانات حسب هذه الأعمدة',
                    'dxDataGrid-noDataText': 'لا توجد بيانات',
                    "resetButtonHint": "إعادة التعيين",
                    "addRowButton": "إضافة صف",
                    "refreshRowButton": "زر تحديث الصف",
                    // Paging
                    'dxDataGrid-pagerPageSizes': 'عناصر لكل صفحة',
                    'dxDataGrid-pagerInfoText': 'عرض صفحة {0} من {1} ({2} من النتائج)',
                    'dxDataGrid-pagerNextButtonText': 'التالي',
                    'dxDataGrid-pagerPrevButtonText': 'السابق',
                    'dxDataGrid-pagerFirstButtonText': 'الأول',
                    'dxDataGrid-pagerLastButtonText': 'الأخير',

                    // Editing
                    'dxDataGrid-editingAddRow': 'إضافة صف',
                    'dxDataGrid-editingDeleteRow': 'حذف',
                    'dxDataGrid-editingSaveAllChanges': 'حفظ التغييرات',
                    'dxDataGrid-editingCancelAllChanges': 'تجاهل التغييرات',
                    'dxDataGrid-editingConfirmDeleteMessage': 'هل أنت متأكد أنك تريد حذف السجل؟',

                    // Exporting
                    'dxDataGrid-exportTo': 'تصدير',
                    'dxDataGrid-exportToExcel': 'تصدير إلى Excel',
                    'dxDataGrid-excelFormat': 'ملف Excel',
                    'dxDataGrid-selectedRows': 'الصفوف المحددة',
                    'dxDataGrid-exportAll': 'تصدير كل البيانات',
                    'dxDataGrid-exportSelectedRows': 'تصدير الصفوف المحددة',

                    // Filter Row
                    'dxDataGrid-filterRowShowAllText': '(الكل)',
                    'dxDataGrid-filterRowResetOperationText': 'إعادة التعيين',
                    'dxDataGrid-filterRowOperationEquals': 'يساوي',
                    'dxDataGrid-filterRowOperationNotEquals': 'لا يساوي',
                    'dxDataGrid-filterRowOperationLess': 'أقل',
                    'dxDataGrid-filterRowOperationLessOrEquals': 'أقل من أو يساوي',
                    'dxDataGrid-filterRowOperationGreater': 'أكبر',
                    'dxDataGrid-filterRowOperationGreaterOrEquals': 'أكبر من أو يساوي',
                    'dxDataGrid-filterRowOperationStartsWith': 'يبدأ بـ',
                    'dxDataGrid-filterRowOperationContains': 'يحتوي على',
                    'dxDataGrid-filterRowOperationNotContains': 'لا يحتوي على',
                    'dxDataGrid-filterRowOperationEndsWith': 'ينتهي بـ',
                    'dxDataGrid-filterRowOperationBetween': 'بين',
                    'dxDataGrid-filterRowOperationBetweenStartText': 'البداية',
                    'dxDataGrid-filterRowOperationBetweenEndText': 'النهاية',

                    // Header Filter
                    'dxDataGrid-headerFilterEmptyValue': '(فارغة)',
                    'dxDataGrid-headerFilterOK': 'موافق',
                    'dxDataGrid-headerFilterCancel': 'إلغاء',

                    // Filter Builder
                    'dxDataGrid-filterBuilderGroupAnd': 'و',
                    'dxDataGrid-filterBuilderGroupOr': 'أو',
                    'dxDataGrid-filterBuilderOpEqual': 'يساوي',
                    'dxDataGrid-filterBuilderOpNotEqual': 'لا يساوي',
                    'dxDataGrid-filterBuilderOpLess': 'أقل',
                    'dxDataGrid-filterBuilderOpLessOrEqual': 'أقل من أو يساوي',
                    'dxDataGrid-filterBuilderOpGreater': 'أكبر',
                    'dxDataGrid-filterBuilderOpGreaterOrEqual': 'أكبر من أو يساوي',
                    'dxDataGrid-filterBuilderOpStartsWith': 'يبدأ بـ',
                    'dxDataGrid-filterBuilderOpContains': 'يحتوي على',
                    'dxDataGrid-filterBuilderOpNotContains': 'لا يحتوي على',
                    'dxDataGrid-filterBuilderOpEndsWith': 'ينتهي بـ',
                    'dxDataGrid-filterBuilderOpBetween': 'بين',
                    'dxDataGrid-filterBuilderOpBetweenStartText': 'البداية',
                    'dxDataGrid-filterBuilderOpBetweenEndText': 'النهاية',
                    'dxDataGrid-filterBuilderOpIsBlank': 'فارغة',
                    'dxDataGrid-filterBuilderOpIsNotBlank': 'ليست فارغة',
                }
            });
        }
        this.format = new FormatDate(this.env);
        this.DeleteFile = this.DeleteFile.bind(this);
        this.OpenPopupDelete = this.OpenPopupDelete.bind(this);
        // this.getAllFiles = this.getAllFiles.bind(this);

    }


    refresh() {
        if (this.datagridAutresFichiers)
            this.datagridAutresFichiers.instance.refresh();
    }

    colorState = new ColorState(this.env, this.http, this.tokenStorage)
    public loadingVisible = false;
    public editOnkeyPress = true;
    public enterKeyAction = "moveFocus";
    public enterKeyDirection = "column";
    IDFile

    RattarcherPJ(data) {
        console.log("data===================>", data)
        console.log("objectid", this.objectid)
        this.IDFile = data.label
        if (this.IDFile !== undefined) {
            setTimeout(() => {
                const element = document.getElementById("addfile" + this.IDFile);
                if (element) {
                    element.click();
                }
            }, 0);
        }


    }

    onToolbarPreparing(e) {


        e.toolbarOptions.items.unshift(
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    hint: 'refresh',
                    icon: 'refresh',
                    onClick: this.refresh.bind(this),

                }
            });


        // e.toolbarOptions.items.unshift(
        //     {
        //       location: 'after',
        //       widget: 'dxButton',
        //       options: {
        //         hint: '+',
        //         icon: '+',
        //         onClick: this.Route.bind(window.open('Recalamtion/demandeAffaireConsultativesAnonyme', '_blank')),
        //       }
        //     });


    }

    onCellPrepared(e: any) {

        if (e.rowType === 'data') {

            if (e.column.dataField === 'activityName') {
                this.colorState.states.forEach(element => {
                        if (element['name'] === e.data.activityName)
                            e.cellElement.style.backgroundColor = element['props']['color'];
                        e.cellElement.style.color = 'white';

                    }
                )
                //  e.cellElement.style.color = this.colorState.Color;


            }

        }
    }

    fileAccessToken = ""

    ngOnInit(): void {
        this.getAllFiles()
    }

    file: any
    sizeInput: any
    fileContent: any;
    fileType: any;
    blobContent: any;
    base64: any;
    customheight = '800px';
    filename

    fileChange(input) {
        console.log("input", input)
        this.loadingVisible = true;
        this.fileContent = null;
        this.fileContent = input.files[0];
        this.filename = input.files[0].name;

        console.log("fileContent==========>", this.fileContent)
        this.fileType = this.fileContent.type;

        this.fileContent.arrayBuffer().then(async (arrayBuffer) => {
            this.blobContent = new Blob([new Uint8Array(arrayBuffer)], {type: this.fileType});
            this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(arrayBuffer));

        })
        this.loadingVisible = false;

    }

    filedatasource: any;
    conduction: boolean = false;
    visible: any = false;
    pdfSrcc: any;
    visionneuse: any;
    dataArray: any;

    getAllFiles() {
        let size = this.env.pageSize;

        this.filedatasource = new CustomStore({

                load: async function (loadOptions: any) {
                    loadOptions.requireTotalCount = false
                    var params = "";
                    if (loadOptions.take == undefined) loadOptions.take = size;
                    if (loadOptions.skip == undefined) loadOptions.skip = 0;

                    //size
                    params += 'size=' + loadOptions.take || size;
                    params += '&page=' + loadOptions.skip / 12 || 0;
                    //sort
                    if (loadOptions.sort) {
                        if (loadOptions.sort[0].desc)
                            params += '&sort=' + loadOptions.sort[0].selector + ',desc';
                        else
                            params += '&sort=' + loadOptions.sort[0].selector + ',asc';
                    }

                    let tab: any[] = [];
                    if (loadOptions.filter) {
                        if (loadOptions.filter[1] == 'and') {
                            for (var i = 0; i < loadOptions.filter.length; i++) {
                                if (loadOptions.filter[i][1] == 'and') {
                                    for (var j = 0; j < loadOptions.filter[i].length; j++) {
                                        if (loadOptions.filter[i][j] != 'and') {
                                            if (loadOptions.filter[i][j][1] == 'and') {
                                                tab.push(loadOptions.filter[i][j][0]);
                                                tab.push(loadOptions.filter[i][j][2]);
                                            } else
                                                tab.push(loadOptions.filter[i][j]);
                                        }
                                    }
                                } else tab.push(loadOptions.filter[i]);
                            }
                        } else
                            tab.push([loadOptions.filter[0], loadOptions.filter[1], loadOptions.filter[2]]);
                    }

                    let q: any[] = [];
                    for (let i = 0; i < tab.length; i++) {
                        if (tab[i][0] === "plandeClassement.adresse") tab[i][0] = "adresseConsv"
                        switch (tab[i][1]) {
                            case ('notcontains'): {
                                q.push(tab[i][0] + ".doesNotContain=" + tab[i][2]);
                                break;
                            }
                            case 'contains': {
                                if (tab[i][0] == "adresseConsv")
                                    q.push(tab[i][0] + ".contains=" + tab[i][2].adresse);
                                else
                                    q.push(tab[i][0] + ".contains=" + tab[i][2]);

                                break;
                            }
                            case '<>' : {
                                if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                    let isoDate = new Date(tab[i][2]).toISOString();
                                    q.push(tab[i][0] + ".notEquals=" + isoDate);
                                    break;
                                } else {
                                    q.push(tab[i][0] + ".notEquals=" + tab[i][2]);
                                    break;
                                }
                            }
                            case '=': {
                                if (tab[i][0] == "adresseConsv")
                                    q.push(tab[i][0] + ".contains=" + tab[i][2].adresse);
                                else
                                    q.push(tab[i][0] + ".contains=" + tab[i][2]);

                                break;
                            }
                            case 'endswith': {
// q.push("(" + tab[i][0] + ":*" + tab[i][2] + ")");
                                break;
                            }
                            case 'startswith': {
// q.push("(" + tab[i][0] + ":" + tab[i][2] + "*" + ")");
                                break;
                            }
                            case '>=': {
                                if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                    let isoDate = new Date(tab[i][2]).toISOString();
                                    q.push(tab[i][0] + '.greaterThanOrEqual=' + isoDate);
                                    break;
                                } else {
                                    q.push(tab[i][0] + '.greaterThanOrEqual=' + tab[i][2]);
                                    break;
                                }
                            }
                            case '>': {
                                if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                    let isoDate = new Date(tab[i][2]).toISOString();
                                    q.push(tab[i][0] + '.greaterThan=' + isoDate);
                                    break;
                                } else {
                                    q.push(tab[i][0] + '.greaterThan=' + tab[i][2]);
                                    break;
                                }
                            }
                            case '<=': {
                                if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                    let isoDate = new Date(tab[i][2]).toISOString();
                                    q.push(tab[i][0] + '.lessThanOrEqual=' + isoDate);
                                    break;
                                } else {
                                    q.push(tab[i][0] + '.lessThanOrEqual=' + tab[i][2]);
                                    break;
                                }
                            }
                            case '<': {
                                if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                    let isoDate = new Date(tab[i][2]).toISOString();
                                    q.push(tab[i][0] + '.lessThan=' + isoDate);
                                    break;
                                } else {
                                    q.push(tab[i][0] + '.lessThan=' + tab[i][2]);
                                    break;
                                }
                            }
                            case "or" : {
                                q.push(tab[i][0][0] + '.notEquals=' + tab[i][0][2])
                                break;
                            }
                        }
                    }

                    let f: string = "";
                    if (q.length != 0) f += q[0];
                    for (let i = 1; i < q.length; i++) {
                        f += "&" + q[i];
                    }
                    if (f.length != 0) params += "&" + f


                    return this.http.get(this.env.apiUrlkernel + "AttachmentsByClassIdAndObjectId?classId=" + this.classid + "&objectId=" + this.objectid + "&fileAccessToken=" + this.fileAccessToken, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
                        .toPromise()
                        .then((data: any) => {

                                this.dataArray = data.content

                                return {'data': data};
                            },
                            error => {
                                notify("\n" + error.message, "error", 3600);
                                return {'data': [], 'totalCount': 0};
                            });
                }.bind(this),
                insert: (values: any) => {

                    console.log("this.base64=================", this.base64)
                    if (this.base64 != undefined)
                        values.file = this.base64

                    this.CreateAttatchment(values)

                    return values
                },

            }
        );
    }

    test: boolean = false

    rowclickViewFileOrDownload(evt: any) {

        console.log("evt==============>", evt)
        // const namefile = evt.row.data.fileName.split('.');
        const fileType = evt.data.filesTypeDTO.type;
        if (fileType === "application/json" || fileType === "text/plain" || fileType === "image/jpeg" ||
            fileType === "image/png" || fileType === "image/gif" || fileType === "image/tiff" || fileType === "image/bmp" ||
            fileType === "image/svg+xml" || fileType === "application/pdf" || fileType === "application/x-tika-ooxml" || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' || fileType === 'application/vnd.ms-word.template.macroEnabled.12') {
            if (this.showSplliter == true) {

                this.viewFile(evt, false);


            } else {
                this.viewFile(evt, true);

            }
        } else {
            this.downloadFile(evt);
        }

    }

    fileName: any;/*FILE NAME TO DISPLAY*/
    filebyId: any;
    id;/*fileSelected id*/
    pstkEnabledAndRunning = false;
    idFileViewer: any;/*FILE ID*/
    idcmis: any;/*FILE ID*/
    ModuleScan = require('../ModulePSTK.json').Module_Scan
    ModuleOffice = require('../ModulePSTK.json').Module_Office
    ModuleSign = require('../ModulePSTK.json').Module_Sign
    ModuleMisc = require('../ModulePSTK.json').Module_Misc;
    permissionToTopViewer = true/*PERMISSION FOR Top Viewer */
    permissionDenied/*PERMISSION FOR SCAN BEFORE/AFTER */
    permissionDeniedSig = false/*PERMISSION FOR SIGNATURE */
    jsondocviewer = {
        pdfSrcc: "",
        visionneuse: "url",
        fileName: null,
        docTitle: null,
        fileType: null,
        fileContent: null,
        id: null,
        fileAccessToken: null,
        securityLevel: null,
        objectData: null
    };
    pgNbr/*PGNBRE*/
    visibleTrueModal = false/*POPUP FILE VIEWER VISIBLE */

    async viewFile(data, ShowPopupBoolean) {
        this.loadingVisible = true;

        this.fileName = data.data.fileName;
        this.filebyId = data.data;

        this.id = data.data.id;
        this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'


        this.idFileViewer = data.data.id
        this.idcmis = data.data.cmisId
        this.fileType = data.data.fileType
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
                            this.permissionDenied = data.data.locked == false && (!this.ReadOnly) && this.pstkEnabledAndRunning && verifLicensePSTKScan;
                            verifLicensePSTKSign = await this.communService.verifLicensePSTK(this.ModuleSign);
                            this.permissionDeniedSig = (!(this.ReadOnly) && this.pstkEnabledAndRunning && verifLicensePSTKSign);
                        } else {
                            this.permissionToTopViewer = false;
                        }
                        let blobFile = new Blob([new Uint8Array(response)], {type: this.fileType});
                        var fileURL = URL.createObjectURL(blobFile);
                        this.jsondocviewer.visionneuse = 'url';
                        this.jsondocviewer.pdfSrcc = fileURL
                        this.jsondocviewer.fileType = this.fileType
                        this.jsondocviewer.fileName = data.data.docTitle
                        this.jsondocviewer.docTitle = data.data.fileName
                        this.jsondocviewer.fileContent = this.base64
                        this.jsondocviewer.id = data.data.id
                        this.jsondocviewer.securityLevel = data.data.securiteLevel
                        this.jsondocviewer.fileAccessToken = this.fileAccessToken
                        this.jsondocviewer.objectData = this.objectData
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

    CreateAttatchment(values) {
        console.log("valueeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", values)

        let Ref = values.requestFileDefinition.label.name
        this.loadingVisible = true
        if (!(this.fileContent == null && values.requestFileDefinition.label.fileRequired == true)) {
            let obj = new FormData()
            obj.append("docTitle", this.filename)
            obj.append("objectData", JSON.stringify(this.objectData))
            obj.append("objectDatasecuriteLevel", "0")
            obj.append("reqFileDefName", Ref)
            obj.append("classId", this.classid)
            obj.append("objectId", this.objectid)
            obj.append("locked", "false")
            obj.append("Public", "false")
            if (this.fileContent != null)
                obj.append("multipartFiles", this.fileContent)
            else if (this.fileContent === null || this.fileContent === undefined) {
                this.translateService.get("ATTACHEMENT.fileEmpty", Ref).subscribe((res) => {
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


            let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'createAttachement' + "?fileAccessToken=" + this.fileAccessToken, obj)
            this.httpServicesComponent.method(paramsHttp, Ref).then(data => {
                this.refresh();
                this.AppelWsGetById.emit(true)/*getbyid*/

                this.loadingVisible = false

            })
        } else if ((this.fileContent == null || this.fileContent == undefined) && values.requestFileDefinition.label.fileRequired == true) {
            console.log("this.fileContent", this.fileContent)

            this.loadingVisible = false
            // this.Ref.value = this.form.instance.option("formData").docTitle
            this.translateService.get("ATTACHEMENT.fileRequired", Ref).subscribe((res) => {
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

    consulterPjs(data) {
        console.log(data)
        this.objectFile = data

        // var fileURL = URL.createObjectURL(data.file);
        this.visible = true

        this.reloadViewer(data.data, data.docTitle)
    }

    close() {
        this.visible = false;

    }

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

    objectFile: any

    reloadViewer(base64, filename) {
        console.log("file", filename)
        console.log("base64", base64)
        let arraybuffer = this.communService.base64ToArrayBuffer(base64);
        this.fileContent = new File([arraybuffer], filename, {type: 'application/pdf'});
        this.pdfSrcc = URL.createObjectURL(this.fileContent);
        this.visionneuse = 'url';
    }

    public div2: any;
    public div1: any;

    getheigth() {
        if (document.getElementById('div2') != null && document.getElementById('div2') != undefined)
            this.div2 = document.getElementById('div2').getClientRects();
        if (document.getElementById('div1') != null && document.getElementById('div1') != undefined)
            this.div1 = document.getElementById('div1').getClientRects();
        if (this.div2.length != 0)
            return this.div2[0].y - this.div1[0].y + "px";
    }

    // logEvent1(initNewRow: string, $event: any) {
    //     this.test=false
    // }

    popupDeleteFileVisible: boolean = false
    Ref = {value: ''};
    FileToDelete: any

    OpenPopupDelete(e) {
        this.FileToDelete = e
        this.popupDeleteFileVisible = true
    }

    DeleteFile() {
        console.log("eeeeeeeeeeee=>", this.FileToDelete)
        this.popupDeleteFileVisible = false;
        console.log("this.popupDeleteFileVisible", this.popupDeleteFileVisible)
        let paramsHttp = new HttpParamMethodDelete(this.env.apiUrlkernel + "attachementRemove?id=" + this.FileToDelete.row.data.id + "&fileAccessToken=" + this.fileAccessToken, '')
        this.Ref.value = this.FileToDelete.row.data.docTitle

        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.deleted", "ATTACHEMENT.deleteError").then(data => {
            this.refresh()
            this.AppelWsGetById.emit(true)/*getbyid*/

        })
    }

    checkValue(data) {
        console.log("daataa============>", data)
        console.log("fileContent============>", this.fileContent)
    }

    logEvent1(initNewRow: string, $event: any) {
        console.log("INNNNNNNNNNNNNNNN")
        this.fileContent = null
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        console.log("changes['objectid']", changes['objectid']);
        if (changes['objectid'] === undefined) {
            this.refresh();
        }
        // if (changes['objectId'] && changes['objectId'].previousValue != changes['objectId'].currentValue) {
        //     this.IDFile = this.objectid
        // }
        //
    }

    DetectChange(e) {
        console.log("e====================>", e)
    }

    onEditorPreparing(e) {
        console.log("e====================>", e)

    }
}
