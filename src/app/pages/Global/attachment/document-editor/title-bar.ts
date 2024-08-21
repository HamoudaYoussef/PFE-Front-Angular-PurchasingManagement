import {createElement, Event, isNullOrUndefined, KeyboardEventArgs} from '@syncfusion/ej2-base';
import { DocumentEditor, FormatType } from '@syncfusion/ej2-angular-documenteditor';
import { Button } from '@syncfusion/ej2-angular-buttons';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-splitbuttons';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {EnvService} from "../../../../../env.service";
import {TokenStorageService} from "../../shared-service/token-storage.service";
import { showSpinner ,hideSpinner,createSpinner} from '@syncfusion/ej2-popups';
import {setCulture} from '@syncfusion/ej2-base';
setCulture('fr');

/**
 * Represents document editor title bar.
 */
export class TitleBar {
    private tileBarDiv: HTMLElement;
    private documentTitle: HTMLElement;
    private documentTitleContentEditor: HTMLElement;
    private export: Button;
    private print: Button;
    private open: Button;
    private edit: Button;
    private lang: DropDownButton;
    private documentEditor: DocumentEditor;
    private isRtl: boolean = false;
    editable: any = false
    culture: any = 'fr'
    idAttachement: any = true;
    fileAccessToken: any;
    securityLevel: any;
    fileName: any;
    docTitle: any;
    fileType: any;
    fileContent: any;
    // culture: any = 'en';
    hostUrl: any;
    objectData: any;
    private saveBtn: DropDownButton;
    private cancelBtn: Button;


