import {Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpServicesComponent} from "../../ps-tools/http-services/http-services.component";
import {HttpParamMethodDelete, HttpParamMethodPost} from "../../ps-tools/class";
import {ToastrService} from "ngx-toastr";
import {EnvService} from "../../../../../env.service";
import {AttachementModuleService} from "../attachement.module.service";
import {CommunFuncService} from "../Commun/commun-func.service";
import {CookieService} from "ngx-cookie-service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
// import {CaseRequestService} from "../../../PI/case-requests/caseRequest.service";

@Component({
    selector: 'app-listeattachementparametres',
    templateUrl: './listeattachementparametres.component.html',
    styleUrls: ['./listeattachementparametres.component.scss']
})
export class ListeattachementparametresComponent implements OnInit {

    @Input() attachedLabels = []
    languageAcual;

    @Input() ObjectProjet: any;
    @Input() classid: any;
    @Input() className: any;
    @Input() objectid: any;
    @Input() objectData: any;
    @Input() ReadOnly: any;
    @Input() showSplliter: any;
    @ViewChild(HttpServicesComponent, {static: true}) private httpServicesComponent: HttpServicesComponent;
    @Output() AppelWsGetById: EventEmitter<any> = new EventEmitter<any>();
    @Output() jsondocviewerEventFromGrid = new EventEmitter<any>();
    @Output() datsourcesFilesEVENT = new EventEmitter<any>();
    private modalService = inject(NgbModal);

    constructor(
        // private caseRequestService: CaseRequestService,
                private cookie: CookieService, public communService: CommunFuncService, private fileservice: AttachementModuleService, public env: EnvService, private translateService: TranslateService, private toastr: ToastrService) {

        this.languageAcual = this.translateService.currentLang
    }

    datsourcesFiles: any = []

    ngOnInit(): void {
        this.attachedLabels.forEach((item: any) => {
            let reQFiles = new ReQFiles(
                item.faIcon,
                item.defaultFile,
                item.description,
                item.fileRequired,
                item.hasAddButton,
                item.hasExpirationDate,
                item.hasIdRegex,
                item.hasIssueAdress,
                item.hasIssueDate,
                item.hasLockButton,
                item.hasModelOfficeButton,
                item.hasRattachButton,
                item.hasScanButton,
                item.id,
                item.idRegex,
                item.idRegexIsRequired,
                item.issueAdressIsRequired,
                item.label,
                item.labelEditable,
                item.maxCopies,
                item.minCopies,
                item.name,
                item.attachement
            );
            this.datsourcesFiles.push(reQFiles);
        });


        this.getRequestFileDefinitions()
        this.getdatasource()
    }


    // getRequestFileDefinitions() {
    //     let object =  this.Req_Data;
    //     object["className"] = 'RequestCase';
    //     this.caseRequestService.findRequestFileDefinitions('RequestCase', JSON.stringify(object)).subscribe((data: any) => {
    //
    //
    //         this.attachedLabels = data.requestFileDefinition
    //     })
    // }

    getRequestFileDefinitions() {
        const parts = this.className.split('.');
        const className = parts[parts.length - 1];
        let json = {
            "className": className,
            "caseType": this.objectData["caseType"]
        }
        // this.objectData["className"] = className
        this.datsourcesFiles = []
        // this.caseRequestService.findRequestFileDefinitions(className, JSON.stringify(json)).subscribe((data: any) => {
        //
        //     data.requestFileDefinition.forEach((item: any) => {
        //         let reQFiles = new ReQFiles(
        //             item.faIcon,
        //             item.defaultFile,
        //             item.description,
        //             item.fileRequired,
        //             item.hasAddButton,
        //             item.hasExpirationDate,
        //             item.hasIdRegex,
        //             item.hasIssueAdress,
        //             item.hasIssueDate,
        //             item.hasLockButton,
        //             item.hasModelOfficeButton,
        //             item.hasRattachButton,
        //             item.hasScanButton,
        //             item.id,
        //             item.idRegex,
        //             item.idRegexIsRequired,
        //             item.issueAdressIsRequired,
        //             item.label,
        //             item.labelEditable,
        //             item.maxCopies,
        //             item.minCopies,
        //             item.name,
        //             item.attachement
        //         );
        //         this.datsourcesFiles.push(reQFiles);
        //     });
        // })


    }

