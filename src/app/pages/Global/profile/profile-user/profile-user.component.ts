import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, Validators} from "@angular/forms";
import {EnvService} from "../../../../../env.service";
import {CookieService} from "ngx-cookie-service";
import {ToastrService} from "ngx-toastr";
import {ConfigPstkComponent} from "../../config-pstk/config-pstk.component";
import {CommunFuncService} from "../../attachment/Commun/commun-func.service";
import {LoginService} from "../../shared-service/login.service";
import {AttachementModuleService} from "../../attachment/attachement.module.service";

declare var $: JQueryStatic;

@Component({
    selector: 'app-profile-user',
    templateUrl: './profile-user.component.html',
    styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit, AfterViewInit {
    popupfavoris: boolean = false;
    securityLevel = localStorage.getItem('securityLevel')
    profile = localStorage.getItem('profil')
    editMode: boolean = false;
    width: boolean = false
    width2: boolean
    /*Default Port/Timer*/
    envEnabled = false
    defaultTimer = this.env.pstkRunnigTimer
    defaultPort = this.env.pstkport
    /*Default Port/Timer*/
    configPSTKForm = this.fb.group({
        Timer: ['', Validators.required],
        Port: ['', Validators.required],
        enabled: [this.envEnabled, Validators.required],
    });
    popupTitle
    refreshIntervalId = null
    refreshIntervalIdSecond = null
    envPstkRunning = null
    ModuleScan = require('src/app/pages/Global/attachment/ModulePSTK.json').Module_Scan
    loadingVisible: any = false;
    popupInstallToolkitVisible = false;
    roles = this.cookieService.get('roles').split(',')
    scriptSelected
    /*Config PSTK component*/
    popupSetingPSTK = false;
    submmited = false;
    pstkInfo;
    pstkEnable;
    PstkisRunning;
    ListeScanner = [];
    RefUserName
    avertissementPstk;
    user: any;
    userFavoris = [];
    pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true'
    authorizationTokenScan
    listPersonne: any;
    imprimante: boolean = false;
    listScript;
    /************************************ SCANNER ****************************************************/
    configjson = {
        scannerName: null,
        scannerProfil: null,
    }
    scan_preferences: any = []
    scanner;
    /************************ PHOTO **************************/
    url: any;
    showclearicon: any = false;
    showValidicon: any = false;
    photo: any;

    // confirmer() {
    //     this.popupfavoris = false;
    //     let fav = new favoris()
    //     let tabAdd = this.listPersonne.filter(ar => !this.userFavoris.find(rm => (rm.sid === ar.sid)))
    //     let tabDelete = this.userFavoris.filter(ar => !this.listPersonne.find(rm => (rm.sid === ar.sid)))
    //     for (let t of tabDelete) {
    //         this.loginService.deletefavories(t.id).subscribe(data => {
    //             this.translateService.get("deleteWithSuccess").subscribe((res) => {
    //                 this.toastr.success("", res, {
    //                     closeButton: true,
    //                     positionClass: 'toast-top-full-width',
    //                     extendedTimeOut: this.env.extendedTimeOutToastr,
    //                     progressBar: true,
    //                     disableTimeOut: false,
    //                     timeOut: this.env.timeOutToastr
    //                 })
    //             })
    //         }, error => {
    //             this.toastr.error("", error.error.message, {
    //                 closeButton: true,
    //                 positionClass: 'toast-top-full-width',
    //                 extendedTimeOut: this.env.extendedTimeOutToastr,
    //                 progressBar: true,
    //                 disableTimeOut: false,
    //                 timeOut: this.env.timeOutToastr
    //             })
    //         })
    //     }
    //     for (let t of tabAdd) {
    //         fav.aclSid = {"id": t.id}
    //         this.loginService.postfavories(fav).subscribe(data => {
    //             this.translateService.get("postWithSuccess").subscribe((res) => {
    //                 this.toastr.success("", res, {
    //                     closeButton: true,
    //                     positionClass: 'toast-top-full-width',
    //                     extendedTimeOut: this.env.extendedTimeOutToastr,
    //                     progressBar: true,
    //                     disableTimeOut: false,
    //                     timeOut: this.env.timeOutToastr
    //                 })
    //             })
    //         }, error => {
    //             this.toastr.error("", error.error.message, {
    //                 closeButton: true,
    //                 positionClass: 'toast-top-full-width',
    //                 extendedTimeOut: this.env.extendedTimeOutToastr,
    //                 progressBar: true,
    //                 disableTimeOut: false,
    //                 timeOut: this.env.timeOutToastr
    //             })
    //         })
    //     }
    //     this.loginService.myFavoris().subscribe((data: []) => {
    //         let tab = []
    //         tab = data
    //         this.userFavoris = []
    //         tab.forEach(element => {
    //             this.userFavoris.push(element['aclSid'])
    //         })
    //     }, error => {
    //         this.toastr.error("", error.error.message, {
    //             closeButton: true,
    //             positionClass: 'toast-top-full-width',
    //             extendedTimeOut: this.env.extendedTimeOutToastr,
    //             progressBar: true,
    //             disableTimeOut: false,
    //             timeOut: this.env.timeOutToastr
    //         })
    //     })
    // }
    @ViewChild(ConfigPstkComponent) private configPstkComponent: ConfigPstkComponent;

    /*Config PSTK component*/
    constructor(public communService: CommunFuncService, private env: EnvService, private cookieService: CookieService, private translateService: TranslateService,
                private loginService: LoginService, private fileservice: AttachementModuleService, private fb: FormBuilder, private toastr: ToastrService) {
        if (this.cookieService.get('displayname')) {
            this.RefUserName = {displayName: this.cookieService.get('displayname')};
        } else {
            this.RefUserName = {displayName: 'utilisateur'};
        }

        if (localStorage.getItem('PstkEnabled') != null) {
            this.envEnabled = JSON.parse(localStorage.getItem('PstkEnabled'));
        }
        if (localStorage.getItem('PstkTimerMS') != null) {
            this.defaultTimer = this.secondToMin(JSON.parse(localStorage.getItem('PstkTimerMS')));
            this.configPSTKForm.get('Timer').setValue(this.defaultTimer)
        }
        if (localStorage.getItem('PstkPort') != null) {
            this.defaultPort = JSON.parse(localStorage.getItem('PstkPort'));
            this.configPSTKForm.get('Port').setValue(this.defaultPort)
        }
        if (localStorage.getItem('hasImprimante') != null) {
            this.imprimante = JSON.parse(localStorage.getItem('hasImprimante'));
        }
        if (localStorage.getItem('portImprimante') != null) {
            this.scriptSelected = parseInt(localStorage.getItem('portImprimante'));
        }
        this.configPSTKForm.get('Timer').setValue(this.defaultTimer)
        this.configPSTKForm.get('Port').setValue(this.defaultPort)
        if (this.refreshIntervalId != null)
            clearInterval(this.refreshIntervalId);
        if (this.refreshIntervalIdSecond != null)
            clearInterval(this.refreshIntervalIdSecond);
        this.submmited = true
        if (this.envEnabled && this.imprimante) {
            let authorizationToken = null
            // await
            this.fileservice.getToken(this.ModuleScan).then(
                (res: any) => {
                    if (res && res.authorizationToken)
                        authorizationToken = res.authorizationToken
                }, (error) => {
                    console.error(error)
                }
            )

            this.fileservice.VerifPcTk(authorizationToken).subscribe(data => {
                this.listScript = data['result']
            })
        }
    }

    @HostListener('window:resize', ['$event'])

    onResize(event) {
        if (event.target.innerWidth > 1390) {
            this.width = false
        } else {
            this.width = true
        }
        if (event.target.innerWidth > 588) {
            this.width2 = false
        } else {
            this.width2 = true
        }
    }

    ngOnInit(): void {
        if (innerWidth > 1390) {
            this.width = false
        } else {
            this.width = true
        }
        if (innerWidth > 588) {
            this.width2 = false
        } else {
            this.width2 = true
        }
        this.getProfileUser();
        this.getMyFavory();

        /*LISTE PROFIL */
        this.fileservice.getscan_preferences().subscribe((data: any) => {
                this.scan_preferences = data;
                if ((this.cookieService.get('scannerName')) != 'null' &&
                    (this.cookieService.get('scannerName')) != 'undefined' &&
                    (this.cookieService.get('scannerProfil') != 'undefined' &&
                        (this.cookieService.get('scannerProfil') != 'null'))) {
                    this.scanner = this.cookieService.get('scannerName')
                    this.configjson.scannerName = this.cookieService.get('scannerName')
                    let jsonscanpreference = JSON.parse(this.cookieService.get('scannerProfil'));
                    let selectedprofile = data.find(({id}) => id === jsonscanpreference.id)
                    this.configjson.scannerProfil = selectedprofile;
                }
            }, error1 =>
                this.toastr.error(error1.error.message, "", {
                    closeButton: true,
                    positionClass: 'toast-top-right',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                })
        )


        if (!this.pstkEnabledAndRunning) {
            this.translateService.get('ATTACHEMENT.PstkNotEncours').subscribe((res) => {
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
        if (this.pstkEnabledAndRunning) {
            this.authorizationTokenScan = this.communService.authorizationToken(this.ModuleScan)

            /*LISTE SCANNER*/
            this.fileservice.GetListScanner(this.authorizationTokenScan, 'GetListScanner').subscribe((res: any) => {
                for (let i = 0; i < res.result.length; i++) {
                    this.ListeScanner[i] = res.result[i];
                }
                this.loadingVisible = false;
            }, err => {
                this.loadingVisible = false;
                if (err.status == 0 || err.status == 503 || err.status == 504) {//handle net::ERR_CONNECTION_REFUSED
                    this.popupInstallToolkitVisible = true;
                    this.avertissementPstk = true;
                } else {
                    this.translateService.get("ATTACHEMENT.errorPStk").subscribe((res) => {
                        this.toastr.error(err.result.detailError, res, {
                            closeButton: true,
                            positionClass: 'toast-top-full-width',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                    })
                    this.avertissementPstk = true;
                }
            })
        }
    }

    ngAfterViewInit(): void {
        $(document).ready(function () {

            var readURL = function (input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $('.profile-pic').attr('src', '' + e.target.result);
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            }

            $(".file-upload").on('change', function () {
                readURL(this);
            });

            $(".upload-button").on('click', function () {
                $(".file-upload").click();
            });
        });
    }

    getListFavoris() {
        this.popupfavoris = true;

    }

    getProfileUser() {
        this.loginService.profile_user().subscribe(data => {
            this.user = data
        }, error => {
            this.toastr.error("", error.error.message, {
                closeButton: true,
                positionClass: 'toast-top-full-width',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        })

    }

    updatePhoneNumber(employeeid, mobile) {
        this.loginService.putEmployePhoneNumber(employeeid, mobile).subscribe(data => {
            this.translateService.get("postWithSuccess").subscribe((res) => {
                this.getProfileUser()
                this.toastr.success("", res, {
                    closeButton: true,
                    positionClass: 'toast-top-full-width',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                })
            })
        }, error => {
            this.toastr.error("", error.error.message, {
                closeButton: true,
                positionClass: 'toast-top-full-width',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        })
        this.editMode = false
    }

    getMyFavory() {
        this.loginService.myFavoris().subscribe((data: []) => {
            let tab = []
            tab = data
            this.userFavoris = []
            tab.forEach(element => {
                this.userFavoris.push(element['aclSid'])
            })
        }, error => {
            this.toastr.error("", error.error.message, {
                closeButton: true,
                positionClass: 'toast-top-full-width',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        })
    }

    Return() {
        this.popupfavoris = false
        this.getMyFavory()
    }

    getPersonnefinale(e: any) {
        this.listPersonne = e;
    }

    async switchImprimanteChange(e) {
        if (e === true) {
            localStorage.setItem("hasImprimante", "true")
            let authorizationToken = null
            await this.fileservice.getToken(this.ModuleScan).then(
                (res: any) => {
                    if (res && res.authorizationToken)
                        authorizationToken = res.authorizationToken
                }, (error) => {
                    console.error(error)
                }
            )

            this.fileservice.VerifPcTk(authorizationToken).subscribe(data => {
                this.listScript = data['result']
            })
        } else {
            localStorage.setItem("hasImprimante", "false")
        }
        this.imprimante = e
    }

    scriptChange(e) {
        this.cookieService.set('portImprimante', e.value);
    }

    showpupupconfigpstk() {
        this.popupSetingPSTK = true;
    }

    /*Config PSTK component*/

    submitEvent(e) {
        this.submmited = e;
    }

    pstkInfoEvent(e) {
        this.pstkInfo = e;
    }

    closepopupSetingPSTK(e) {
        this.popupSetingPSTK = e;
    }

    pstkEnabled() {
        if (this.configPstkComponent != undefined) {
            return this.configPstkComponent.pstkEnabled();
        } else {
            return this.pstkEnable;
        }

    }

    PstkRunning() {
        if (this.configPstkComponent != undefined) {
            return this.configPstkComponent.PstkRunning();
        } else {
            return this.PstkisRunning;
        }
    }

    saveconfig() {
        let Config = this.configjson;
        this.cookieService.set('scannerName', Config.scannerName);
        this.cookieService.set('scannerProfil', Config.scannerProfil.name);
        this.translateService.get("ATTACHEMENT.ConfigScanMiseAjour").subscribe((res) => {
            this.toastr.success(res, "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        })
    }

    changeScannerName(e) {
        this.cookieService.set('scannerName', e);
        this.saveconfig()
    }

    TelechargerTollkit() {
        this.popupInstallToolkitVisible = false;
        window.location.href = this.env.cloudMsiPSTK;
    }

    changeScannerProfile(e) {
        this.cookieService.set('scannerProfil', JSON.stringify(e));
        this.saveconfig()
    }

    fileChange(event: any) {
        if (event.target.files && event.target.files[0]) {
            this.url = URL.createObjectURL(event.target.files[0]);
            this.photo = event.target.files[0];
            this.showclearicon = true;
            this.showValidicon = true;
            this.imagePreview()
        }
    }

    imagePreview() {
        (<HTMLImageElement>document.getElementById('previewImageEmployecartevisite')).src = this.url;
    }

    clearimage() {
        (<HTMLImageElement>document.getElementById('previewImageEmployecartevisite')).src = "./assets/img/users/default-user.jpg";
        this.photo = null;
        this.showclearicon = false;
        this.showValidicon = false;
        this.deleteImage();
    }

    deleteImage() {
        this.loginService.deletePhoto().subscribe(data => {
            this.translateService.get("deleteWithSuccess").subscribe(
                res => {
                    this.toastr.success(res, "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                }
            )
        }, error2 => {
            this.toastr.error(error2.error.message, "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        })
    }

    uploadImage() {
        this.loginService.uploadPhoto(this.photo).subscribe(data => {
            this.showValidicon = false;
            this.showclearicon = false;
            this.translateService.get("postWithSuccess").subscribe(
                res => {
                    this.toastr.success(res, "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                }
            )
        }, error2 => {
            this.toastr.error(error2.error.message, "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        })
    }

    refresh() {
        window.location.reload();
    }

    minToSecond(min) {
        return min * 60 * 1000;
    }

    secondToMin(second) {
        return (Math.floor(second / 60)) / 1000;
    }
}

export class favoris {
    aclSid: any;
}