    constructor(element: HTMLElement, docEditor: DocumentEditor,private http: HttpClient,private env: EnvService, idAttachement: any, fileAccessToken: any, securityLevel: any, fileName: any, docTitle: any, fileType: any, fileContent: any, hostUrl: any, objectData: any, private tokenStorage: TokenStorageService, private ref: any, isShareNeeded: Boolean, isRtl?: boolean) {
        this.isRtl = true;
        //initializes title bar elements.
        this.tileBarDiv = element;
        this.documentEditor = docEditor;
        this.fileAccessToken = fileAccessToken;
        this.idAttachement = idAttachement;
        this.securityLevel = securityLevel;
        this.fileName = fileName;
        this.docTitle = docTitle;
        this.fileContent = fileContent;
        this.hostUrl = hostUrl;
        this.objectData = objectData;
        this.fileType = fileType;
        this.initializeTitleBar(isShareNeeded);
        this.wireEvents();
    }
    private initializeTitleBar = (isShareNeeded: Boolean): void => {
        let downloadText: string;
        let EditText: string;
        let LangText: string;
        let downloadToolTip: string;
        let printText: string;
        let printToolTip: string;
        let openText: string;
        let documentTileText: string;
        let SaveText: string;
        let cancelText: string;

        //if (!this.isRtl) {
        //    downloadText = 'Download';
        //    EditText = 'Editer';
        //    downloadToolTip = 'Download this document.';
        //    printText = 'Print';
        //    printToolTip = 'Print this document (Ctrl+P).';
        //    openText = 'Open';
        //    documentTileText = 'Document Name. Click or tap to rename this document.';
        //} else {
        downloadText = 'تحميل';
        downloadToolTip = 'تحميل هذا المستند';
        printText = 'طباعه';
        printToolTip = 'طباعه هذا المستند (Ctrl + P)';
        openText = 'فتح';
        EditText = 'تحيين';
        LangText = 'الغة';
        SaveText = 'حفظ';
        cancelText='عودة'

        documentTileText = 'اسم المستند. انقر أو اضغط لأعاده تسميه هذا المستند';
        // }
        // tslint:disable-next-line:max-line-length
        this.documentTitle = createElement('label', { id: 'documenteditor_title_name', styles: 'font-weight:400;text-overflow:ellipsis;white-space:pre;overflow:hidden;user-select:none;cursor:text; float : right;' });
        let iconCss: string = 'e-de-padding-right';
        let btnFloatStyle: string = 'float:right;';
        let titleCss: string = '';
        if (this.isRtl) {
            iconCss = 'e-de-padding-right-rtl';
            btnFloatStyle = 'float:left;';
            titleCss = 'float:right;';
        }
        // tslint:disable-next-line:max-line-length
        this.documentTitleContentEditor = createElement('div', { id: 'documenteditor_title_contentEditor', className: 'single-line', styles: titleCss });
        this.documentTitleContentEditor.appendChild(this.documentTitle);
        this.tileBarDiv.appendChild(this.documentTitleContentEditor);
        this.documentTitleContentEditor.setAttribute('title', 'Document Name. Click or tap to rename this document.');
        let btnStyles: string = btnFloatStyle + 'background: transparent;box-shadow:none; font-family: inherit;border-color: transparent;'
            + 'border-radius: 2px;color:inherit;font-size:12px;text-transform:capitalize;margin-top:4px;height:28px;font-weight:400;'
            + 'margin-top: 2px;';
        // tslint:disable-next-line:max-line-length



        let items: ItemModel[] = [
            { text: 'Microsoft Word (.docx)', id: 'word' },
            { text: 'Syncfusion Document Text (.sfdt)', id: 'sfdt' },
        ];
        let itemsLang: ItemModel[] = [
            { text: 'الفرنسية', id: 'fr', iconCss: 'fa fa-flag-usa text-primary'},
            { text: 'العربية', id: 'ar', iconCss: 'fa fa-flag-usa text-danger' },
            { text: 'الانجليزية', id: 'en', iconCss: 'fa fa-flag-usa text-info' },
        ];
        let itemsSave: ItemModel[] = [
            { text: 'حفظ المستند', id: 'save' },
            { text: 'حفظ المستند كإصدار جديد', id: 'save_new_version' },
        ];
        this.lang = this.addButtonLang('fa fa-flag ' + iconCss, LangText, btnStyles, 'documenteditor-lang', LangText, true, itemsLang) as DropDownButton;
        this.print = this.addButton('fa fa-print ' + iconCss, printText, btnStyles, 'de-print', printToolTip, false) as Button;
        this.open = this.addButton('e-de-icon-Open ' + iconCss, openText, btnStyles, 'de-open', documentTileText, false) as Button;
        // tslint:disable-next-line:max-line-length
        this.export = this.addButton('fa fa-download ' + iconCss, downloadText, btnStyles, 'documenteditor-share', downloadToolTip, false) as Button;
        this.edit = this.addButton('fa fa-edit ' + iconCss, EditText, btnStyles, 'de-Pen', EditText, false) as Button;
        this.saveBtn = this.addButtonSave('fas fa-save ' + iconCss, SaveText, btnStyles, 'documenteditor-save', SaveText, true, itemsSave) as DropDownButton;
        this.cancelBtn = this.addButton('fa fa-window-close ' + iconCss, cancelText, btnStyles, 'de-Pen', cancelText, false) as Button;

        if (!isShareNeeded) {
            this.export.element.style.display = 'none';
        } else {
            this.open.element.style.display = 'none';
        }
        this.saveBtn.element.style.display = 'none';
        this.cancelBtn.element.style.display = 'none';
        this.documentEditor.isReadOnly = true;
        if(this.objectData === undefined || (this.objectData && this.objectData.userPermission === 'READ' || this.objectData.userPermission === null)){
            this.edit.element.style.display = 'none';
            this.documentEditor.isReadOnly = true;
        }
    }
    private setTooltipForPopup(): void {
        // tslint:disable-next-line:max-line-length
        document.getElementById('documenteditor-share-popup').querySelectorAll('li')[0].setAttribute('title', 'Download a copy of this document to your computer as a DOCX file.');
        // tslint:disable-next-line:max-line-length
        document.getElementById('documenteditor-share-popup').querySelectorAll('li')[1].setAttribute('title', 'Download a copy of this document to your computer as an SFDT file.');
    }
    private setTooltipForPopup1(): void {
        // tslint:disable-next-line:max-line-length
        document.getElementById('documenteditor-lang-popup').querySelectorAll('li')[0].setAttribute('title', 'Download a copy of this document to your computer as a DOCX file.');
        // tslint:disable-next-line:max-line-length
        document.getElementById('documenteditor-lang-popup').querySelectorAll('li')[1].setAttribute('title', 'Download a copy of this document to your computer as an SFDT file.');
    }
    private wireEvents = (): void => {
        this.print.element.addEventListener('click', this.onPrint);
        this.edit.element.addEventListener('click', this.onEdit);
        this.export.element.addEventListener('click', this.onExportClick);
        this.cancelBtn.element.addEventListener('click', this.onCancelEdit);
        this.open.element.addEventListener('click', (e: Event) => {
            if ((e.target as HTMLInputElement).id === 'de-open') {
                let fileUpload: HTMLInputElement = document.getElementById('uploadfileButton') as HTMLInputElement;
                fileUpload.value = '';
                fileUpload.click();
            }
        });
        this.documentTitleContentEditor.addEventListener('keydown', (e: KeyboardEventArgs) => {
            if (e.keyCode === 13) {
                e.preventDefault();
                this.documentTitleContentEditor.contentEditable = 'false';
                if (this.documentTitleContentEditor.textContent === '') {
                    this.documentTitleContentEditor.textContent = 'Document1';
                }
            }
        });
        this.documentTitleContentEditor.addEventListener('blur', (): void => {
            if (this.documentTitleContentEditor.textContent === '') {
                this.documentTitleContentEditor.textContent = 'Document1';
            }
            this.documentTitleContentEditor.contentEditable = 'false';
            this.documentEditor.documentName = this.documentTitle.textContent;
        });
        this.documentTitleContentEditor.addEventListener('click', (): void => {
            this.updateDocumentEditorTitle();
        });
    }
    private updateDocumentEditorTitle = (): void => {
        this.documentTitleContentEditor.contentEditable = 'true';
        this.documentTitleContentEditor.focus();
        window.getSelection().selectAllChildren(this.documentTitleContentEditor);
    }
    // Updates document title.
    public updateDocumentTitle = (): void => {
        if (this.documentEditor.documentName === '') {
            this.documentEditor.documentName = 'Untitled';
        }
        this.documentTitle.textContent = this.documentEditor.documentName;
    }
    // tslint:disable-next-line:max-line-length
    private addButton(iconClass: string, btnText: string, styles: string, id: string, tooltipText: string, isDropDown: boolean, items?: ItemModel[]): Button | DropDownButton {
        let button: HTMLButtonElement = createElement('button', { id: id, styles: styles }) as HTMLButtonElement;
        this.tileBarDiv.appendChild(button);
        button.setAttribute('title', tooltipText);
        if (isDropDown) {
            // tslint:disable-next-line:max-line-length
            let dropButton: DropDownButton = new DropDownButton({ select: this.onExportClick, items: items, iconCss: iconClass, cssClass: 'e-caret-hide', content: btnText, open: (): void => { this.setTooltipForPopup(); } }, button);
            return dropButton;
        } else {
            let ejButton: Button = new Button({ iconCss: iconClass, content: btnText }, button);
            return ejButton;
        }
    }
    private addButtonSave(iconClass: string, btnText: string, styles: string, id: string, tooltipText: string, isDropDown: boolean, items?: ItemModel[]): Button | DropDownButton {
        let button: HTMLButtonElement = createElement('button', { id: id, styles: styles }) as HTMLButtonElement;
        this.tileBarDiv.appendChild(button);
        button.setAttribute('title', tooltipText);
        if (isDropDown) {
            // tslint:disable-next-line:max-line-length
            let dropButton: DropDownButton = new DropDownButton({ select: this.onSaveClick, items: items, iconCss: iconClass, cssClass: 'e-caret-hide', content: btnText, open: (): void => { this.setTooltipForPopup1(); } }, button);
            dropButton.enableRtl=true;
            return dropButton;
        } else {
            let ejButton: Button = new Button({ iconCss: iconClass, content: btnText }, button);
            return ejButton;
        }
    }
    private addButtonLang(iconClass: string, btnText: string, styles: string, id: string, tooltipText: string, isDropDown: boolean, items?: ItemModel[]): Button | DropDownButton {
        let button: HTMLButtonElement = createElement('button', { id: id, styles: styles }) as HTMLButtonElement;
        this.tileBarDiv.appendChild(button);
        button.setAttribute('title', tooltipText);
        if (isDropDown) {
            // tslint:disable-next-line:max-line-length
            let dropButton: DropDownButton = new DropDownButton({ select: this.onLangClick, items: items, iconCss: iconClass, cssClass: 'e-caret-hide', content: btnText, open: (): void => { this.setTooltipForPopup1(); } }, button);
            dropButton.enableRtl=true;
            return dropButton;
        } else {
            let ejButton: Button = new Button({ iconCss: iconClass, content: btnText }, button);
            return ejButton;
        }
    }