    fun(id) {
        document.getElementById(id).click();
    }

    idRef(input: string, i: number) {
        return input + i
    }

    filename: any
    fileContent: any
    fileType: any

    onFileChange(event: Event, index: number, reqFileDef): void {

        const input = event.target as HTMLInputElement;
        if (input.files) {

        }
        this.fileContent = null;
        this.fileContent = input.files[0];
        this.filename = input.files[0].name;

        this.fileType = this.fileContent.type;

        this.CreateAttatchment(reqFileDef)


    }


    getdatasource() {
        this.fileservice.getfilesByClassIdAndObjectId(this.classid, this.objectid, this.fileAccessToken).subscribe((data: any) => {
            if (data.length !== 0) {
                data.forEach(file => {
                    const reQFiles = this.datsourcesFiles.find(elem => elem.id === file.requestFileDefinition.id);
                    // const reQFiles = this.datsourcesFiles.find(elem => elem.name === file.docTitle);
                    if (reQFiles) {
                        reQFiles.attachement = file; // Assuming `file` is the attachment data you want to set
                    }
                });
            }
            console.log("datasources", this.datsourcesFiles)
            this.datsourcesFilesEVENT.emit(this.datsourcesFiles)

        })


    }


    fileAccessToken = ""

    CreateAttatchment(reqFileDef) {
        let obj = new FormData()
        obj.append("docTitle", this.filename)
        obj.append("objectData", JSON.stringify(this.objectData))
        obj.append("objectDatasecuriteLevel", "0")
        obj.append("reqFileDefName", reqFileDef.name)
        obj.append("classId", this.classid)
        obj.append("objectId", this.objectid)
        obj.append("locked", "false")
        obj.append("Public", "false")
        if (this.fileContent != null)
            obj.append("multipartFiles", this.fileContent)
        else if (this.fileContent === null || this.fileContent === undefined) {
            this.translateService.get("ATTACHEMENT.fileEmpty", reqFileDef.name).subscribe((res) => {
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
        this.httpServicesComponent.method(paramsHttp, reqFileDef.name).then(data => {

            this.getdatasource();

        })

    }


    visible: any = false;

    customheight = '800px';
    objectFile: any


    popupDeleteFileVisible: boolean = false
    Ref = {value: ''};
    FileToDelete: any

    OpenPopupDelete(e) {
        this.FileToDelete = e
        this.popupDeleteFileVisible = true
    }

    // consulterPjs(data) {
    //     console.log(data)
    //     this.objectFile = data
    //
    //     this.visible = true
    //
    //     this.reloadViewer(data.data, data.docTitle)
    // }

    fileExtractedContent: any

    consulterPjs(data, longContent) {

        this.objectFile = data

        this.visible = true


        let docTitle = data['docTitle'];

        this.fileservice.extractfileByUIID(data.uuid, this.fileAccessToken).subscribe(async (file: any) => {

            if (this.objectFile.fileType === 'application/pdf')
                this.reloadViewer(file.body, docTitle)
            else
                this.fileExtractedContent = this.communService.arrayBufferToBase64(new Uint8Array(file.body));


            this.modalService.open(longContent, {scrollable: true, size: 'xl', backdrop: 'static'});
        })


    }

    DeleteFile() {
        this.popupDeleteFileVisible = false;


        let paramsHttp = new HttpParamMethodDelete(this.env.apiUrlkernel + "attachementRemove?uuid=" + this.FileToDelete.uuid + "&fileAccessToken=" + this.fileAccessToken, '')
        this.Ref.value = this.FileToDelete.docTitle

        this.httpServicesComponent.method(paramsHttp, this.Ref, "ATTACHEMENT.deleted", "ATTACHEMENT.deleteError").then(data => {
            const reQFiles = this.datsourcesFiles.find(elem => elem.attachement && elem.attachement.id === this.FileToDelete?.id);
            if (reQFiles) {
                reQFiles.attachement = null; // Assuming `file` is the attachment data you want to set
            }
            this.getdatasource()
            //   this.AppelWsGetById.emit(true)/*getbyid*/

        })
    }


    pdfSrcc: any;
    visionneuse: any;

    reloadViewer(arraybuffer, filename) {

        console.log("filename ::> ", filename)
        console.log("arraybuffer ::> ", arraybuffer)
        this.fileContent = new File([arraybuffer], filename, {type: 'application/pdf'});
        console.log(URL.createObjectURL(this.fileContent));
        this.pdfSrcc = URL.createObjectURL(this.fileContent);
        this.visionneuse = 'url';
    }

    close() {
        this.visible = false;

    }

    DeleteVisible(attachement: any) {
        let tabRoles = this.cookie.get('roles').split(',');

        if (attachement && !this.ReadOnly && tabRoles.includes(this.env.RoleCanDeleteDoc))
            return true;
        else
            return false;
    }

    AddVisible(attachement: any) {
        let tabRoles = this.cookie.get('roles').split(',');

        if (!attachement && !this.ReadOnly && tabRoles.includes(this.env.RoleCanAddDoc))
            return true;
        else
            return false;
    }
}

export class ReQFiles {
    faIcon: string;
    defaultFile: boolean;
    description: string | null;
    fileRequired: boolean;
    hasAddButton: boolean;
    hasExpirationDate: string;
    hasIdRegex: string;
    hasIssueAdress: string;
    hasIssueDate: string;
    hasLockButton: boolean;
    hasModelOfficeButton: boolean;
    hasRattachButton: boolean;
    hasScanButton: boolean;
    id: number;
    idRegex: string | null;
    idRegexIsRequired: boolean;
    issueAdressIsRequired: boolean;
    label: string;
    labelEditable: boolean;
    maxCopies: number;
    minCopies: number;
    name: string;
    attachement: any

    constructor(faIcon: string, defaultFile: boolean, description: string | null, fileRequired: boolean, hasAddButton: boolean, hasExpirationDate: string, hasIdRegex: string, hasIssueAdress: string, hasIssueDate: string, hasLockButton: boolean, hasModelOfficeButton: boolean, hasRattachButton: boolean, hasScanButton: boolean, id: number, idRegex: string | null, idRegexIsRequired: boolean, issueAdressIsRequired: boolean, label: string, labelEditable: boolean, maxCopies: number, minCopies: number, name: string, attachement: any) {
        this.faIcon = faIcon;
        this.defaultFile = defaultFile;
        this.description = description;
        this.fileRequired = fileRequired;
        this.hasAddButton = hasAddButton;
        this.hasExpirationDate = hasExpirationDate;
        this.hasIdRegex = hasIdRegex;
        this.hasIssueAdress = hasIssueAdress;
        this.hasIssueDate = hasIssueDate;
        this.hasLockButton = hasLockButton;
        this.hasModelOfficeButton = hasModelOfficeButton;
        this.hasRattachButton = hasRattachButton;
        this.hasScanButton = hasScanButton;
        this.id = id;
        this.idRegex = idRegex;
        this.idRegexIsRequired = idRegexIsRequired;
        this.issueAdressIsRequired = issueAdressIsRequired;
        this.label = label;
        this.labelEditable = labelEditable;
        this.maxCopies = maxCopies;
        this.minCopies = minCopies;
        this.name = name;
        this.attachement = attachement;
    }
}
