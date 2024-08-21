import {Component, OnInit} from '@angular/core';
import {EnvService} from "../../../../env.service";
import {CookieService} from "ngx-cookie-service";
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {LoginService} from '../../../pages/Global/shared-service/login.service';

@Component({
    selector: 'app-profiles',
    templateUrl: './profiles.component.html',
    styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {

    profiles: any

    constructor(private env: EnvService, private cookieService: CookieService, private translateService: TranslateService, private loginService: LoginService, private fb: FormBuilder, private toastr: ToastrService) {


    }

    ngOnInit(): void {

        this.loginService.getMyProfiles().subscribe(data => {
            this.profiles = data;
        }, error => {
            this.toastr.error(error.error.message, "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        })
    }

    onchageProfile(sid, sam) {
        this.loginService.changeProfile(sid, sam).subscribe(data => {
            console.log("daata  ", data)
            this.clearStorage()
            this.cookieService.set('Authorization', data, 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
            localStorage.setItem("token", data)
            this.loginService.profile_user().subscribe((dataprofile: any) => {

                    this.cookieService.set('displayname', dataprofile['mydata']['displayname'], 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    this.cookieService.set('matricule', dataprofile['mydata']['matricule'], 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    this.cookieService.set('sammacountname', sam, 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    this.cookieService.set('photoContentType', dataprofile['mydata']['photoContentType'], 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    this.cookieService.set('thumbnailphoto', dataprofile['mydata']['thumbnailphoto'], 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    this.cookieService.set('modules', JSON.stringify(dataprofile['modules']), 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))

                    console.log('JSON.stringify(dataprofile[\'modules\']    ', dataprofile['modules']);
                    let profile
                    let roles
                    let modules = dataprofile['modules']
                    modules.filter(item => {
                        console.log('item     ', item);
                        if (item['module']['name'] === require('package.json').name) {
                            profile = item['profile']
                            roles = item['roles']
                        }
                    })

                    this.cookieService.set('profil', profile, 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    this.cookieService.set('roles', roles, 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))


                    this.cookieService.set('departement', JSON.stringify(dataprofile['departement']), 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    if (dataprofile['managerOf']['entites'].length != 0 || dataprofile['managerOf']['interim'].length != 0) {
                        this.cookieService.set('managerOf', "true", 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    } else {
                        this.cookieService.set('managerOf', "false", 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    }
                    this.cookieService.set('groups', dataprofile['groups'], 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    this.cookieService.set('sid', dataprofile['sid'], 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    this.cookieService.set('destNotif', dataprofile['destNotif'], 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
                    window.location.reload();
                    console.log('sammacountname  ', this.cookieService.get('sammacountname'))

                },
                error1 => {
                    this.toastr.error(error1.error.message, "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                })
        }, error => {
            this.toastr.error(error.error.message, "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        })
    }

    clearStorage() {
        localStorage.clear();
        sessionStorage.clear()
        this.cookieService.deleteAll('/', window.location.hostname.substring(window.location.hostname.indexOf('.')));
    }
}
