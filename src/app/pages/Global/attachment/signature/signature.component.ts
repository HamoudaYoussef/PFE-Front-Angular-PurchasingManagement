import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EnvService} from 'src/env.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AttachementModuleService} from '../attachement.module.service';
import {ClipboardService} from 'ngx-clipboard';
import {CookieService} from 'ngx-cookie-service';
import {CommunFuncService} from '../Commun/commun-func.service';

@Component({
    selector: 'app-signature',
    templateUrl: './signature.component.html',
    styleUrls: ['./signature.component.scss']
})

export class SignatureComponent implements OnInit {
    @Output() visibleFalse = new EventEmitter<any>();/*modal of rslt*/
    @Output() fileSigned = new EventEmitter<any>();/*File signed output*/

    @Input() FileNameToSigned;/*File name to signed*/
    @Input() BASE64_Input; /*Blob of file to signed*/

    selected_TypeSign = 'Avec clé USB';/*Default Selected value of type sign*/

    /***************** fomulaire de signature ********************************************************/
    signedUSBForm = this.fb.group({
        pinCode: [, Validators.required],
    });

    signedLOCALForm = this.fb.group({
        passwordCertif: [, Validators.required],
        certFile: [, Validators.required],
    });

    signedLOCAL_KEYForm = this.fb.group({
        certFile: [, Validators.required],
        keyFile: [, Validators.required],
    });

    /*Liste de type de signature*/
    types: any = ['Avec certificat local', 'Avec clé USB'];
    // types: any = ['Avec certificat local', 'Avec clé USB', 'Avec certificat local et clé'];


    show = false;/*to show/hide password*/
    certFile;/*File of certif local*/
    keyFile;/*private key of certif local*/
    Certiftoload;
    CertiftoloadKeyFile;
    fileName = 'Choisir certificat (.cer, .pfx)';
    fileNameKey = 'Choisir clé (.pem, .key)';
    loadingVisible: any = false;
    /*Module PSTK*/
    ModuleSign = require('../ModulePSTK.json').Module_Sign;
    /*Module PSTK*/

    /*PopUP*/
    popupConfirmSign = false;/*Confirme To go to signature*/
    popupRslt = false;/*visibilite of popup of rslt*/
    /*PopUP*/

    rslt;/*output rslt of signature*/
    succes = false;/*to permit user to donload file signed*/
    showErreur = false;
    showSuccess = false;
    erreurcomplete;
    succescomplete;
    packageName = require('package.json').name

    constructor(public communService: CommunFuncService, private env: EnvService, private cookieService: CookieService, private clipboardApi: ClipboardService, private fb: FormBuilder,
                private fileservice: AttachementModuleService, private toastr: ToastrService, private translateService: TranslateService, private communFuncService: CommunFuncService) {
    }

    get passwordCertif(): AbstractControl {
        return this.signedLOCALForm.get('passwordCertif');
    }

    /**private certif ############ Avec certificat local et clé && Avec certificat local################* */

    get pinCertif(): AbstractControl {
        return this.signedUSBForm.get('pinCode');
    }

    /*To Copie Erreur msg */

    //Change CERTIF File
    CertifChange(event) {
        this.certFile = event.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(this.certFile);
        reader.onload = () => {
            this.Certiftoload = reader.result;
        };
        this.fileName = event.files[0].name;
        // if (this.selected_TypeSign === 'Avec certificat local et clé')
        //     this.signedLOCAL_KEYForm.get('certFile').setValue(this.certFile)
        // else
        if (this.selected_TypeSign === 'Avec certificat local') {
            this.signedLOCALForm.get('certFile').setValue(this.certFile);
        }
    }

    //Change CERTIF File

    /*To Copie Erreur msg */
    copyText() {
        this.clipboardApi.copyFromContent(this.erreurcomplete);
        this.translateService.get('ATTACHEMENT.copyErrur').subscribe((res) => {
            this.toastr.info(res, '', {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            });
        });
    }

