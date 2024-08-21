import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {EnvService} from '../../../../../env.service';
import {AttachementModuleService} from '../attachement.module.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class CommunFuncService {
    ModuleScan = require('../ModulePSTK.json').Module_Scan;
    ModuleSign = require('../ModulePSTK.json').Module_Sign;
    ModuleOffice = require('../ModulePSTK.json').Module_Office;
    ModuleMisc = require('../ModulePSTK.json').Module_Misc;

    constructor(private datepipe: DatePipe, private env: EnvService, private fileservice: AttachementModuleService, private cookieService: CookieService) {
    }

    verifDateOfSavedLocaStorage(name) {
        let data = localStorage.getItem(name)
        if (data !== null && data !== undefined && data !== '') {
            return this.datepipe.transform(new Date(), 'yyyy-MM-dd') == JSON.parse(localStorage.getItem(name)).date ? true : false
        } else {
            return false
        }
    }

    /*Convert size*/
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0 || bytes === null) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.trunc(parseFloat((bytes / Math.pow(k, i)).toFixed(dm))) + ' ' + sizes[i];
    }

    /*Convert size*/

    /*base64 to byte array, vice versaa*/
    base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    }

    /*base64 to byte array, vice versaa*/
    selectedLicensepstk;

    /*Verif auth token and return it */
    async authorizationToken(module) {
        let pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
        if (pstkEnabledAndRunning) {
            let defaultPort;
            /*IN D}ATAGRID ATTACHEMENT ALL WE NEED MODULE PSTK OF SCAN && OFFICE && SIG*/
            if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '') {
                defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
            } else {
                defaultPort = this.env.pstkport;
            }
            let authorizationToken = null;
            if (this.cookieService.get(module) === 'undefined'
                || this.cookieService.get(module) === undefined
                || this.cookieService.get(module) === '') {


                if (this.cookieService.get('selectedLicensepstk') != ''
                    && this.cookieService.get('selectedLicensepstk') != undefined && this.cookieService.get('selectedLicensepstk') != null
                    && this.cookieService.get('selectedLicensepstk') != 'undefined' && this.cookieService.get('selectedLicensepstk') != 'null')
                    this.selectedLicensepstk = this.cookieService.get('selectedLicensepstk');


                if (this.selectedLicensepstk === 'Machine') {
                    return new Promise(async (resolve) => {
                        await this.fileservice.checkPSTK(defaultPort, null, null, null, null).subscribe(async (res: any) => {
                            let rslt = false;
                            if (module === this.ModuleScan) {
                                rslt = await res.result.Module.Module_Scan;
                            } else if (module === this.ModuleSign) {
                                rslt = await res.result.Module.Module_Sign;
                            } else if (module === this.ModuleOffice) {
                                rslt = await res.result.Module.Module_Office;
                            } else if (module === this.ModuleMisc) {
                                rslt = await res.result.Module.Module_Misc;
                            }
                            if (rslt) {
                                authorizationToken = null;
                                resolve(authorizationToken)
                            } else {
                                authorizationToken = '';
                                resolve(authorizationToken);
                            }
                        });
                    }).then(res => {
                        return res;
                    })
                } else if (this.selectedLicensepstk === 'Serveur') {
                    return new Promise(async (resolve) => {
                        await this.fileservice.getToken(module).then(async (res: any) => {
                                if (res && res.res.body.authorizationToken) {
                                    authorizationToken = await res.res.body.authorizationToken;
                                    resolve(authorizationToken);
                                }
                            }, async (error) => {
                                // console.error(error);
                                authorizationToken = '';
                                resolve(authorizationToken);
                            }
                        );
                    }).then(res => {
                        return res;
                    })
                }
            } else {
                authorizationToken = this.cookieService.get(module);
                return (authorizationToken);
            }
        }
    }


    /*verif auth token and return true/false */
    async verifLicensePSTK(module) {
        let pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
        let authorizationTokenBoolean = false;
        if (!pstkEnabledAndRunning) {
            authorizationTokenBoolean = false;
            return authorizationTokenBoolean;
        } else {
            let authorizationToken: any = await this.authorizationToken(module)

            if (authorizationToken === null) {
                authorizationTokenBoolean = true;
                return authorizationTokenBoolean;
            } else if (authorizationToken === '' || authorizationToken === undefined) {
                authorizationTokenBoolean = false;
                return authorizationTokenBoolean;
            } else {
                let defaultPort;
                /*IN D}ATAGRID ATTACHEMENT ALL WE NEED MODULE PSTK OF SCAN && OFFICE && SIG*/
                if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '') {
                    defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
                } else {
                    defaultPort = this.env.pstkport;
                }
                return new Promise(async (resolve) => {
                    if (module === this.ModuleScan) {
                        await this.fileservice.checkPSTK(defaultPort, null, await authorizationToken, null, null).subscribe((res: any) => {
                                if (res.result.Module.Module_Scan) {
                                    authorizationTokenBoolean = true;
                                }
                                resolve(authorizationTokenBoolean);

                            }
                        );
                    } else if (module === this.ModuleSign) {

                        await this.fileservice.checkPSTK(defaultPort, null, null, await authorizationToken, null).subscribe((res: any) => {
                                if (res.result.Module.Module_Sign) {
                                    authorizationTokenBoolean = true;
                                }
                                resolve(authorizationTokenBoolean);

                            }
                        );
                    } else if (module === this.ModuleOffice) {

                        await this.fileservice.checkPSTK(defaultPort, null, null, null, await authorizationToken).subscribe((res: any) => {
                                if (res.result.Module.Module_Office) {
                                    authorizationTokenBoolean = true;
                                }
                                resolve(authorizationTokenBoolean);

                            }
                        );
                    } else if (module === this.ModuleMisc) {

                        await this.fileservice.checkPSTK(defaultPort, await authorizationTokenBoolean, null, null, null).subscribe((res: any) => {
                                if (res.result.Module.Module_Sign) {
                                    authorizationTokenBoolean = true;
                                }
                                resolve(authorizationTokenBoolean);

                            }
                        );
                    }
                })
            }
        }
    }


    //
    //
    // async verifScanSign(){
    //     let Rslt = {
    //         authorizationTokenScanBoolean: false,
    //         authorizationTokenSignBoolean: false,
    //         authorizationtokenScan: null
    //     }
    //     let pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
    //     let authorizationTokenScanBoolean
    //     let authorizationTokenSignBoolean
    //     if (!pstkEnabledAndRunning) {
    //            authorizationTokenScanBoolean = false;
    //             authorizationTokenSignBoolean = false;
    //         }
    //     if (pstkEnabledAndRunning) {
    //         let authorizationtokenScan = this.authorizationToken(this.ModuleScan)
    //         let authorizationtokenSign = this.authorizationToken(this.ModuleSign)
    //
    //
    //
    //         if (authorizationtokenScan===null) {
    //             authorizationTokenScanBoolean = true;
    //             Rslt.authorizationTokenScanBoolean = authorizationTokenScanBoolean
    //             Rslt.authorizationtokenScan = authorizationtokenScan
    //             return Rslt;
    //         }else{
    //             let defaultPort;
    //             /*IN D}ATAGRID ATTACHEMENT ALL WE NEED MODULE PSTK OF SCAN && OFFICE && SIG*/
    //             if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '') {
    //                 defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
    //             } else {
    //                 defaultPort = this.env.pstkport;
    //             }
    //             return new Promise(async (resolve) => {
    //                 if (module === this.ModuleScan) {
    //                     await this.fileservice.checkPSTK(defaultPort, null, await authorizationtokenScan, null, null).subscribe((res: any) => {
    //                             if (res.result.Module.Module_Scan) {
    //                                 authorizationTokenScanBoolean = true;
    //                                 Rslt.authorizationTokenScanBoolean = authorizationTokenScanBoolean
    //                                 Rslt.authorizationtokenScan = authorizationtokenScan
    //
    //                             }
    //                             resolve(Rslt);
    //
    //                         }
    //                     );
    //                 }
    //             })
    //         }
    //
    //
    //
    //         if (authorizationtokenSign===null) {
    //             authorizationTokenSignBoolean = true;
    //             Rslt.authorizationTokenSignBoolean = authorizationTokenSignBoolean
    //             return Rslt;
    //         }else{
    //             let defaultPort;
    //             /*IN D}ATAGRID ATTACHEMENT ALL WE NEED MODULE PSTK OF SCAN && OFFICE && SIG*/
    //             if (this.cookieService.get('PstkPort') != null && this.cookieService.get('PstkPort') != undefined && this.cookieService.get('PstkPort') != '') {
    //                 defaultPort = JSON.parse(this.cookieService.get('PstkPort'));
    //             } else {
    //                 defaultPort = this.env.pstkport;
    //             }
    //             return new Promise(async (resolve) => {
    //                 if (module === this.ModuleSign) {
    //
    //                     await this.fileservice.checkPSTK(defaultPort, null, null, await authorizationtokenSign, null).subscribe((res: any) => {
    //                             if (res.result.Module.Module_Sign) {
    //                                 authorizationTokenSignBoolean = true;
    //                                 Rslt.authorizationTokenSignBoolean = authorizationTokenSignBoolean
    //                             }
    //                             resolve(Rslt);
    //                         }
    //                     );
    //                 }
    //             })
    //         }
    //
    //     }
    //     }
}