    private onPrint = (): void => {
        showSpinner((document.getElementById('container') as HTMLElement) as HTMLElement);

        this.documentEditor.print();
        hideSpinner((document.getElementById('container') as HTMLElement));

    }
    private onEdit = (): void => {
        showSpinner((document.getElementById('container') as HTMLElement) as HTMLElement);

        this.ref.editable = true;
        this.edit.element.style.display = 'none';
        this.saveBtn.element.style.display = 'block';
        this.cancelBtn.element.style.display = 'block';
        this.documentEditor.isReadOnly = false;
        hideSpinner((document.getElementById('container') as HTMLElement));

    }
    public onEditChange = (): void => {
        showSpinner((document.getElementById('container') as HTMLElement) as HTMLElement);

        this.ref.editable = true;
        this.edit.element.style.display = 'none';
        this.saveBtn.element.style.display = 'block';
        this.cancelBtn.element.style.display = 'block';
        this.documentEditor.isReadOnly = false;
        hideSpinner((document.getElementById('container') as HTMLElement));

    }
    private onExportClick = (args: any): void => {

        this.save('Docx');
    }
    private onCancelEdit = (args: any): void => {
        showSpinner((document.getElementById('container') as HTMLElement) as HTMLElement);

        if(this.documentEditor){
            let formData: FormData = new FormData();
            formData.append('base64', this.fileContent);
            this.http.post(this.hostUrl + 'ImportContent', formData ).subscribe((data:any)=>{
                this.documentEditor.open(data)
                this.documentEditor.documentName = this.fileName;
                this.updateDocumentTitle();
                this.onDocumentChange()
                this.ref.editable = false;
                this.documentEditor.isReadOnly = true;
                this.edit.element.style.display = 'block';
                this.saveBtn.element.style.display = 'none';
                this.cancelBtn.element.style.display = 'none';
                hideSpinner((document.getElementById('container') as HTMLElement));

            });
        }

    }
    onDocumentChange(): void {
        this.updateDocumentTitle();
        this.documentEditor.focusIn();
    }