    /*private key change ############ Avec certificat local et clé ################*/

    /*private key change ############ Avec certificat local et clé ################*/
    KeyChange(event) {
        this.keyFile = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(this.keyFile);
        reader.onload = () => {
            this.CertiftoloadKeyFile = reader.result;
        };
        this.fileNameKey = event.target.files[0].name;
        if (this.selected_TypeSign === 'Avec certificat local et clé') {
            this.signedLOCAL_KEYForm.get('keyFile').setValue(this.keyFile);
        }
    }

    /**private certif ############ Avec certificat local et clé && Avec certificat local################* */
    PreSignedPDf() {
        if (this.selected_TypeSign === 'Avec clé USB') {
            if (this.signedUSBForm.valid) {
                this.popupConfirmSign = true;
            } else {
                this.translateService.get('formInvalide').subscribe((res) => {
                    this.toastr.error(res, '', {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    });
                });
            }
        } else if (this.selected_TypeSign === 'Avec certificat local') {

            if (this.signedLOCALForm.valid) {
                this.popupConfirmSign = true;
            } else {
                this.translateService.get('formInvalide').subscribe((res) => {
                    this.toastr.error(res, '', {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    });
                });
            }
        }
        /*        else if (this.selected_TypeSign === 'Avec certificat local et clé') {
                    if (this.signedLOCAL_KEYForm.valid) {
                        this.popupConfirmSign = true
                    } else {
                        this.translateService.get("formInvalide").subscribe((res) => {
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
                }*/
    }

    ngOnInit(): void {
        /*LOCAL STORAGE of formulaire*/
        if (localStorage.getItem(this.packageName + '_' + 'typeSign') != null) {
            this.selected_TypeSign = localStorage.getItem(this.packageName + '_' + 'typeSign');
        }
    }

    /*ATTACHED FILE FROM CARD INTERFACE*/
    attached() {
        document.getElementById('addSignature').click();
    }

    ShowPassword() {
        this.show = !this.show;
    }

    /*Select box change*/
    onChangeType(value) {
        if (value.selectedItem && value.selectedItem != undefined) {
            this.selected_TypeSign = value.selectedItem;
        }
    }

    /*Select box change*/

    onHidingRslt(e: any) {
        this.popupRslt = false;
    }

    onHidingConfirm(e: any) {
        this.popupConfirmSign = false;
    }

    closeSuccess() {
        this.popupConfirmSign = false;
        this.popupRslt = false;
    }

    closeFailed() {
        this.popupRslt = false;
    }


