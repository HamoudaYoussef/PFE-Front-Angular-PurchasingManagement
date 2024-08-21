import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {EnvService} from '../../../../env.service';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';
import {AttachementModuleService} from '../attachment/attachement.module.service';

@Component({
    selector: 'app-config-pstk',
    templateUrl: './config-pstk.component.html',
    styleUrls: ['./config-pstk.component.scss']
})
export class ConfigPstkComponent implements OnInit {
    @Input() popupSetingPSTK = false;
    @Input() PopupDisplay = true;
    @Output() submitEvent = new EventEmitter<any>();
    @Output() pstkInfoEvent = new EventEmitter<any>();
    @Output() pstkEnabledEvent = new EventEmitter<any>();
    @Output() closepopupSetingPSTK = new EventEmitter<any>();

    pstkInfo = '';
    /*Default Port/Timer*/
    envEnabled = false
    // defaultTimer = this.env.pstkRunnigTimer
    defaultPort = this.env.pstkport
    /*Default Port/Timer*/
    configPSTKForm = this.fb.group({
        Port: [this.defaultPort, Validators.required],
        enabled: [this.envEnabled, Validators.required],
    });
    showAvertismentRuningPSTK = false;
    popupTitle;
    refreshIntervalId = null;
    refreshIntervalIdSecond = null;
    envPstkRunning = null;
    submmited = false;
    pstkVersion = '';

    /*Module PSTK*/
    ModuleScan = require('../attachment/ModulePSTK.json').Module_Scan;
    ModuleSign = require('../attachment/ModulePSTK.json').Module_Sign;
    ModuleOffice = require('../attachment/ModulePSTK.json').Module_Office;
    ModuleMisc = require('../attachment/ModulePSTK.json').Module_Misc;

    /*Module PSTK*/
    license = ['Machine', 'Serveur'];
    selectedLicensepstk;

    constructor(private cookieService: CookieService, private translateService: TranslateService, private fb: FormBuilder, private fileservice: AttachementModuleService, public env: EnvService, private toastr: ToastrService) {
    }