    private onSaveClick = (args: any): void => {
        let value: string = args.item.id;
        switch (value) {
            case 'save':
                this.saveDocument();
                break;
            case 'save_new_version':
                this.saveDocumentAsNewVersion();
                break;
        }
    }
    private saveDocument = (): void => {
        showSpinner((document.getElementById('container') as HTMLElement) as HTMLElement);
        if(this.objectData.userPermission === 'WRITE'){

        this.documentEditor.saveAsBlob('Docx').then((blob: Blob)=>{
            let obj = new FormData();
            obj.append("multipartFiles", blob);
            obj.append("securiteLevel", '0')
            obj.append("objectData", JSON.stringify(this.objectData))
            obj.append("objectId", this.objectData.id)
            obj.append("docId", this.idAttachement)
            obj.append("classId", this.objectData.classId)
            obj.append("docTitle", this.fileName)
            obj.append("fileName", this.docTitle)
            obj.append("fileType", this.fileType)
            obj.append("objectDatasecuriteLevel", '0')
            obj.append("reqFileDefName", 'dos')
            obj.append("locked", 'false')
            obj.append("Public", 'false')
            obj.append("objectDatasecuriteLevel", '0')

            this.http.patch(this.env.apiUrlkernel + 'attachementsSetContent/' + this.idAttachement + '?fileAccessToken=' + this.fileAccessToken, obj, {headers: new HttpHeaders().append("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)}).subscribe(data=>{
                this.ref.editable = false
                this.edit.element.style.display = 'block';
                this.saveBtn.element.style.display = 'none';
                this.cancelBtn.element.style.display = 'none';
                this.documentEditor.isReadOnly = true;
                hideSpinner((document.getElementById('container') as HTMLElement));

            })
        });
        }
    }
    private saveDocumentAsNewVersion = (): void => {
        showSpinner((document.getElementById('container') as HTMLElement) as HTMLElement);

        this.documentEditor.saveAsBlob('Docx').then((blob: Blob)=>{
            let obj = new FormData();
            obj.append("multipartFiles", blob);
            obj.append("securiteLevel", this.securityLevel)
            this.http.patch(this.env.apiUrlkernel + 'attachementsSetContent/' + this.idAttachement + '?fileAccessToken=' + this.fileAccessToken, obj).subscribe(data=>{
                this.editable = false
                this.edit.element.style.display = 'block';
                this.saveBtn.element.style.display = 'none';
                hideSpinner((document.getElementById('container') as HTMLElement));

            })
        });

    }

    private onLangClick = (args: any): void => {
        let value: string = args.item.id;
        switch (value) {
            case 'ar':
               this.ref.culture = 'ar';
               this.ref.onCreateChange();

                break;
            case 'en':
                this.ref.culture = 'en'
                    this.ref.onCreateChange();
                break;
            case 'fr':
                this.ref.culture = 'fr'
                this.ref.onCreateChange();
                break;
        }
    }
    private save = (format: string): void => {
        showSpinner((document.getElementById('container') as HTMLElement) as HTMLElement);

        // tslint:disable-next-line:max-line-length
        this.documentEditor.save(this.documentEditor.documentName === '' ? 'sample' : this.documentEditor.documentName, format as FormatType);
        hideSpinner((document.getElementById('container') as HTMLElement));

    }
}