    async signedPdf() {
        if (this.BASE64_Input != null && this.BASE64_Input != undefined && this.BASE64_Input != '' && this.FileNameToSigned != null && this.FileNameToSigned != undefined && this.FileNameToSigned != '') {
            this.loadingVisible = true;
            /*LOCAL sTORAGE*/
            localStorage.setItem(this.packageName + '_' + 'typeSign', this.selected_TypeSign);
            let arraybuffer = this.communFuncService.base64ToArrayBuffer(this.BASE64_Input);
            /* New File to be signed */
            var file = new File([arraybuffer], this.FileNameToSigned, {type: 'application/pdf'});

            let values;
            /*verify Module Scan*/
            let authorizationtokenSign = await this.communService.authorizationToken(this.ModuleSign)

            /*verify Module Scan*/

            if (this.selected_TypeSign === 'Avec clé USB') {
                values = this.signedUSBForm.value;
                this.fileservice.signedPdfWithTokenLicenseVerify(authorizationtokenSign, file, 'MultipartFile', null, values.pinCode, this.selected_TypeSign, null)
                    .subscribe((res: any) => {
                            let base64 = res.result.data;
                            let arraybuffer = this.communFuncService.base64ToArrayBuffer(base64);
                            let fileContent = new File([arraybuffer], this.FileNameToSigned, {type: 'application/pdf'});
                            this.loadingVisible = false;
                            this.popupRslt = true;
                            this.succes = true;
                            this.rslt = res.result.message;
                            if (res.result.certInfo != null && res.result.certInfo != '' && res.result.certInfo != undefined) {
                                this.succescomplete = ' SubjectDN : ' + res.result.certInfo.SubjectDN + ', IssuerCN : ' + res.result.certInfo.IssuerCN + ', SerialNumber : ' + res.result.certInfo.SerialNumber;
                            }
                            this.fileSigned.emit(fileContent);
                        },
                        //ERROR OF WS TOOLKIT SIGNED PDF
                        error => {
                            this.loadingVisible = false;
                            const message = error.error.result.detailError;
                            const erreurcomplet = error.error.stack;
                            this.rslt = message;
                            this.erreurcomplete = erreurcomplet;
                            this.popupRslt = true;
                            this.succes = false;
                        });
            } else if (this.selected_TypeSign === 'Avec certificat local') {
                values = this.signedLOCALForm.value;
                this.fileservice.signedPdfWithTokenLicenseVerify(authorizationtokenSign, file, 'MultipartFile', values.certFile, values.passwordCertif, this.selected_TypeSign, null)
                    .subscribe((res: any) => {
                            let base64 = res.result.data;
                            let arraybuffer = this.communFuncService.base64ToArrayBuffer(base64);
                            let fileContent = new File([arraybuffer], this.FileNameToSigned, {type: 'application/pdf'});
                            this.loadingVisible = false;
                            this.popupRslt = true;
                            this.succes = true;
                            this.rslt = res.result.message;
                            if (res.result.certInfo != null && res.result.certInfo != '' && res.result.certInfo != undefined) {
                                this.succescomplete = ' SubjectDN : ' + res.result.certInfo.SubjectDN + ', IssuerCN : ' + res.result.certInfo.IssuerCN + ', SerialNumber : ' + res.result.certInfo.SerialNumber;
                            }
                            this.fileSigned.emit(fileContent);
                        },
                        //ERROR OF WS TOOLKIT SIGNED PDF
                        error => {

                            this.loadingVisible = false;
                            const message = error.error.result.detailError;
                            const erreurcomplet = error.error.stack;
                            this.rslt = message;
                            this.erreurcomplete = erreurcomplet;
                            // this.closepopup();
                            this.popupRslt = true;
                            this.succes = false;

                        });
            }
            /*            else if ('Avec certificat local et clé') {
                            values = this.signedLOCAL_KEYForm.value
                            this.fileservice.signedPdfWithTokenLicenseVerify(authorizationToken, file, 'MultipartFile', values.certFile, null, this.selected_TypeSign, values.keyFile)
                                .subscribe((res: any) => {
                                        let base64 = res.result.data
                                        let arraybuffer = this.communFuncService.base64ToArrayBuffer(base64);
                                        let fileContent = new File([arraybuffer], this.FileNameToSigned, {type: "application/pdf"});
                                        this.loadingVisible = false;
                                        this.popupRslt = true
                                        this.succes = true;
                                        this.rslt = res.result.message;

                                        if (res.result.certInfo != null && res.result.certInfo != '' && res.result.certInfo != undefined) {
                                            this.succescomplete = " SubjectCN : " + res.result.certInfo.SubjectCN + " IssuerCN : " + res.result.certInfo.IssuerCN + " SerialNumber : " + res.result.certInfo.SerialNumber
                                        }
                                        this.fileSigned.emit(fileContent)
                                    },
                                    //ERROR OF WS TOOLKIT SIGNED PDF
                                    error => {

                                            this.loadingVisible = false;
                                            const message = error.error.result.detailError;
                                            const erreurcomplet = error.error.stack;
                                            this.rslt = message;
                                            this.erreurcomplete = erreurcomplet;
                                            this.popupRslt = true
                                            this.succes = false;

                                    })
                        }*/
        }
    }
}
