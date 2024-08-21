import {Component, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild} from '@angular/core';
import * as FileSaver from 'file-saver';
import {AttachementModuleService} from '../attachement.module.service';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {DxDataGridComponent, DxFileManagerComponent} from 'devextreme-angular';
import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import ObjectFileSystemProvider from 'devextreme/file_management/object_provider';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';
import {Object} from '../template-attachment/template-attachment.component';
import {
    HttpParamMethodDelete,
    HttpParamMethodPatch,
    HttpParamMethodPost,
    HttpParamMethodPutNEwFormat,
} from '../../ps-tools/class';
import {FormatDate} from '../../shared-service/formatDate';
import {DeviceDetectorService} from 'ngx-device-detector';
import {CommunFuncService} from '../Commun/commun-func.service';
import {Export} from '../../shared-service/export';
import {HttpServicesComponent} from '../../ps-tools/http-services/http-services.component';
import {EnvService} from '../../../../../env.service';
import {TokenStorageService} from '../../shared-service/token-storage.service';


@Component({
    selector: 'app-thumbnail',
    templateUrl: './thumbnail.component.html',
    styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit {
    packageName = require('package.json').name;
    @ViewChild(DxFileManagerComponent, {static: false}) fileManager: DxFileManagerComponent;
    @ViewChild('gridofficeTempalte', {static: false}) gridofficeTempalte: DxDataGridComponent;
    /*Monitoring file actions*/
    @Input() canDelete: Boolean = true;
    @Input() canlock: Boolean = true;
    @Input() canUploadfile: Boolean = true;
    @Input() canTransfert: Boolean = true;
    @Input() canActionPDF: Boolean = true;
    @Input() canClone: Boolean = true;
    @Input() canDonwloadfile: Boolean = true;
    @Input() canModiffile: Boolean = true;
    @Input() canShowfile: Boolean = true;
    @Input() hasModelOfficeButton: Boolean = true;
    @Input() fileToThumbnail: any;
    /*Monitoring file actions*/
    @Input() flipped: boolean = false;
    @Input() classid: any;
    @Input() objectid: any;
    @Input() ContainerViewer;
    @Input() objectData;
    @Input() fileAccessToken;
    @Output() outputFilpped = new EventEmitter<any>();
    @Output() getAllbyId = new EventEmitter<any>();
    @Output() ouvrirPopUpSave = new EventEmitter();

    @Input() archiveButtonVisible: Boolean = true;
    @Input() flipedDatagridButtonVisible: Boolean = true;

    mode = 'thumbnails';
    fileItems: FileItem[] = [];
    actionItems: any[] = [];
    loadingVisible: any = false;
    visibleTrueModal = false;
    jsondocviewer = {pdfSrcc: '', visionneuse: 'url',};
    archiveButtonOpt: any;
    refreshButtonOpt: any;
    flipedDatagridButtonOpt: any;
    detailslayoutDatagridButtonOpt: any;
    thumbnaillayoutDatagridButtonOpt: any;
    addfileButtonOpt: any;
    ModifMenuOptions: any;
    popupDeleteFileVisible: any = false;
    idModifFile: any = null;
    popupModifFileVisible: any = false;
    filedatasource: any = [];
    count: any;
    isarchiveiconDisabled: any = true;
    fileSystemProvider;
    objectProvider: ObjectFileSystemProvider;
    actionViwer: ActionItem
    actionUpdate: ActionItem
    actionDelete: ActionItem
    actiondownlowd: ActionItem
    actioncloned: ActionItem
    actionTrs: ActionItem
    actionUnTrs: ActionItem
    actionVer: ActionItem
    actionDeve: ActionItem
    actiongestionPDF: ActionItem
    modifierFile: ActionItem
    modifierFileToEdit: ActionItem
    SaveFileAfterEditandDelete: ActionItem
    generePdf: ActionItem
    uploadFile: ActionItem

    fileTemplate
    editorOptionsName
    massageExpressionRegulier = ""
    namePattern = false
    editorOptionsDateEmission
    dateSystem = new Date()
    minDateExpiration
    maxCopies = 1
    minCopies = 1
    public formatDate = new FormatDate(this.env);
    idFileToModif = null
    PcTkExist = true
    /*Module PSTK*/
    ModuleScan = require('../ModulePSTK.json').Module_Scan
    ModuleOffice = require('../ModulePSTK.json').Module_Office;
    ModuleSign = require('../ModulePSTK.json').Module_Sign;
    ModuleMisc = require('../ModulePSTK.json').Module_Misc;

    /*Module PSTK*/
    isMobile
    isTablet
    isDesktopDevice
    fileId: number;
    idFileViewer
    fileType
    pgNbr
    permissionDenied/*PERMISSION FOR SCAN BEFORE/AFTER */
    permissionDeniedSig = false/*PERMISSION FOR SIGNATURE */
    permissionToTopViewer = true/*PERMISSION FOR Top Viewer */
    avertismentPopUp = false/*AVERTISSMENTOF FILE SIGNED*/
    base64: any;
    fileName
    fileContent
    disabledSaved = true
    fileBusy = false
    showiconEcraseContenu = false
    canUnLock
    validDocTitle = "^[^<>:;,?\"'*|\\\\\\/]+$"
    validFilename = "^[^\\\\\\/\\:\\*\\?\\\"\\<\\>\\|\\.]+(\\.[^\\\\\\/\\:\\*\\?\\\"\\<\\>\\|\\.]+)+$"
    validDocTitleMSG
    validFileMsg
    genepdf = true
    /*DOC VIWER*/
    idcmis
    upladPopUP = false
    FileForm/*FileFormulaire*/
    popupDeleteFileVisibleAttached = false
    blobContent
    officeVisble = true
    openOfficePopUp = false
    /* * **** *** SIGNATURE PDF ***** *  ** * */
    officeTemplateList = []
    /*FLIPED EVENT SEND*/
    saveFromScanner

    /*Custimize icon*/
    /*INITIAL REFRESH*/
    UploadFileForTemplace: any
    /*Office*/
    sizeInput
    disableSave = false
    idFileRemplace
    fileTodelete
    /*REFRESH*/
    labelEditable = false
    /*Double CLick to item  */
    FormatDisplayDateDEmiss
    FormatDisplayDateDExpir
    editorOptions
    dataSourcepersonne
    editorOptionsDateExpiration
    backgroundColor/*CARD COLOR*/
    boxShadow/*CARD SHADOW*/
    resp;
    FormatDisplayDate: any;
    FormatDisplayDateExpiration: any;
    editorOptionsIdentificateur;
    filebyId: any;
    id;/*fileSelected id*/
    pstkEnabledAndRunning = false;
    Ref = {value: ''};
    RefUserName
    @Input() authorizationTokenScan = false;
    @Input() authorizationTokenOffice = false;
    // @Input() authorizationTokenSign = false;
    // @Input() authorizationTokenMisc = false;
    @ViewChild(HttpServicesComponent, {static: true}) private httpServicesComponent: HttpServicesComponent;
    @Input() listOfficeNotEmpty = false;

    constructor(private communService: CommunFuncService, private deviceService: DeviceDetectorService, private tokenStorage: TokenStorageService, private http: HttpClient, private fileservice: AttachementModuleService, private cookieService: CookieService, private env: EnvService, private translateService: TranslateService, private toastr: ToastrService,) {
        if (this.cookieService.get('displayname')) {
            this.RefUserName = {displayName: this.cookieService.get('displayname')};
        } else {
            this.RefUserName = {displayName: 'utilisateur'};
        }
        this.translateService.get(['ATTACHEMENT.viewe',
            'ATTACHEMENT.proprite',
            'ATTACHEMENT.delete',
            'ATTACHEMENT.download',
            'ATTACHEMENT.clone',
            'ATTACHEMENT.transf',
            'ATTACHEMENT.untransf',
            'ATTACHEMENT.lock',
            "ATTACHEMENT.unlock",
            "ATTACHEMENT.actionPDF",
            "ATTACHEMENT.MAJ",
            "ATTACHEMENT.open",
            "ATTACHEMENT.recu&sup",
            "ATTACHEMENT.generatepdf",
            "ATTACHEMENT.upload"]).subscribe((res) => {

            this.actionViwer = new ActionItem(1, res["ATTACHEMENT.viewe"], "fas fa-external-link-alt", false)
            this.actionUpdate = new ActionItem(2, res["ATTACHEMENT.proprite"], "fa fa-pencil-square-o", false)
            this.actionDelete = new ActionItem(3, res["ATTACHEMENT.delete"], "fa fa-trash", false)
            this.actiondownlowd = new ActionItem(4, res["ATTACHEMENT.download"], "download", true)
            this.actioncloned = new ActionItem(5, res["ATTACHEMENT.clone"], "copy", false)
            this.actionTrs = new ActionItem(6, res["ATTACHEMENT.transf"], "fa fa-paper-plane", false)
            this.actionUnTrs = new ActionItem(7, res["ATTACHEMENT.untransf"], "fa fa-unlink", false)
            this.actionVer = new ActionItem(8, res["ATTACHEMENT.lock"], "fa fa-lock", false)
            this.actionDeve = new ActionItem(9, res["ATTACHEMENT.unlock"], "fa fa-unlock", false)
            this.actiongestionPDF = new ActionItem(10, res["ATTACHEMENT.actionPDF"], "fa fa-file-pdf-o", false)

            this.modifierFileToEdit = new ActionItem(12, res["ATTACHEMENT.open"], "fas fa-arrow-circle-down", false)
            this.SaveFileAfterEditandDelete = new ActionItem(13, res["ATTACHEMENT.recu&sup"], "fas fa-arrow-circle-up", false)
            this.generePdf = new ActionItem(14, res['ATTACHEMENT.generatepdf'], 'fa-file-word-o', false);

            let subItems: ActionItem[] = [this.modifierFileToEdit, this.SaveFileAfterEditandDelete, this.generePdf];
            this.modifierFile = new ActionItem(11, res["ATTACHEMENT.MAJ"], "fas fa-pen-nib", false, subItems)

            this.uploadFile = new ActionItem(15, res['ATTACHEMENT.upload'], 'fa fa-upload ', false);
        })
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktopDevice = this.deviceService.isDesktop();
        this.translateService.get(['ATTACHEMENT.validFileMsg', 'ATTACHEMENT.validDocTitleMSG']).subscribe((res) => {
            this.validFileMsg = res['ATTACHEMENT.validFileMsg'];
            this.validDocTitleMSG = res['ATTACHEMENT.validDocTitleMSG'];
        });
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {

        // only run when property "data" changed
        if (changes['fileToThumbnail'] && changes['fileToThumbnail'].previousValue != changes['fileToThumbnail'].currentValue) {
            this.objectProvider = null
            this.fileItems = []

            /* INITIALISED file sys to be visualised */
            this.objectProvider = new ObjectFileSystemProvider({
                data: this.fileItems
            });

            this.count = this.fileToThumbnail.length;
            if (this.count == 0) {
                this.isarchiveiconDisabled = true;

            } else if (this.count != 0) {
                this.isarchiveiconDisabled = false;
            }
            this.fileToThumbnail.forEach(file => {
                let newfile = new FileItem()
                newfile.name = file.docTitle
                if (file.fileName && file.fileName != "null" && file.fileName != "undefined")
                    newfile.fileName = file.fileName
                else
                    this.translateService.get("ATTACHEMENT.fileNotRattached").subscribe((res) => {
                        newfile.fileName = res
                    })

                newfile.dateModified = this.formatDate.formatDFTshort(file.sysdateUpdated)
                newfile.size = file.docSize
                newfile.cmisId = file.cmisId
                newfile.responsable = file.responsable
                newfile.signed = file.signed
                this.fileInfo(file, newfile)
                newfile.isDirectory = false
                newfile.transferable = file.transferable
                newfile.locked = file.locked
                newfile.cssClass = 'custom-icon-class'
                newfile.id = file.id
                if (file.filesTypeDTO != null && file.filesTypeDTO != {}) {
                    if (file.filesTypeDTO.icon && file.filesTypeDTO.icon != null && file.filesTypeDTO.icon != undefined) {
                        newfile.icon = file.filesTypeDTO.icon
                        newfile.iconColor = file.filesTypeDTO.bgColor
                    }
                    newfile.type = file.filesTypeDTO.type
                } else
                    newfile.type = null
                if (file.thumbnail != null && file.thumbnail != undefined && file.thumbnail != '') {
                    newfile.thumbnail = ('data:image/jpg;base64,' + file.thumbnail);
                }
                this.fileItems.push(newfile)
            })
            this.fileSystemProvider = new CustomFileSystemProvider({
                getItems: (fileSystemItem) => {
                    return this.objectProvider.getItems(fileSystemItem).then(
                        function (items) {
                            const tooltipedItems = items.map(function (item: any) {
                                item.tooltipText = item.dataItem.tooltipText;
                                item.cssClass = item.dataItem.cssClass
                                return item;
                            });
                            return tooltipedItems
                        }
                    )
                },
            });

            this.fileSystemProvider._convertDataObjectsToFileItems = dataItems => dataItems;


            this.archiveButtonOpt = {
                items: [
                    {
                        icon: 'fas fa-file-archive',
                        disabled: this.isarchiveiconDisabled
                    },
                ],
                onItemClick: this.onItemClick.bind(this),
            };
            this.refreshButtonOpt = {
                items: [
                    {
                        icon: 'refresh',
                        hint: 'refresh',
                    },
                ],
                onItemClick: this.refreshfileManger.bind(this),
            };
            this.flipedDatagridButtonOpt = {
                items: [
                    {
                        icon: 'fas fa-th-list',
                        hint: 'Liste',
                    },
                ],
                onItemClick: this.flippedEvent.bind(this),
            };
            this.detailslayoutDatagridButtonOpt = {
                items: [
                    {
                        icon: 'detailslayout',
                        hint: 'details layout',
                    },
                ],
                onItemClick: this.detail.bind(this),
            };
            this.thumbnaillayoutDatagridButtonOpt = {
                items: [
                    {
                        icon: 'mediumiconslayout',
                        hint: 'thumbnails layout',
                    },
                ],
                onItemClick: this.thumbnail.bind(this),
            };
            this.addfileButtonOpt = {
                items: [
                    {
                        icon: 'plus',
                        hint: 'ajouter',
                    },
                ],
                onItemClick: this.ouvrirPopUpSaveFunction.bind(this),
            };
            this.translateService.get('ATTACHEMENT.proprite').subscribe(res => {
                this.ModifMenuOptions = {
                    items: [
                        {
                            icon: 'fa fa-pencil-square-o',
                            text: res
                        },
                    ],
                    onItemClick: this.onItemClick.bind(this),
                };
            });

            this.onItemClick = this.onItemClick.bind(this);
            this.fileManager_onSelectionChanged = this.fileManager_onSelectionChanged.bind(this);

        }
    }

    ouvrirPopUpSaveFunction() {
        this.ouvrirPopUpSave.emit(true)

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

    fileInfo(file, newfile) {
        this.translateService.get(['ATTACHEMENT.title', 'ATTACHEMENT.dateMAJ', 'ATTACHEMENT.size', 'ATTACHEMENT.fileNamee']).subscribe((res) => {
            if (file.fileName != null) {
                newfile.tooltipText = res['ATTACHEMENT.title'] + file.docTitle + '\n' +
                    res['ATTACHEMENT.dateMAJ'] + newfile.dateModified + '\n' +
                    res['ATTACHEMENT.size'] + ': ' + this.communService.formatBytes(newfile.size) + '\n' +
                    res['ATTACHEMENT.fileNamee'] + file.fileName;
            } else {
                newfile.tooltipText = res['ATTACHEMENT.title'] + file.docTitle + "\n" +
                    res["ATTACHEMENT.dateMAJ"] + newfile.dateModified + "\n" +
                    res["ATTACHEMENT.size"] + ": " + this.communService.formatBytes(newfile.size);
            }
        })

    }

    /*ACTION OF MENU ITEM WHEN CLIC*/
    onItemClick({itemData, viewArea, fileSystemItem}) {

        let updated = false;
        const button = itemData.icon

        if (button == 'download') {
            this.Downloading(fileSystemItem.dataItem);
        } else if (button == 'copy') {
            this.Cloning(fileSystemItem.dataItem);
        } else if (button == 'fa fa-paper-plane') {
            this.transferable(fileSystemItem.dataItem);
            itemData.icon = 'fa fa-unlink'
            itemData.text = 'Rendre la piéce non transférable'
        } else if (button == 'fa fa-unlink') {
            this.Untransferable(fileSystemItem.dataItem);
            itemData.icon = 'fa fa-paper-plane'
            itemData.text = 'Rendre la piéce transférable'
        } else if (button == 'fa fa-unlock') {
            this.unlocked(fileSystemItem.dataItem);
            itemData.icon = 'fa fa-lock'
            itemData.text = 'Vérrouiller'
        } else if (button == 'fa fa-lock') {
            this.locked(fileSystemItem.dataItem);
            itemData.icon = 'fa fa-unlock'
            itemData.text = 'Déverrouiller'
        } else if (button == 'fa fa-file-pdf-o') {
            this.viewFile(fileSystemItem.dataItem);
        } else if (button == 'fas fa-external-link-alt') {
            this.viewFile(this.fileManager.instance.getSelectedItems()[0].dataItem);
        } else if (button == 'fa fa-trash') {
            updated = this.deletefile(this.fileManager.instance.getSelectedItems()[0].dataItem);
        } else if (button == 'fas fa-file-archive') {
            this.downloadtout();
        } else if (button == 'refresh') {
            this.refreshfileManger();
        } else if (button == 'fa fa-pencil-square-o') {
            this.modifFile(this.fileManager.instance.getSelectedItems()[0].dataItem);
        } else if (button == 'fas fa-arrow-circle-down') {
            this.OnclickModifierFileToEdit(this.fileManager.instance.getSelectedItems()[0].dataItem);
            this.checkIfFileExist(this.fileManager.instance.getSelectedItems()[0].dataItem);
        } else if (button == 'fa-file-word-o') {
            this.OnclickDocxToPDF(this.fileManager.instance.getSelectedItems()[0].dataItem);
        } else if (button == 'fa fa-upload ') {
            this.UploadFileStep1(this.fileManager.instance.getSelectedItems()[0].dataItem);
        } else if (button == 'fas fa-arrow-circle-up') {
            let enableDelete
            if (this.fileBusy === false)
                enableDelete = true
            else
                enableDelete = false
            this.OnclickSaveFileAfterEdit(this.fileManager.instance.getSelectedItems()[0].dataItem, enableDelete);
            this.checkIfFileExist(this.fileManager.instance.getSelectedItems()[0].dataItem);
        }


    }

    refreshbyemitevent() {
        /*Refresh grid && emit event && refresh thumbnail not init*/
        this.getAllbyId.emit(this.filedatasource);
        this.fileManager.instance.refresh();

    }

    refreshfileManger() {
        /*Refresh grid && emit event && refresh thumbnail not init*/
        this.refreshThumbnailGrid();
        this.verifLicensePSTKDatagridAttachement();
    }

    /*TO REFRESH MENU ITEM */
    fileManager_onSelectionChanged(e) {
        if (e.selectedItems.length > 0) {
            this.actionItems = [this.actionViwer, this.actiongestionPDF, this.actionUpdate, this.actionDelete, this.actiondownlowd, this.actioncloned, this.actionTrs, this.actionUnTrs, this.actionVer, this.actionDeve, this.modifierFile, this.uploadFile]
            e.component.option('contextMenu.items', this.actionItems)
            let array: any[] = e.component.option('contextMenu.items')

            let indexdownload = array.map(x => x.id).indexOf(4) /*id ==> 4 Télecharger*/
            if (((e.selectedItems[0].dataItem.size === null) && indexdownload != undefined && indexdownload != null && indexdownload != -1) || !this.canDonwloadfile) {
                array.splice(indexdownload, 1);
                e.component.option('contextMenu.items', array);
            }

            let indexdelete = array.map(x => x.id).indexOf(3)/*id ==> 3 Supprimer*/
            if (((e.selectedItems[0].dataItem.locked == true || !this.ContainerViewer) && indexdelete != undefined && indexdelete != null && indexdelete != -1) || !this.canDelete) {
                array.splice(indexdelete, 1);
                e.component.option('contextMenu.items', array);
            }
            let indexupload = array.map(x => x.id).indexOf(15)/*id ==> 15 Remplacer*/
            if (((e.selectedItems[0].dataItem.locked == true || !this.ContainerViewer) && indexupload != undefined && indexupload != null && indexupload != -1) || !this.canUploadfile) {
                array.splice(indexupload, 1);
                e.component.option('contextMenu.items', array);
            }

            let indexcloned = array.map(x => x.id).indexOf(5) /*id ==> 5 Créer une copie*/
            if (((e.selectedItems[0].dataItem.size === null || !this.ContainerViewer) && indexcloned != undefined && indexcloned != null && indexcloned != -1) || !this.canClone) {
                array.splice(indexcloned, 1);
                e.component.option('contextMenu.items', array);
            }

            let indexTransfrable = array.map(x => x.id).indexOf(6) /*id ==> 6 Rendre la piéce transférable*/
            if (((e.selectedItems[0].dataItem.size === null || e.selectedItems[0].dataItem.transferable == false || !this.ContainerViewer) && indexTransfrable != undefined && indexTransfrable != null && indexTransfrable != -1) || !this.canTransfert) {
                array.splice(indexTransfrable, 1);
                e.component.option('contextMenu.items', array);
            }
            let indexunTransfrable = array.map(x => x.id).indexOf(7)/*id ==> 6 Rendre la piéce non transférable */
            if (((e.selectedItems[0].dataItem.size === null || e.selectedItems[0].dataItem.transferable == true || !this.ContainerViewer) && indexunTransfrable != undefined && indexunTransfrable != null && indexunTransfrable != -1) || !this.canTransfert) {
                array.splice(indexunTransfrable, 1);
                e.component.option('contextMenu.items', array);
            }

            let indexlocked = array.map(x => x.id).indexOf(8)/*id ==> 8 Vérrouiller*/
            if (((e.selectedItems[0].dataItem.locked == true || !this.ContainerViewer) && indexlocked != undefined && indexlocked != null && indexlocked != -1) || !this.canlock) {
                array.splice(indexlocked, 1);
                e.component.option('contextMenu.items', array);
            }
            this.canUnLock = e.selectedItems[0].dataItem.canUnLock;
            let indexununlocked = array.map(x => x.id).indexOf(9)/*id ==> 9 Déverrouiller*/
            if (((e.selectedItems[0].dataItem.locked == false || !this.ContainerViewer) && indexununlocked != undefined && indexununlocked != null && indexununlocked != -1) || !this.canlock) {
                array.splice(indexununlocked, 1);
                e.component.option('contextMenu.items', array);
            }

            let indexActionsPdf = array.map(x => x.id).indexOf(10)/*id ==> 10 Actions Pdf*/
            if ((e.selectedItems[0].dataItem.size === null || (e.selectedItems[0].dataItem.type === null || e.selectedItems[0].dataItem.type != 'application/pdf' || !this.isDesktopDevice)
                && indexActionsPdf != undefined && indexActionsPdf != null && indexActionsPdf != -1) || !this.canActionPDF) {
                array.splice(indexActionsPdf, 1);
                e.component.option('contextMenu.items', array);
            }

            let fileType = ""
            let indexviwer = array.map(x => x.id).indexOf(1)/*id ==> 1  Visualiser*/
            if (e.selectedItems[0].dataItem.type && e.selectedItems[0].dataItem.type != '' && e.selectedItems[0].dataItem.type != null && e.selectedItems[0].dataItem.type != undefined) {
                fileType = e.selectedItems[0].dataItem.type;
            }
            if (((e.selectedItems[0].dataItem.size === null || e.selectedItems[0].dataItem.type === null ||
                    !(fileType === 'application/json' || fileType === 'text/plain' || fileType === 'image/jpeg' || fileType === 'image/png' ||
                        fileType === 'image/gif' || fileType === 'image/tiff' || fileType === 'image/bmp' || fileType === 'image/svg+xml') || e.selectedItems[0].dataItem.type == 'application/pdf')
                && (indexviwer != undefined && indexviwer != null && indexviwer != -1)) || !this.canShowfile) {
                array.splice(indexviwer, 1);
                e.component.option('contextMenu.items', array);
            }
            this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';

            let indexModif = array.map(x => x.id).indexOf(11)/*id ==> 10  Mettre à jour*/
            if (((e.selectedItems[0].dataItem.size === null || !this.isDesktopDevice || !this.pstkEnabledAndRunning || !this.authorizationTokenOffice) && indexModif != undefined && indexModif != null && indexModif != -1) || !this.canModiffile) {
                array.splice(indexModif, 1);
                e.component.option('contextMenu.items', array);
            } else {
// A voir
                /*     this.checkIfFileExist(e.selectedItems[0].dataItem);

                     let newArray =  array[indexModif].subItems


                     let indexmodifierFileToEdit = newArray.map(x => x.id).indexOf(12)
                     let saveFileAfterEditandDelete = newArray.map(x => x.id).indexOf(13)
                     let generePdf = newArray.map(x => x.id).indexOf(14)

                    if(this.fileBusy && indexmodifierFileToEdit != -1  )
                    newArray.splice(indexmodifierFileToEdit,1)


                    if(this.disabledSaved && saveFileAfterEditandDelete != -1 )
                    newArray.splice(saveFileAfterEditandDelete,1)

                    if(this.genepdf && generePdf != -1 )
                    newArray.splice(generePdf,1)

                    array[indexModif].subItems = newArray

                    e.component.option('contextMenu.items', array);*/


            }
        } else {
            this.actionItems = []
        }
    }

    /* * **** *** SIGNATURE PDF ***** *  ** * */
    async signedEvent(event) {
        this.fileContent = event
        var fileURL = URL.createObjectURL(this.fileContent);
        this.jsondocviewer.pdfSrcc = fileURL;
        this.jsondocviewer.visionneuse = "url";
    }

    /*Custimize icon*/
    customizeIcon(fileSystemItem) {
        if ((!fileSystemItem.thumbnail || fileSystemItem.thumbnail == null || fileSystemItem.thumbnail == undefined || fileSystemItem.thumbnail == "")
            && (fileSystemItem.dataItem.icon && fileSystemItem.dataItem.icon != null && fileSystemItem.dataItem.icon != undefined && fileSystemItem.dataItem.icon != "")) {

            document.documentElement.style.setProperty('--IconColor)', fileSystemItem.dataItem.iconColor);

            return (fileSystemItem.dataItem.icon);
            // fileSystemItem.cssClass = 'dx-icon-customCSSRed';
        } else if ((!fileSystemItem.thumbnail || fileSystemItem.thumbnail == null || fileSystemItem.thumbnail == undefined || fileSystemItem.thumbnail == "")
            &&
            (!fileSystemItem.dataItem.icon || fileSystemItem.dataItem.icon == null || fileSystemItem.dataItem.icon == undefined || fileSystemItem.dataItem.icon == "")) {
            if (fileSystemItem.dataItem.type != null) {
                const myArray = fileSystemItem.dataItem.fileName.split(".");
                let fileExtension = myArray[1].toLowerCase();
                if (fileExtension === "pptx" || fileExtension === "pptx" || fileExtension === "pptm")
                    return './assets/thumbnails/ppt.png';
                else if (fileExtension === 'doc' || fileExtension === 'docx' || fileExtension === 'docm' || fileExtension === 'dotm')
                    return './assets/thumbnails/word.png';
                else if (fileExtension === 'pdf')
                    return './assets/thumbnails/pdf.png';
                else if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'xlsm' || fileExtension === 'xlsb' || fileExtension === 'xltx' || fileExtension === 'csv')
                    return './assets/thumbnails/excel.png';
                else if (fileExtension === 'xml')
                    return 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-xml.svg';
                else if (fileExtension === 'txt')
                    return 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-txt.svg';
                else return 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-txt.svg';
            } else
                return './assets/thumbnails/interrompue.png';
            // switch (word) {
            //     // case '.txt':
            //     //     return './../../../../../assets/thumbnails/txt.png';
            //     // case '.rtf':
            //     //     return 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-rtf.svg';
            // }
        } else {
            return fileSystemItem.thumbnail;
        }
    }

    /*FLIPED EVENT SEND*/
    flippedEvent() {
        this.flipped = !this.flipped;
        this.outputFilpped.emit(this.flipped);
    }

    detail() {
        this.mode = 'details';
    }

    thumbnail() {
        this.mode = 'thumbnails';
    }

    /*INITIAL REFRESH*/
    refreshInitThumbnail() {
        this.objectProvider = null;

        this.objectProvider = new ObjectFileSystemProvider({
            data: this.fileItems
        });
        this.fileSystemProvider = new CustomFileSystemProvider({
            getItems: (fileSystemItem) => {
                this.refreshInit();
                this.fileManager.instance.refresh();
                return this.objectProvider.getItems(fileSystemItem).then(
                    function (items) {
                        const tooltipedItems = items.map(function (item: any) {
                            item.tooltipText = item.dataItem.tooltipText;
                            return item;
                        });
                        return tooltipedItems;
                    }
                );
            },
        });
    }

    /*refresh init*/
    refreshInit() {
        this.getfilesByClassIdAndObjectIdInit(this.classid, this.objectid, this.fileAccessToken)
    }

    /*refresh init*/

    getfilesByClassIdAndObjectIdInit(classeid, objectid, fileAccessToken) {
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
                this.fileItems = []
                this.filedatasource.forEach(file => {
                    let newfile = new FileItem()
                    newfile.name = file.docTitle
                    // newfile.name = file.docTitle
                    newfile.fileName = file.fileName
                    newfile.isDirectory = false
                    newfile.transferable = file.transferable
                    newfile.locked = file.locked
                    newfile.dateModified = this.formatDate.formatDFTshort(file.sysdateUpdated)
                    newfile.size = file.docSize
                    newfile.cmisId = file.cmisId
                    newfile.responsable = file.responsable
                    newfile.signed = file.signed
                    this.fileInfo(file, newfile)
                    newfile.cssClass = 'custom-icon-class'
                    newfile.id = file.id
                    if (file.filesTypeDTO != null && file.filesTypeDTO != {} && file.filesTypeDTO.icon != null && file.filesTypeDTO.icon != undefined) {
                        newfile.icon = file.filesTypeDTO.icon
                        newfile.iconColor = file.filesTypeDTO.bgColor
                        newfile.type = file.filesTypeDTO.type
                    } else
                        newfile.type = null
                    if (file.thumbnail != null && file.thumbnail != undefined && file.thumbnail != '') {
                        newfile.thumbnail = ('data:image/jpg;base64,' + file.thumbnail);
                    }
                    this.fileItems.push(newfile)
                })
            }
        }, error1 => {
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

    screen() {
        return 'sm';
    }

    creatingIcon(icon) {
        if (icon !== null && icon !== undefined && icon !== "" && icon !== {})
            return "fa " + icon
    }

    /*REFRESH*/
    refreshThumbnailGrid() {
        this.refresh()
    }

    refresh() {
        this.getfilesByClassIdAndObjectId(this.classid, this.objectid, this.fileAccessToken)
    }

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
                this.fileItems = []
                this.filedatasource.forEach(file => {
                    let newfile = new FileItem()
                    newfile.name = file.docTitle
                    // newfile.name = file.docTitle
                    newfile.fileName = file.fileName
                    newfile.dateModified = this.formatDate.formatDFTshort(file.sysdateUpdated)
                    newfile.size = file.docSize
                    newfile.cmisId = file.cmisId
                    newfile.responsable = file.responsable
                    newfile.signed = file.signed
                    this.fileInfo(file, newfile)
                    newfile.isDirectory = false
                    newfile.transferable = file.transferable
                    newfile.locked = file.locked
                    newfile.cssClass = 'custom-icon-class'
                    newfile.id = file.id
                    if (file.filesTypeDTO != null && file.filesTypeDTO != {}) {
                        if (file.filesTypeDTO.icon != null && file.filesTypeDTO.icon != undefined) {
                            newfile.icon = file.filesTypeDTO.icon
                            newfile.iconColor = file.filesTypeDTO.bgColor
                        }
                        newfile.type = file.filesTypeDTO.type
                    } else
                        newfile.type = null
                    if (file.thumbnail != null && file.thumbnail != undefined && file.thumbnail != '') {
                        newfile.thumbnail = ('data:image/jpg;base64,' + file.thumbnail);
                    }
                    this.fileItems.push(newfile)
                })
                this.objectProvider = null
                this.objectProvider = new ObjectFileSystemProvider({
                    data: this.fileItems
                })
                this.fileManager.instance.refresh();
            }
        }, error1 => {
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

    /*Double CLick to item  */
    fileManager_onSelectedFileOpened(e) {

        if (e.file.dataItem != null && e.file.dataItem != undefined) { // Your code goes here
            let fileType = e.file.dataItem.type
            if (fileType === "application/json" || fileType === "text/plain" || fileType === "image/jpeg" || fileType === "image/png" ||
                fileType === "image/gif" || fileType === "image/tiff" || fileType === "image/bmp" || fileType === "image/svg+xml" || fileType === "application/pdf")
                this.viewFile(e.file.dataItem);
            else {
                this.Downloading(e.file.dataItem);
            }
        }
    }

    /*ACTIONS*/
    Downloading(itemData) {
        try {
            this.loadingVisible = true;
            this.fileservice.extractfileById(itemData.id, this.fileAccessToken).subscribe(async (data: any) => {
                var fileName = await data.headers.get('filename')
                const f1 = new Blob([data.body], {type: itemData.type});
                // window.open(data)
                FileSaver.saveAs(f1, fileName);
                this.Ref.value = fileName

                this.translateService.get("ATTACHEMENT.extractFileWithSuccess", this.Ref).subscribe((res) => {
                    this.loadingVisible = false;
                    this.toastr.success(res, '', {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                })
            }, () =>
                this.translateService.get("ATTACHEMENT.downloadFileErr", this.Ref).subscribe((res) => {
                    this.loadingVisible = false;
                    this.toastr.error(res, '', {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                }))
        } catch (error) {
            this.loadingVisible = false
            this.translateService.get("ATTACHEMENT.downloadFileErr", this.Ref).subscribe((res) => {
                this.toastr.error(res, " ", {
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

    Cloning(itemData) {
        let paramsHttp = new HttpParamMethodPutNEwFormat(this.env.apiUrlkernel + "AttachmentCloned/" + itemData.id + "?fileAccessToken=" + this.fileAccessToken, itemData)
        this.Ref.value = itemData.name

        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.cloned", "ATTACHEMENT.clonelError").then(data => {
            // if (data["statut"] == true) {
            this.refresh();
            // }
        })
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
                        this.loadingVisible = false;
                        this.toastr.error(res, "", {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                    })
            )
        } catch (error) {
            this.loadingVisible = false
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
        }
    }

    transferable(itemData) {
        let jsonFile
        this.fileservice.getFileById(itemData.id).subscribe((file: any) => {
            jsonFile = file;
            jsonFile.transferable = true;
            jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;
            this.Ref.value = itemData.name
            let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
            this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.Transferable", "ATTACHEMENT.TransferableError").then(data => {
                this.refresh();

            })
        })
    }

    Untransferable(itemData) {
        let jsonFile
        this.fileservice.getFileById(itemData.id).subscribe((file: any) => {
            jsonFile = file;
            jsonFile.transferable = false;
            jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;
            this.Ref.value = itemData.name

            let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
            this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.UnTransferable", "ATTACHEMENT.UnTransferableError").then(data => {
                this.refresh();

            })
        })
    }

    locked(itemData) {
        let jsonFile
        this.fileservice.getFileById(itemData.id).subscribe((file: any) => {
            jsonFile = file;
            jsonFile.locked = true;
            jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;
            this.Ref.value = itemData.name

            let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
            this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.locked", "ATTACHEMENT.lockedError").then(data => {
                this.refresh();

            })
        })
    }

    unlocked(itemData) {
        let jsonFile
        this.fileservice.getFileById(itemData.id).subscribe((file: any) => {
            jsonFile = file;
            jsonFile.locked = false;
            jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;
            let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
            this.Ref.value = itemData.name

            this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.Unlocked", "ATTACHEMENT.UnlockedError").then(data => {
                this.refresh();

            })
        })
    }

    /*office template*/

    async viewFile(data) {
        this.loadingVisible = true;
        this.filebyId = data;
        this.id = data.id;
        this.fileName = data.fileName;
        let rslt = false
        this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';

        this.closeViwerPopUp()

        if (data.signed === true && data.locked === false && this.pstkEnabledAndRunning) {
            this.avertismentPopUp = true
        }
        this.idFileViewer = data.id
        this.idcmis = data.cmisId

        if (this.idFileViewer != null) {
            try {
                let verifLicensePSTKScan: any;
                let verifLicensePSTKSign: any;

                this.fileservice.extractfileByIdJson(this.idFileViewer, this.fileAccessToken).subscribe(async (response: any) => {
                    this.fileType = data.type;
                    if (this.fileType) {
                        this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(response));
                        if (this.fileType == 'application/pdf') {
                            this.permissionToTopViewer = true;
                            verifLicensePSTKScan = await this.communService.verifLicensePSTK(this.ModuleScan);
                            this.permissionDenied = data.locked == false && this.ContainerViewer && this.pstkEnabledAndRunning && verifLicensePSTKScan;
                            verifLicensePSTKSign = await this.communService.verifLicensePSTK(this.ModuleSign);
                            this.permissionDeniedSig = this.ContainerViewer && this.pstkEnabledAndRunning && verifLicensePSTKSign;
                        } else {
                            this.permissionToTopViewer = false;
                        }
                        let blobFile = new Blob([new Uint8Array(response)], {type: this.fileType});
                        var fileURL = URL.createObjectURL(blobFile);
                        this.jsondocviewer.pdfSrcc = fileURL;
                        this.jsondocviewer.visionneuse = 'url';
                        if (this.fileType === 'application/pdf' && this.pstkEnabledAndRunning && verifLicensePSTKScan) {
                            let authorizationtokenScan = await this.communService.authorizationToken(this.ModuleScan);


                            this.fileId = this.idFileViewer;

                            this.fileservice.getpageNbre(authorizationtokenScan, this.base64).then(res => {
                                this.pgNbr = res.result.totalpage;
                                this.loadingVisible = false;
                                this.visibleTrueModal = true;
                            }, err => {
                                this.loadingVisible = false;
                                this.visibleTrueModal = true;
                            });
                        } else {
                            this.loadingVisible = false;
                            this.visibleTrueModal = true;
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

    /*scan before && after*/
    BASE64_Output_Save($event: any) {
        this.loadingVisible = true
        this.base64 = $event
        let obj = new FormData()
        if (this.fileContent != null && this.fileContent != undefined)
            obj.append("multipartFiles", this.fileContent)
        if (this.idcmis != null && this.idcmis != undefined)
            obj.append("cmisId", this.idcmis)
        if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null)
            obj.append("objectData", JSON.stringify(this.objectData));
        if ((this.objectData) != undefined && (this.objectData) != null && (this.objectData).securiteLevel != null && (this.objectData).securiteLevel != undefined)
            obj.append("ObjectDatasecuriteLevel", (this.objectData).securiteLevel);
        this.Ref.value = this.fileName

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + 'attachementsSetContent/' + this.idFileViewer + '?fileAccessToken=' + this.fileAccessToken, obj)
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.save_delete", "ATTACHEMENT.save_deleteMAJfailed").then(data => {
            this.refresh();

            if (data["statut"] == true) {
                this.closeViwerPopUp()

            }
            this.loadingVisible = false

        })
    }

    getBASE64_Output($event: any) {
        this.reloadViewer($event);
    }

    reloadViewer(base64) {
        let arraybuffer = this.communService.base64ToArrayBuffer(base64);
        this.fileContent = new File([arraybuffer], this.fileName, {type: this.fileType});
        var fileURL = URL.createObjectURL(this.fileContent);
        this.jsondocviewer.pdfSrcc = fileURL;
        this.jsondocviewer.visionneuse = 'url';
    }


    /*FOR SCANNER */

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

    /*ATTACHED FILE FROM CARD INTERFACE*/
    attached() {
        document.getElementById("addfile" + this.idFileRemplace).click();
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
                    this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
                    let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan);
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
                                })
                            }
                        )
                    } else {
                        this.disableSave = false
                    }
                    this.loadingVisible = false;
                    if (decision) {
                        do {
                            this.translateService.get("ATTACHEMENT.chargepagescanner").subscribe(title => {
                                decision = window.confirm(title);
                            })
                            if (decision) {
                                this.Scanner(this.cookieService.get('scannerName'), scannerProfil, res.result.tmpFileName, title, authorizationToken);
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

    /*Office*/
    initofficeVisble() {
        this.officeVisble = !(this.objectid != null && this.classid != null)
        return this.officeVisble
    }

    /*Office template*/
    OfficeTemplatePopUpOpen() {
        let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'findOfficeTemplate', this.objectData)
        this.httpServicesComponent.method(paramsHttp, '', "ATTACHEMENT.OfficeTemplateSucces", "ATTACHEMENT.OfficeTemplateError").then(data => {
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
                    hint: 'refresh',
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

    async viewFileNotAdded() {
        if (this.fileType === "application/json" || this.fileType === "text/plain" || this.fileType === "image/jpeg" ||
            this.fileType === "image/png" || this.fileType === "image/gif" || this.fileType === "image/tiff" || this.fileType === "image/bmp" ||
            this.fileType === "image/svg+xml" || this.fileType === "application/pdf") {
            if (this.fileContent != null || this.blobContent != null) {
                this.loadingVisible = true;
                this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
                let verifLicensePSTKSign: any = await this.communService.verifLicensePSTK(this.ModuleSign);
                this.permissionDeniedSig = (this.ContainerViewer && this.pstkEnabledAndRunning && verifLicensePSTKSign);
                this.permissionToTopViewer = (this.fileType === 'application/pdf');
                var fileURL = URL.createObjectURL(this.blobContent);
                this.jsondocviewer.pdfSrcc = fileURL;
                this.jsondocviewer.visionneuse = 'url';

                if (this.fileType === "application/pdf") {
                    let obj = new FormData()
                    if (this.fileContent != null && this.fileContent != undefined)
                        obj.append("multipartFiles", this.fileContent)
                    let paramsHttp = new HttpParamMethodPost(this.env.apiUrlkernel + 'IsSigned', obj)
                    this.Ref.value = this.fileName

                    this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.rattachement", "ATTACHEMENT.rattachmentEroor", false).then(data => {
                        if (data["statut"] == true)
                            this.avertismentPopUp = data["value"]
                    })
                }


                this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'
                let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan)

                if (this.fileType === "application/pdf" && this.pstkEnabledAndRunning && verifLicensePSTKScan) {
                    let authorizationtokenScan = await this.communService.authorizationToken(this.ModuleScan)

                    this.fileservice.getpageNbre(authorizationtokenScan, this.base64).then(res => {
                        this.pgNbr = res.result.totalpage
                    }, err => {
                        // console.error(err)

                    })
                }
                this.visibleTrueModal = true;

                this.loadingVisible = false;
            }
        } else {
            var fileURL = URL.createObjectURL(this.blobContent);

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

    attachementsSetContent() {
        this.loadingVisible = true;
        let obj = new FormData();
        if (this.fileContent != null && this.fileContent != undefined) {
            obj.append('multipartFiles', this.fileContent);
        }
        if (this.UploadFileForTemplace.cmisId != null && this.UploadFileForTemplace.cmisId != undefined) {
            obj.append('cmisId', this.UploadFileForTemplace.cmisId);
        }
        if (JSON.stringify(this.objectData) != undefined && JSON.stringify(this.objectData) != null) {
            obj.append('objectData', JSON.stringify(this.objectData));
        }
        if ((this.objectData) != undefined && (this.objectData) != null && (this.objectData).securiteLevel != null && (this.objectData).securiteLevel != undefined) {
            obj.append('objectDatasecuriteLevel', (this.objectData).securiteLevel);
        }
        this.Ref.value = this.UploadFileForTemplace.name;
        this.loadingVisible = false;
        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + 'attachementsSetContent/' + this.UploadFileForTemplace.id + '?fileAccessToken=' + this.fileAccessToken, obj);
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.MessageMiseajour", "ATTACHEMENT.editErreur").then(data => {
            this.refresh();

            if (data['statut'] == true) {
                this.closeViwerPopUp()
                this.deletefileAttached()
            }
        })
    }


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
            this.loadingVisible = false;
        } else {
            this.disableSave = false;
            this.fileType = this.fileContent.type;
            this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
            let verifLicensePSTKScan: any = await this.communService.verifLicensePSTK(this.ModuleScan);
            this.permissionDenied = (this.pstkEnabledAndRunning && verifLicensePSTKScan);
            this.permissionToTopViewer = (this.fileType === 'application/pdf');

            this.avertismentPopUp = false;
            this.fileContent.arrayBuffer().then(async (arrayBuffer) => {
                this.blobContent = new Blob([new Uint8Array(arrayBuffer)], {type: this.fileType});
                this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(arrayBuffer));

            });
            this.loadingVisible = false;
        }
    }

    /*DELETE AND CONFIRME DELETE FILE*/
    UploadFileStep1(itemData: any) {
        this.upladPopUP = true
        this.UploadFileForTemplace = itemData
        this.idFileRemplace = itemData.id;

    }

    deletefileAttached() {
        this.fileName = null
        this.fileContent = null
        this.popupDeleteFileVisibleAttached = false
        this.saveFromScanner = false;
        this.pgNbr = null
        this.upladPopUP = false
        this.sizeInput = null
    }

    deletefile(itemData) {
        // this.Filename = data.fileName;
        this.fileTodelete = itemData;
        this.popupDeleteFileVisible = true;
        return true
    }

    save(fileTemplate) {
        let jsonFile = fileTemplate
        jsonFile.objectDatasecuriteLevel = this.objectData.securiteLevel;
        this.Ref.value = jsonFile.name

        let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + "attachements/" + jsonFile.id, jsonFile)
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.MessageMiseajour", "ATTACHEMENT.editErreur").then(data => {
            if (data["statut"] == true) {
                this.popupModifFileVisible = false
                this.refreshThumbnailGrid()
                this.getAllbyId.emit(this.filedatasource)
                this.fileManager.instance.refresh();
            }
        })
    }

    lazyy() {
        // this.dataSourcepersonne = {
        //     store: new CustomStore({
        //         key: "sid",
        //         load: (loadOptions) => {
        //             let params: any = "";
        //             if (loadOptions.skip == undefined && loadOptions.take == undefined) {
        //                 params += '?page=' + 0;
        //                 params += '&size=' + this.env.pageSize;
        //             } else {
        //                 params += '?page=' + loadOptions.skip / loadOptions.take || 0;
        //                 params += '&size=' + loadOptions.take || this.env.pageSize;
        //             }
        //             if (loadOptions.searchValue) {
        //                 params += '&' + loadOptions.searchExpr + '.contains=' + loadOptions.searchValue;
        //             }
        //             return this.http.get(`${this.env.moduleNameKernel}` + this.env.WS.getAllAclSid + params,
        //                 {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
        //                 .toPromise()
        //                 .then((result: any[]) => {
        //                     return result;
        //                 });
        //         },
        //         byKey: (key) => {
        //             return null
        //         }
        //     }),
        //     paginate: true,
        //     pageSize: this.env.pageSize
        //
        // };
    }

    changeResp(e) {
        this.resp = (e.value)
    }

    modifFile(itemData) {
        this.idFileToModif = itemData.id
        this.fileservice.getFileById(this.idFileToModif).subscribe((file: any) => {
            this.fileTemplate = file
            if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.maxCopies && this.fileTemplate.requestFileDefinition.maxCopies != null && this.fileTemplate.requestFileDefinition.maxCopies != undefined && this.fileTemplate.requestFileDefinition.maxCopies != 0)
                this.maxCopies = this.fileTemplate.maxCopies
            if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.minCopies && this.fileTemplate.requestFileDefinition.minCopies != null && this.fileTemplate.requestFileDefinition.minCopies != undefined && this.fileTemplate.requestFileDefinition.minCopies != 0)
                this.minCopies = this.fileTemplate.minCopies
            if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.labelEditable !== null && this.fileTemplate.requestFileDefinition.labelEditable !== undefined && this.fileTemplate.requestFileDefinition.labelEditable !== "" && this.fileTemplate.requestFileDefinition.labelEditable !== {})
                this.labelEditable = this.fileTemplate.requestFileDefinition.labelEditable
            this.editorOptionsName = {
                readOnly: !this.labelEditable,
            }
            if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.description !== null && this.fileTemplate.requestFileDefinition.description !== undefined && this.fileTemplate.requestFileDefinition.description !== "" && this.fileTemplate.requestFileDefinition.description !== {})
                this.massageExpressionRegulier += this.fileTemplate.requestFileDefinition.description
            if (this.fileTemplate.requestFileDefinition && this.fileTemplate.requestFileDefinition.idRegex !== null && this.fileTemplate.requestFileDefinition.idRegex !== undefined && this.fileTemplate.requestFileDefinition.idRegex !== "" && this.fileTemplate.requestFileDefinition.idRegex !== {})
                this.namePattern = true

            this.FormatDisplayDateDEmiss = this.formatDate.formatDFshortNEW(this.fileTemplate.docExpirationDate)

            this.FormatDisplayDateDExpir = this.formatDate.formatDFshortNEW(this.fileTemplate.docIssueDate)
            this.editorOptionsDateExpiration = {
                min: this.minDateExpiration,
                onValueChanged: this.changeDateExpiration.bind(this),
                displayFormat: this.FormatDisplayDateDExpir,

            }
            this.editorOptionsDateEmission = {
                max: this.dateSystem,
                onValueChanged: this.changeDateEmission.bind(this),
                displayFormat: this.FormatDisplayDateDEmiss,

            }
            this.editorOptions = {
                dataSource: this.dataSourcepersonne,
                valueExpr: 'sid',
                displayExpr: 'sid',
                searchEnabled: 'true',
                searchExpr: 'sid',
                stylingMode: "filled",
                labelMode: "static",
                onValueChanged: this.changeResp.bind(this),

            }


            if (this.fileTemplate && this.fileTemplate.maxCopies && this.fileTemplate.maxCopies != null && this.fileTemplate.maxCopies != undefined && this.fileTemplate.maxCopies != 0)
                this.maxCopies = this.fileTemplate.maxCopies
            if (this.fileTemplate && this.fileTemplate.minCopies && this.fileTemplate.minCopies != null && this.fileTemplate.minCopies != undefined && this.fileTemplate.minCopies != 0)
                this.minCopies = this.fileTemplate.minCopies
            this.popupModifFileVisible = true
            if (this.objectData) {
                if (this.objectData.mandatoryTemplateFileName) {
                    if (this.objectData.mandatoryTemplateFileName.includes(',')) {
                        let listmandotory = this.objectData.mandatoryTemplateFileName.split(',')
                        listmandotory.forEach(i => {
                            if (this.fileTemplate.requestFileDefinition.name == i) {
                                this.backgroundColor = "#edc1c1;"
                                this.boxShadow = "0 2px 5px #f305056b, 0 2px 10px #0000001f !important;"
                            }
                        })
                    } else {
                        if (this.fileTemplate.requestFileDefinition.name == this.objectData.mandatoryTemplateFileName) {
                            this.backgroundColor = "#edc1c1;"
                            this.boxShadow = "0 2px 5px #f305056b, 0 2px 10px #0000001f !important;"
                        }
                    }
                }
                if (this.objectData.optionalTemplateFileName) {
                    if (this.objectData.optionalTemplateFileName.includes(',')) {
                        let listoptional = this.objectData.optionalTemplateFileName.split(',')
                        listoptional.forEach(i => {
                            if (this.fileTemplate.requestFileDefinition.name == i) {
                                this.backgroundColor = "rgb(151 227 146 / 70%);";
                                this.boxShadow = "#b6ebb2 0px 2px 5px, rgb(0 0 0 / 12%) 0px 2px 10px !important;"
                            }
                        })
                    } else {
                        if (this.fileTemplate.requestFileDefinition.name === this.objectData.optionalTemplateFileName) {
                            this.backgroundColor = "rgb(151 227 146 / 70%);";
                            this.boxShadow = "#b6ebb2 0px 2px 5px, rgb(0 0 0 / 12%) 0px 2px 10px !important;"
                        }
                    }
                }
                if (this.objectData.defaultTemplateFileName) {
                    (this.objectData.defaultTemplateFileName).forEach(i => {
                        if (this.fileTemplate.requestFileDefinition.name == i) {
                            this.backgroundColor = "aliceblue;";
                            this.boxShadow = "aliceblue 0px 2px 5px, rgb(0 0 0 / 12%) 0px 2px 10px !important;"
                        }
                    })
                }
            }

        })
        // this.Filename = data.fileName;
        this.idModifFile = itemData.id;
    }

    Confirmdelete() {
        this.popupDeleteFileVisible = false;
        this.Ref.value = this.fileTodelete.name

        let paramsHttp = new HttpParamMethodDelete(this.env.apiUrlkernel + "attachementRemove?id=" + this.fileTodelete.id + "&fileAccessToken=" + this.fileAccessToken, '')
        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.deleted", "ATTACHEMENT.deleteError").then(data => {
            this.refreshbyemitevent()
        })
    }

    /*ACTIONS*/
    /***************************editing row*****************/

    /*MIN DATE EXPIRATION*/
    changeDateEmission(e) {
        this.minDateExpiration = e.value
        this.FormatDisplayDate = this.formatDate.formatDFshortNEW(e.value)
        this.editorOptionsDateEmission = {
            max: this.dateSystem,
            displayFormat: this.FormatDisplayDate,
        }
    }

    changeDateExpiration(e) {
        this.FormatDisplayDateExpiration = this.formatDate.formatDFshortNEW(e.value)
        this.editorOptionsDateExpiration = {
            min: this.minDateExpiration,
            displayFormat: this.FormatDisplayDateExpiration,
        }
    }


    /*Convert size*/
    formatBytes(bytes, decimals = 2) {
        this.communService.formatBytes(bytes, decimals = 2)
    }

    /*Convert size*/


    /*TESTER*/
    async OnclickDocxToPDF(data) {
        this.loadingVisible = true
        let authorizationtokenOffice = await this.communService.authorizationToken(this.ModuleOffice)

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
    }

    async OnclickModifierFileToEdit(data) {
        this.loadingVisible = true
        let authorizationtokenOffice = await this.communService.authorizationToken(this.ModuleOffice)

        this.base64 = null
        this.fileservice.extractfileByIdJson(data.id, this.fileAccessToken).subscribe((response: any) => {
            this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(response));
            this.fileservice.openFileForEdit(authorizationtokenOffice, data.fileName, this.classid + '_' + this.objectid + '_' + data.name, this.base64).then(res => {
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
                this.toastr.error(error, res, {
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
        return true
    }

    async OnclickSaveFileAfterEdit(data, enableDelete) {
        this.loadingVisible = true
        try {
            let authorizationtokenOffice = await this.communService.authorizationToken(this.ModuleOffice)

            this.fileservice.SaveFileAfterEdit(authorizationtokenOffice, data.fileName, this.classid + '_' + this.objectid + '_' + data.name, enableDelete).then(async (res) => {
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
                this.Ref.value = data.name

                let paramsHttp = new HttpParamMethodPatch(this.env.apiUrlkernel + 'attachementsSetContent/' + data.id + '?fileAccessToken=' + this.fileAccessToken, obj)
                this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.save_delete", "ATTACHEMENT.save_deleteMAJfailed").then(data => {
                    this.refresh();

                    // if (data["statut"] == true) {
                    //     this.refresh();
                    // }
                    this.loadingVisible = false
                })
            }, err => {
                this.Ref.value = data.fileName

                this.translateService.get("ATTACHEMENT.SaveAfterEditError", this.Ref).subscribe((res) => {
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

    async checkIfFileExist(data) {
        this.disabledSaved = true
        this.fileBusy = false
        this.genepdf = true
        this.showiconEcraseContenu = false
        let authorizationtokenOffice = await this.communService.authorizationToken(this.ModuleOffice)


        if (data.type && data.type != '' && data.type != null && data.type != undefined) {
            const fileType = data.type
            //all word file mime type
            if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                fileType === "application/msword" ||
                fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.template" ||
                fileType === "application/vnd.ms-word.template.macroEnabled.12") {
                this.genepdf = false;
            } else {
                this.genepdf = true
            }
        } else {
            this.genepdf = true
        }


        let lockedfile = false
        if (data.locked == true)
            lockedfile = true
        await this.fileservice.checkIfFileExist(authorizationtokenOffice, data.fileName, this.classid + '_' + this.objectid + '_' + data.name).then(async (res) => {
            if (res.result.codeError === "PSTK_44") /*    "PSTK_44": "No such file Exist!", === Deleted FALSE */
            {
                this.disabledSaved = lockedfile || this.ContainerViewer
                this.fileBusy = false
            } else if (res.result.codeError === "PSTK_45") /*    "PSTK_45": "File Exist", === deleted TRUE */
            {

                this.disabledSaved = lockedfile || !this.ContainerViewer
                this.fileservice.extractfileByIdJson(data.id, this.fileAccessToken).subscribe((response: any) => {
                    this.base64 = this.communService.arrayBufferToBase64(new Uint8Array(response));
                    this.fileservice.checkIfFileBusy(authorizationtokenOffice, data.fileName, this.classid + '_' + this.objectid + '_' + data.name, this.base64).then
                    (() => {
                        this.showiconEcraseContenu = true
                        this.fileBusy = false
                    }, () => {
                        this.showiconEcraseContenu = false
                        this.fileBusy = true
                    });
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
                        this.jsondocviewer.visionneuse = "url";
                        this.jsondocviewer.pdfSrcc = fileURL;
                    }
                    this.loadingVisible = false
                }, error => {
                    this.Ref.value = this.fileName
                    this.loadingVisible = false
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
                })
            } catch (error) {
                this.Ref.value = this.fileName

                this.loadingVisible = false
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
            }
        }
    }

    /*reload file after add water marker */
}


export class FileItem {
    name: string;

    fileName: string

    id: any;

    icon: any

    transferable: any

    locked: any

    dateModified: any

    cssClass: any

    type: any

    iconColor: any

    isDirectory: boolean;

    size?: number;

    cmisId?: number;

    items?: FileItem[];

    thumbnail?: any;

    tooltipText: any

    responsable: any;

    signed: any
}

export class ActionItem {
    id: any

    text: any

    icon: any

    beginGroup: any

    subItems?: ActionItem[];


    constructor(id: any, text: any, icon: any, beginGroup: any, subItems?: ActionItem[]) {
        this.id = id;
        this.text = text;
        this.icon = icon;
        this.beginGroup = beginGroup;
        this.subItems = subItems;
    }
}