    ngOnInit(): void {
        this.pstkInfo = this.cookieService.get('pstkInfo');
        if (this.cookieService.get('selectedLicensepstk') != '' && this.cookieService.get('selectedLicensepstk') != undefined && this.cookieService.get('selectedLicensepstk') != null
            && this.cookieService.get('selectedLicensepstk') != 'undefined' && this.cookieService.get('selectedLicensepstk') != 'null') {
            this.selectedLicensepstk = this.cookieService.get('selectedLicensepstk');
        } else {

            this.selectedLicensepstk = this.license[1];

        }
        this.translateService.get('ATTACHEMENT.popuptoolkittitle').subscribe((res) => {
            this.popupTitle = res;
        });
        if (this.cookieService.get('PstkEnabled') != null && this.cookieService.get('PstkEnabled') != undefined && this.cookieService.get('PstkEnabled') != '') {
            this.envEnabled = JSON.parse(this.cookieService.get('PstkEnabled'));
        }
        // if (this.cookieService.get('PstkTimerMS') != null && this.cookieService.get('PstkTimerMS') != undefined && this.cookieService.get('PstkTimerMS') != '') {
        //     this.defaultTimer = this.secondToMin(JSON.parse(this.cookieService.get('PstkTimerMS')));
        // }
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '') {
            this.defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
            this.configPSTKForm.get('Port').setValue(this.defaultPort);
        }
        if (this.refreshIntervalId != null) {
            clearInterval(this.refreshIntervalId);
        }
        if (this.refreshIntervalIdSecond != null) {
            clearInterval(this.refreshIntervalIdSecond);
        }
        this.submmited = true;
        this.submitEvent.emit(this.submmited);
/*
        this.getAllToken()
*/
        // if (this.cookieService.get('PstkTimerMS') != null && this.cookieService.get('PstkTimerMS') != undefined && this.cookieService.get('PstkTimerMS') != '') {
        //     /*s'execute 1er fois*/
        //     // this.checkpstkfirstTime();
        //     this.refreshIntervalIdSecond = setInterval(() => {
        //         /*s'execute n éme>1 fois*/
        //         this.checkpstk();
        // }, JSON.parse(this.cookieService.get('PstkTimerMS')));
        // }
    }

    onValueChanged($event) {
        this.selectedLicensepstk = $event.value;
    }

    pstkEnabled() {
        if (this.cookieService.get('PstkEnabled') != null && this.cookieService.get('PstkEnabled') != undefined && this.cookieService.get('PstkEnabled') != '') {
            if (JSON.parse(this.cookieService.get('PstkEnabled')) === true) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async getAllToken() {
        let authorizationtokenScan = null;

        if (this.cookieService.get(this.ModuleScan) === 'undefined'
            || this.cookieService.get(this.ModuleScan) === undefined
            || this.cookieService.get(this.ModuleScan) === '') {

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
        } else if (this.cookieService.get(this.ModuleScan) === 'null'
            || this.cookieService.get(this.ModuleScan) === null) {
            authorizationtokenScan = null;
        } else {
            authorizationtokenScan = this.cookieService.get(this.ModuleScan);
        }


        let authorizationtokenSign = null;

        if (this.cookieService.get(this.ModuleSign) === 'undefined'
            || this.cookieService.get(this.ModuleSign) === undefined
            || this.cookieService.get(this.ModuleSign) === '') {
            await this.fileservice.getToken(this.ModuleSign).then(
                (res: any) => {
                    if (res && res.res.body.authorizationToken) {
                        authorizationtokenSign = res.res.body.authorizationToken;
                    }
                }, (error) => {
                    // console.error(error);
                    authorizationtokenSign = null;
                }
            );
        } else if (this.cookieService.get(this.ModuleSign) === 'null'
            || this.cookieService.get(this.ModuleSign) === null) {
            authorizationtokenSign = null;
        } else {
            authorizationtokenSign = this.cookieService.get(this.ModuleSign);
        }


        let authorizationtokenMisc = null;

        if (this.cookieService.get(this.ModuleMisc) === 'undefined'
            || this.cookieService.get(this.ModuleMisc) === undefined
            || this.cookieService.get(this.ModuleMisc) === '') {
            await this.fileservice.getToken(this.ModuleMisc).then(
                (res: any) => {
                    if (res && res.res.body.authorizationToken) {
                        authorizationtokenMisc = res.res.body.authorizationToken;
                    }
                }, (error) => {
                    // console.error(error);
                    authorizationtokenMisc = null;
                }
            );
        } else if (this.cookieService.get(this.ModuleMisc) === 'null'
            || this.cookieService.get(this.ModuleMisc) === null) {
            authorizationtokenMisc = null;
        } else {
            authorizationtokenMisc = this.cookieService.get(this.ModuleMisc);
        }

        let authorizationtokenOffice = null;

        if (this.cookieService.get(this.ModuleOffice) === 'undefined'
            || this.cookieService.get(this.ModuleOffice) === undefined
            || this.cookieService.get(this.ModuleOffice) === '') {
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
        } else if (this.cookieService.get(this.ModuleOffice) === 'null'
            || this.cookieService.get(this.ModuleOffice) === null) {
            authorizationtokenOffice = null;
        } else {
            authorizationtokenOffice = this.cookieService.get(this.ModuleOffice);
        }

    }

    // getTimer() {
    //     if (this.cookieService.get('PstkTimerMS') != null && this.cookieService.get('PstkTimerMS') != undefined && this.cookieService.get('PstkTimerMS')) {
    //         return this.secondToMin(JSON.parse(this.cookieService.get('PstkTimerMS')));
    //     } else {
    //         return (this.defaultTimer);
    //     }
    // }
    pstkInfodetail() {


        return this.cookieService.get('pstkInfo');

    }

    getPort() {
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort')) {
            return JSON.parse(this.cookieService.get('PstkPort'));
        } else {
            return (this.defaultPort);
        }
    }

    PstkRunning() {
        if (this.cookieService.get('envPstkRunning') != null && this.cookieService.get('envPstkRunning') != undefined && this.cookieService.get('envPstkRunning') != '') {
            if (JSON.parse(this.cookieService.get('envPstkRunning')) === true) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    portChange() {
        this.submit();
    }

    timerChange() {
        this.submit();
    }

    submit() {
        this.submmited = true
        this.submitEvent.emit(this.submmited)

        this.submitEvent
        this.configPSTKForm.value.enabled = this.envEnabled

        if (this.refreshIntervalId != null)
            clearInterval(this.refreshIntervalId);
        if (this.refreshIntervalIdSecond != null)
            clearInterval(this.refreshIntervalIdSecond);

        if (this.envEnabled === true) {
            if (this.configPSTKForm.valid) {
                this.envPstkRunning = false;
                var expirationDate = new Date();
                expirationDate.setFullYear(expirationDate.getFullYear() + 1);
                // this.cookieService.set('PstkTimerMS', String(this.minToSecond(this.defaultTimer)));
                this.cookieService.set('envPstkRunning', this.envPstkRunning,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                this.cookieService.set('PstkEnabled', String(this.configPSTKForm.value.enabled),expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                this.cookieService.set('PstkPort', this.configPSTKForm.value.Port,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                this.popupSetingPSTK = false;
                this.translateService.get('ATTACHEMENT.waitcondifpstk').subscribe(
                    res => {
                        this.pstkInfo = res;
                        this.cookieService.set('pstkInfo', this.pstkInfo,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))

                    });

                this.pstkInfoEvent.emit(this.pstkInfo);
                /*s'execute 1er fois*/
                this.checkpstkfirstTime();
                // if (this.cookieService.get('PstkTimerMS') != null && this.cookieService.get('PstkTimerMS') != undefined && this.cookieService.get('PstkTimerMS') != '') {
                //     this.refreshIntervalIdSecond = setInterval(() => {
                //         /*s'execute n éme>1 fois*/
                //         this.checkpstk();
                //     }, JSON.parse(this.cookieService.get('PstkTimerMS')));
                // }


            } else {
                this.showAvertismentRuningPSTK = true
            }
        } else if (this.envEnabled === false) {
            this.popupTitle = ""

            this.translateService.get("ATTACHEMENT.popuptoolkittitle").subscribe((res) => {
                this.popupTitle = res
            })


            this.envPstkRunning = null
            this.cookieService.set('envPstkRunning', 'false',expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
            this.cookieService.set('PstkEnabled', String(this.configPSTKForm.value.enabled),expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
            this.popupSetingPSTK = false;
            this.closepopupSetingPSTK.emit(this.popupSetingPSTK)

            this.translateService.get("ATTACHEMENT.VerifStoped").subscribe(
                res => {
                    this.toastr.warning(res, '', {
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

    }

    async checkpstkfirstTime() {
        let maxAge = 3600;

        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (maxAge * 1000));

        this.cookieService.set('selectedLicensepstk', this.selectedLicensepstk,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))


        if (this.cookieService.get('PstkEnabled') != null && this.cookieService.get('PstkEnabled') != undefined && this.cookieService.get('PstkEnabled') != '') {
            if (JSON.parse(this.cookieService.get('PstkEnabled')) === true) {

                this.closepopupSetingPSTK.emit(this.popupSetingPSTK);


                if (this.cookieService.get('selectedLicensepstk') != ''
                    && this.cookieService.get('selectedLicensepstk') != undefined && this.cookieService.get('selectedLicensepstk') != null
                    && this.cookieService.get('selectedLicensepstk') != 'undefined' && this.cookieService.get('selectedLicensepstk') != 'null') {
                    this.selectedLicensepstk = this.cookieService.get('selectedLicensepstk');
                }


                if (this.selectedLicensepstk === 'Machine') {
                    if (this.cookieService.get(this.ModuleScan) != '') {
                        this.cookieService.delete(this.ModuleScan, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')));
                    }
                    if (this.cookieService.get(this.ModuleSign) != '') {
                        this.cookieService.delete(this.ModuleSign,"/", window.location.hostname.substring(window.location.hostname.indexOf('.')));
                    }
                    if (this.cookieService.get(this.ModuleMisc) != '') {
                        this.cookieService.delete(this.ModuleMisc,"/", window.location.hostname.substring(window.location.hostname.indexOf('.')));
                    }
                    if (this.cookieService.get(this.ModuleOffice) != '') {
                        this.cookieService.delete(this.ModuleOffice,"/", window.location.hostname.substring(window.location.hostname.indexOf('.')));
                    }


                    this.fileservice.checkPSTK(this.configPSTKForm.value.Port, null, null, null, null).subscribe(async (res: any) => {
                        let scan = '', sign = '', misc = '', office = '';
                        if (res.result.Module.Module_Misc) {
                            misc = '\n Module MISC est activé.';
                        } else {
                            misc = '\n Module MISC est déactivé.';
                        }
                        if (res.result.Module.Module_Sign) {
                            sign = '\n Module SIGN est activé.';
                        } else {
                            sign = '\n Module SIGN est déactivé.';
                        }
                        if (res.result.Module.Module_Office) {
                            office = '\n Module OFFICE est activé.';
                        } else {
                            office = '\n Module OFFICE est déactivé.';
                        }
                        if (res.result.Module.Module_Scan) {
                            scan = '\n Module SCAN est activé.';
                        } else {
                            scan = '\n Module SCAN est déactivé.';
                        }

                        if (res.result.Module.Module_Misc && res.result.Module.Module_Office && res.result.Module.Module_Sign && res.result.Module.Module_Scan) {
                            // let maxAge = 3600
                            // const expirationDate = new Date();
                            // expirationDate.setTime(expirationDate.getTime() + (maxAge * 1000));
                            // this.cookieService.set(this.ModuleScan, null, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                            // this.cookieService.set(this.ModuleOffice, null, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                            // this.cookieService.set(this.ModuleSign, null, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                            // this.cookieService.set(this.ModuleMisc, null, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))

                            this.popupTitle = '';
                            this.pstkVersion = '';

                            this.envPstkRunning = true;
                            this.cookieService.set('envPstkRunning', this.envPstkRunning,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))


                            this.popupTitle += res.result.portProd;
                            this.pstkVersion += res.result.version;
                            this.pstkInfo = res.result.appName + res.result.version + ' est en cours d\'execution sur le port ' + res.result.portProd + '.';
                            // this.pstkInfo = "<em>" + res.result.appName + "</em> <b>" + res.result.version + "</b> <em> est en cours d'execution sur le port </em> <b>" + res.result.port + "</b> ."
                            this.pstkInfo += scan + sign + office + misc;
                            this.cookieService.set('pstkInfo', this.pstkInfo,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                            this.pstkInfoEvent.emit(this.pstkInfo);

                            this.translateService.get('ATTACHEMENT.popuptoolkittitle').subscribe((res) => {
                                this.popupTitle = res;
                            });
                        } else {
                            this.popupTitle = '';
                            this.pstkVersion = '';

                            this.envPstkRunning = true;
                            this.cookieService.set('envPstkRunning', this.envPstkRunning,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))


                            this.popupTitle += res.result.portProd;
                            this.pstkVersion += res.result.version;

                            this.translateService.get('ATTACHEMENT.pstkLicense').subscribe((res) => {


                                this.pstkInfo = res;
                                this.cookieService.set('pstkInfo', this.pstkInfo,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                                this.pstkInfoEvent.emit(this.pstkInfo);
                            });
                        }
                    });
                } else if (this.selectedLicensepstk === 'Serveur') {
                    let authorizationtokenScan = null;

                    if (this.cookieService.get(this.ModuleScan) === 'undefined'
                        || this.cookieService.get(this.ModuleScan) === undefined
                        || this.cookieService.get(this.ModuleScan) === '') {

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
                    } else if (this.cookieService.get(this.ModuleScan) === 'null'
                        || this.cookieService.get(this.ModuleScan) === null) {
                        authorizationtokenScan = null;
                    } else {
                        authorizationtokenScan = this.cookieService.get(this.ModuleScan);
                    }


                    let authorizationtokenSign = null;

                    if (this.cookieService.get(this.ModuleSign) === 'undefined'
                        || this.cookieService.get(this.ModuleSign) === undefined
                        || this.cookieService.get(this.ModuleSign) === '') {
                        await this.fileservice.getToken(this.ModuleSign).then(
                            (res: any) => {
                                if (res && res.res.body.authorizationToken) {
                                    authorizationtokenSign = res.res.body.authorizationToken;
                                }
                            }, (error) => {
                                // console.error(error);
                                authorizationtokenSign = null;
                            }
                        );
                    } else if (this.cookieService.get(this.ModuleSign) === 'null'
                        || this.cookieService.get(this.ModuleSign) === null) {
                        authorizationtokenSign = null;
                    } else {
                        authorizationtokenSign = this.cookieService.get(this.ModuleSign);
                    }


                    let authorizationtokenMisc = null;

                    if (this.cookieService.get(this.ModuleMisc) === 'undefined'
                        || this.cookieService.get(this.ModuleMisc) === undefined
                        || this.cookieService.get(this.ModuleMisc) === '') {
                        await this.fileservice.getToken(this.ModuleMisc).then(
                            (res: any) => {
                                if (res && res.res.body.authorizationToken) {
                                    authorizationtokenMisc = res.res.body.authorizationToken;
                                }
                            }, (error) => {
                                // console.error(error);
                                authorizationtokenMisc = null;
                            }
                        );
                    } else if (this.cookieService.get(this.ModuleMisc) === 'null'
                        || this.cookieService.get(this.ModuleMisc) === null) {
                        authorizationtokenMisc = null;
                    } else {
                        authorizationtokenMisc = this.cookieService.get(this.ModuleMisc);
                    }

                    let authorizationtokenOffice = null;

                    if (this.cookieService.get(this.ModuleOffice) === 'undefined'
                        || this.cookieService.get(this.ModuleOffice) === undefined
                        || this.cookieService.get(this.ModuleOffice) === '') {
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
                    } else if (this.cookieService.get(this.ModuleOffice) === 'null'
                        || this.cookieService.get(this.ModuleOffice) === null) {
                        authorizationtokenOffice = null;
                    } else {
                        authorizationtokenOffice = this.cookieService.get(this.ModuleOffice);
                    }


                    this.fileservice.checkPSTK(this.configPSTKForm.value.Port, authorizationtokenMisc, authorizationtokenScan, authorizationtokenSign, authorizationtokenOffice).subscribe((res: any) => {
                            let scan = '', sign = '', misc = '', office = '';
                            if (res.result.Module.Module_Misc) {
                                misc = '\n Module MISC est activé.';
                            } else {
                                misc = '\n Module MISC est déactivé.';
                            }
                            if (res.result.Module.Module_Sign) {
                                sign = '\n Module SIGN est activé.';
                            } else {
                                sign = '\n Module SIGN est déactivé.';
                            }
                            if (res.result.Module.Module_Office) {
                                office = '\n Module OFFICE est activé.';
                            } else {
                                office = '\n Module OFFICE est déactivé.';
                            }
                            if (res.result.Module.Module_Scan) {
                                scan = '\n Module SCAN est activé.';
                            } else {
                                scan = '\n Module SCAN est déactivé.';
                            }


                            this.popupTitle = '';
                            this.pstkVersion = '';

                            this.envPstkRunning = true;
                            this.cookieService.set('envPstkRunning', this.envPstkRunning,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))


                            this.popupTitle += res.result.portProd;
                            this.pstkVersion += res.result.version;
                            this.pstkInfo = res.result.appName + res.result.version + ' est en cours d\'execution sur le port ' + res.result.portProd + '.';
                            // this.pstkInfo = "<em>" + res.result.appName + "</em> <b>" + res.result.version + "</b> <em> est en cours d'execution sur le port </em> <b>" + res.result.port + "</b> ."
                            this.pstkInfo += scan + sign + office + misc;
                            this.cookieService.set('pstkInfo', this.pstkInfo,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))

                            this.pstkInfoEvent.emit(this.pstkInfo);

                            this.translateService.get('ATTACHEMENT.popuptoolkittitle').subscribe((res) => {
                                this.popupTitle = res;
                            });


                        }, (err) => {
                            this.popupTitle = '';
                            this.pstkVersion = '';


                            this.translateService.get('ATTACHEMENT.popuptoolkittitle').subscribe((res) => {
                                this.popupTitle = res;
                            });
                            this.envPstkRunning = false;
                            this.cookieService.set('envPstkRunning', this.envPstkRunning,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))

                            this.translateService.get('ATTACHEMENT.pstkerror').subscribe((res) => {
                                this.pstkInfo = res;
                                this.pstkInfoEvent.emit(this.pstkInfo);
                                this.cookieService.set('pstkInfo', this.pstkInfo,expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))

                            });
                        }
                    );
                }

            } else {
                if (this.refreshIntervalIdSecond != null) {
                    clearInterval(this.refreshIntervalIdSecond);
                }
            }
        } else {
            if (this.refreshIntervalIdSecond != null) {
                clearInterval(this.refreshIntervalIdSecond);
            }
        }
    }

    // async checkpstk() {
    //     let maxAge = 3600;
    //
    //     const expirationDate = new Date();
    //     expirationDate.setTime(expirationDate.getTime() + (maxAge * 1000));
    //
    //     this.cookieService.set('selectedLicensepstk', this.selectedLicensepstk);
    //
    //
    //     if (this.cookieService.get('PstkEnabled') != null && this.cookieService.get('PstkEnabled') != undefined && this.cookieService.get('PstkEnabled') != ''
    //         && this.cookieService.get('PstkTimerMS') != null && this.cookieService.get('PstkTimerMS') != undefined && this.cookieService.get('PstkTimerMS') != '') {
    //         if (JSON.parse(this.cookieService.get('PstkEnabled')) === true &&
    //             JSON.parse(this.cookieService.get('PstkTimerMS')) != 0 &&
    //             JSON.parse(this.cookieService.get('PstkTimerMS')) != null) {
    //
    //             this.closepopupSetingPSTK.emit(this.popupSetingPSTK);
    //
    //             if (this.cookieService.get('selectedLicensepstk') != ''
    //                 && this.cookieService.get('selectedLicensepstk') != undefined && this.cookieService.get('selectedLicensepstk') != null
    //                 && this.cookieService.get('selectedLicensepstk') != 'undefined' && this.cookieService.get('selectedLicensepstk') != 'null') {
    //                 this.selectedLicensepstk = this.cookieService.get('selectedLicensepstk');
    //             }
    //
    //             if (this.selectedLicensepstk === 'Machine') {
    //                 if (this.cookieService.get(this.ModuleScan) != '') {
    //                     this.cookieService.delete(this.ModuleScan, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')));
    //                 }
    //                 if (this.cookieService.get(this.ModuleSign) != '') {
    //                     this.cookieService.delete(this.ModuleSign,"/", window.location.hostname.substring(window.location.hostname.indexOf('.')));
    //                 }
    //                 if (this.cookieService.get(this.ModuleMisc) != '') {
    //                     this.cookieService.delete(this.ModuleMisc,"/", window.location.hostname.substring(window.location.hostname.indexOf('.')));
    //                 }
    //                 if (this.cookieService.get(this.ModuleOffice) != '') {
    //                     this.cookieService.delete(this.ModuleOffice,"/", window.location.hostname.substring(window.location.hostname.indexOf('.')));
    //                 }
    //
    //                 this.fileservice.checkPSTK(this.configPSTKForm.value.Port, null, null, null, null).subscribe(async (res: any) => {
    //                     let scan = '', sign = '', misc = '', office = '';
    //                     if (res.result.Module.Module_Misc) {
    //                         misc = '\n Module MISC est activé.';
    //                     } else {
    //                         misc = '\n Module MISC est déactivé.';
    //                     }
    //                     if (res.result.Module.Module_Sign) {
    //                         sign = '\n Module SIGN est activé.';
    //                     } else {
    //                         sign = '\n Module SIGN est déactivé.';
    //                     }
    //                     if (res.result.Module.Module_Office) {
    //                         office = '\n Module OFFICE est activé.';
    //                     } else {
    //                         office = '\n Module OFFICE est déactivé.';
    //                     }
    //                     if (res.result.Module.Module_Scan) {
    //                         scan = '\n Module SCAN est activé.';
    //                     } else {
    //                         scan = '\n Module SCAN est déactivé.';
    //                     }
    //
    //                     if (res.result.Module.Module_Misc && res.result.Module.Module_Office && res.result.Module.Module_Sign && res.result.Module.Module_Scan) {
    //                         // let maxAge = 3600
    //                         // const expirationDate = new Date();
    //                         // expirationDate.setTime(expirationDate.getTime() + (maxAge * 1000));
    //                         // this.cookieService.set(this.ModuleScan, null, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
    //                         // this.cookieService.set(this.ModuleOffice, null, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
    //                         // this.cookieService.set(this.ModuleSign, null, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
    //                         // this.cookieService.set(this.ModuleMisc, null, expirationDate, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
    //
    //                     this.popupTitle = '';
    //                     this.pstkVersion = '';
    //
    //                     this.envPstkRunning = true;
    //                     this.cookieService.set('envPstkRunning', this.envPstkRunning);
    //
    //
    //                     this.popupTitle += res.result.portProd;
    //                     this.pstkVersion += res.result.version;
    //                     this.pstkInfo = res.result.appName + res.result.version + ' est en cours d\'execution sur le port ' + res.result.portProd + '.';
    //                     // this.pstkInfo = "<em>" + res.result.appName + "</em> <b>" + res.result.version + "</b> <em> est en cours d'execution sur le port </em> <b>" + res.result.port + "</b> ."
    //                         this.pstkInfo += scan + sign + office + misc;
    //                         this.cookieService.set('pstkInfo', this.pstkInfo);
    //
    //
    //                         this.pstkInfoEvent.emit(this.pstkInfo);
    //
    //                         this.translateService.get('ATTACHEMENT.popuptoolkittitle').subscribe((res) => {
    //                             this.popupTitle = res;
    //                         });
    //                     } else {
    //                         this.popupTitle = '';
    //                         this.pstkVersion = '';
    //
    //                         this.envPstkRunning = true;
    //                         this.cookieService.set('envPstkRunning', this.envPstkRunning);
    //
    //
    //                         this.popupTitle += res.result.portProd;
    //                         this.pstkVersion += res.result.version;
    //
    //                         this.translateService.get('ATTACHEMENT.pstkLicense').subscribe((res) => {
    //
    //
    //                             this.pstkInfo = res;
    //                             this.cookieService.set('pstkInfo', this.pstkInfo);
    //                             this.pstkInfoEvent.emit(this.pstkInfo);
    //                         });
    //                     }
    //                 })
    //             } else if (this.selectedLicensepstk === 'Serveur') {
    //                 let authorizationtokenScan = null;
    //
    //                 if (this.cookieService.get(this.ModuleScan) === 'undefined'
    //                     || this.cookieService.get(this.ModuleScan) === undefined
    //                     || this.cookieService.get(this.ModuleScan) === '') {
    //
    //                     await this.fileservice.getToken(this.ModuleScan).then(
    //                         (res: any) => {
    //                             if (res && res.res.body.authorizationToken) {
    //                                 authorizationtokenScan = res.res.body.authorizationToken;
    //                             }
    //                         }, (error) => {
    //                             // console.error(error);
    //                             authorizationtokenScan = null;
    //                         }
    //                     );
    //                 } else if (this.cookieService.get(this.ModuleScan) === 'null'
    //                     || this.cookieService.get(this.ModuleScan) === null) {
    //                     authorizationtokenScan = null;
    //                 } else {
    //                     authorizationtokenScan = this.cookieService.get(this.ModuleScan);
    //                 }
    //
    //
    //                     let authorizationtokenSign = null;
    //
    //                     if (this.cookieService.get(this.ModuleSign) === 'undefined'
    //                         || this.cookieService.get(this.ModuleSign) === undefined
    //                         || this.cookieService.get(this.ModuleSign) === '') {
    //                         await this.fileservice.getToken(this.ModuleSign).then(
    //                             (res: any) => {
    //                                 if (res && res.res.body.authorizationToken) {
    //                                     authorizationtokenSign = res.res.body.authorizationToken;
    //                                 }
    //                             }, (error) => {
    //                                 // console.error(error);
    //                                 authorizationtokenSign = null;
    //                             }
    //                         );
    //                     } else if (this.cookieService.get(this.ModuleSign) === 'null'
    //                         || this.cookieService.get(this.ModuleSign) === null) {
    //                         authorizationtokenSign = null;
    //                     } else {
    //                         authorizationtokenSign = this.cookieService.get(this.ModuleSign);
    //                     }
    //
    //
    //                     let authorizationtokenMisc = null;
    //
    //                     if (this.cookieService.get(this.ModuleMisc) === 'undefined'
    //                         || this.cookieService.get(this.ModuleMisc) === undefined
    //                         || this.cookieService.get(this.ModuleMisc) === '') {
    //                         await this.fileservice.getToken(this.ModuleMisc).then(
    //                             (res: any) => {
    //                                 if (res && res.res.body.authorizationToken) {
    //                                     authorizationtokenMisc = res.res.body.authorizationToken;
    //                                 }
    //                             }, (error) => {
    //                                 // console.error(error);
    //                                 authorizationtokenMisc = null;
    //                             }
    //                         );
    //                     } else if (this.cookieService.get(this.ModuleMisc) === 'null'
    //                         || this.cookieService.get(this.ModuleMisc) === null) {
    //                         authorizationtokenMisc = null;
    //                     } else {
    //                         authorizationtokenMisc = this.cookieService.get(this.ModuleMisc);
    //                     }
    //
    //                     let authorizationtokenOffice = null;
    //
    //                     if (this.cookieService.get(this.ModuleOffice) === 'undefined'
    //                         || this.cookieService.get(this.ModuleOffice) === undefined
    //                         || this.cookieService.get(this.ModuleOffice) === '') {
    //                         await this.fileservice.getToken(this.ModuleOffice).then(
    //                             (res: any) => {
    //                                 if (res && res.res.body.authorizationToken) {
    //                                     authorizationtokenOffice = res.res.body.authorizationToken;
    //                                 }
    //                             }, (error) => {
    //                                 // console.error(error);
    //                                 authorizationtokenOffice = null;
    //                             }
    //                         );
    //                     } else if (this.cookieService.get(this.ModuleOffice) === 'null'
    //                         || this.cookieService.get(this.ModuleOffice) === null) {
    //                         authorizationtokenOffice = null;
    //                     } else {
    //                         authorizationtokenOffice = this.cookieService.get(this.ModuleOffice);
    //                     }
    //
    //
    //                     this.fileservice.checkPSTK(this.configPSTKForm.value.Port, authorizationtokenMisc, authorizationtokenScan, authorizationtokenSign, authorizationtokenOffice).subscribe((res: any) => {
    //                             let scan = '', sign = '', misc = '', office = '';
    //                             if (res.result.Module.Module_Misc) {
    //                                 misc = '\n Module MISC est activé.';
    //                             } else {
    //                                 misc = '\n Module MISC est déactivé.';
    //                             }
    //                             if (res.result.Module.Module_Sign) {
    //                                 sign = '\n Module SIGN est activé.';
    //                             } else {
    //                                 sign = '\n Module SIGN est déactivé.';
    //                             }
    //                             if (res.result.Module.Module_Office) {
    //                                 office = '\n Module OFFICE est activé.';
    //                             } else {
    //                                 office = '\n Module OFFICE est déactivé.';
    //                             }
    //                             if (res.result.Module.Module_Scan) {
    //                                 scan = '\n Module SCAN est activé.';
    //                             } else {
    //                                 scan = '\n Module SCAN est déactivé.';
    //                             }
    //
    //
    //                             this.popupTitle = '';
    //                             this.pstkVersion = '';
    //
    //                             this.envPstkRunning = true;
    //                             this.cookieService.set('envPstkRunning', this.envPstkRunning);
    //
    //
    //                             this.popupTitle += res.result.portProd;
    //                             this.pstkVersion += res.result.version;
    //                             this.pstkInfo = res.result.appName + res.result.version + ' est en cours d\'execution sur le port ' + res.result.portProd + '.';
    //                             // this.pstkInfo = "<em>" + res.result.appName + "</em> <b>" + res.result.version + "</b> <em> est en cours d'execution sur le port </em> <b>" + res.result.port + "</b> ."
    //                         this.pstkInfo += scan + sign + office + misc;
    //                         this.cookieService.set('pstkInfo', this.pstkInfo);
    //
    //                             this.pstkInfoEvent.emit(this.pstkInfo);
    //
    //                             this.translateService.get('ATTACHEMENT.popuptoolkittitle').subscribe((res) => {
    //                                 this.popupTitle = res;
    //                             });
    //
    //
    //                         }, (err) => {
    //                             this.popupTitle = '';
    //                             this.pstkVersion = '';
    //
    //
    //                             this.translateService.get('ATTACHEMENT.popuptoolkittitle').subscribe((res) => {
    //                                 this.popupTitle = res;
    //                             });
    //                             this.envPstkRunning = false;
    //                             this.cookieService.set('envPstkRunning', this.envPstkRunning);
    //
    //                             this.translateService.get('ATTACHEMENT.pstkerror').subscribe((res) => {
    //                                 this.pstkInfo = res;
    //                                 this.cookieService.set('pstkInfo', this.pstkInfo);
    //
    //                                 this.pstkInfoEvent.emit(this.pstkInfo);
    //
    //                             });
    //                         }
    //                     );
    //                 }
    //         } else {
    //             if (this.refreshIntervalIdSecond != null) {
    //                 clearInterval(this.refreshIntervalIdSecond);
    //             }
    //         }
    //     } else {
    //         if (this.refreshIntervalIdSecond != null) {
    //             clearInterval(this.refreshIntervalIdSecond);
    //         }
    //     }
    // }

    close() {
        this.popupSetingPSTK = false;
        this.closepopupSetingPSTK.emit(this.popupSetingPSTK);

        if (this.cookieService.get('PstkEnabled') != null && this.cookieService.get('PstkEnabled') != undefined && this.cookieService.get('PstkEnabled') != '') {
            this.envEnabled = JSON.parse(this.cookieService.get('PstkEnabled'));
        }
        // if (this.cookieService.get('PstkTimerMS') != null && this.cookieService.get('PstkTimerMS') != undefined && this.cookieService.get('PstkTimerMS') != '') {
        //     this.defaultTimer = this.secondToMin(JSON.parse(this.cookieService.get('PstkTimerMS')));
        // }
        if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '') {
            this.defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
        }

        this.configPSTKForm = this.fb.group({
                Port: [this.defaultPort, Validators.required],
                enabled: [this.envEnabled, Validators.required],
            }
        );
    }

    switchchange(e) {
        this.envEnabled = e.value
    }
    switchchangewithoutpopup(e) {
        this.envEnabled = e.value
        this.submit()
    }

    minToSecond(min) {
        return min * 60 * 1000;
    }

    secondToMin(second) {
        return (Math.floor(second / 60)) / 1000;
    }

    TelechargerTollkit() {
        window.location.href = this.env.cloudMsiPSTK;
    }
}

