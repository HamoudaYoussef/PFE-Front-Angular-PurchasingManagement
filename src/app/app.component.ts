import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppSettings} from './app.settings';
import {Settings} from './app.settings.model';
import {EnvService} from '../env.service';
import {Router} from '@angular/router';
import {LoginService} from './pages/Global/shared-service/login.service';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';
import {DOCUMENT} from '@angular/common';
import {environment} from '../environments/environment.prod';
import {LocalizationService} from "./pages/Global/shared-service/localization.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    public settings: Settings;
    appName = require('../../package.json').name

    showmessage:any=false;
    show: any=false;
    constructor(@Inject(DOCUMENT) private document: Document ,private env:EnvService,public appSettings: AppSettings, public router: Router,
                public translate: TranslateService,private Toster:ToastrService,private cookieService: CookieService,private loginService:LoginService,
                private localizationService: LocalizationService) {
        this.settings = this.appSettings.settings;
        translate.addLangs(['en','de','fr','ru','tr']);
        // translate.setDefaultLang('en');
        // translate.use('en');
        localizationService.setInitialLanguage();
        //************************** Recuperation Cookies ***************************
        let usermenu = JSON.parse(localStorage.getItem('usermenu'))
        if((usermenu===null) ||  (usermenu===undefined)){
            this.loginService.getmenubyapp(this.cookieService.get('profil'), this.appName).subscribe((data: any) => {


                localStorage.setItem('usermenu', JSON.stringify(data))


                if (data != "null" && data != undefined) {
                    console.log("username", usermenu)
                    this.show=true;
                    this.loginService.getapplication().subscribe((data: any) => {
                      localStorage.setItem('applications', JSON.stringify(data))
                    })

                    }
            },error => {
                if (error.error.message.includes("Access Denied")) {
                    const ValueUrlmail = window.location.href.substring(window.location.href.indexOf('#/') + 1)
                    var params =
                        {
                            "redirectTo": decodeURI(ValueUrlmail),

                        };
                    let URL =[this.env.apiUrlfrontkernel+'#/login', $.param(params)].join('?')
                    window.open(URL, "_self", "location=no,menubar=0,status=0,scrollbars=0,width=100,height=100")
                    localStorage.clear();

                }
                this.showmessage=true;


            })
        }else {
            if (usermenu.find(x =>
                x.order === 0) != undefined) {
                this.router.navigate([usermenu.find(x =>
                    x.order === 1)['link']])
            }
            this.show = true;
        }
        // console.log(
        //     `\n%cBuild Info:\n\n` +
        //     `%c ❯ Environment: %c${environment.production ? "production 🏭" : "development 🚧"}\n` +
        //     `%c ❯ Build Version: ${buildInfo.version}\n` +
        //     ` ❯ Build Timestamp: ${buildInfo.timestamp}\n` +
        //     ` ❯ Build Message: %c${buildInfo.message || "<no message>"}\n`,
        //     "font-size: 14px; color: #7c7c7b;",
        //     "font-size: 12px; color: #7c7c7b",
        //     environment.production ? "font-size: 12px; color: #95c230;" : "font-size: 12px; color: #e26565;",
        //     "font-size: 12px; color: #7c7c7b",
        //     "font-size: 12px; color: #bdc6cf",
        // );
    }
    ngOnit(){
        console.log('Application environment is set to:', environment.buildTimestamp);
        console.log('Last release timestamp is set to:', environment.buildTimestamp);
    }

    retouner() {
        var URL = [this.env.apiUrlkernel+"#/Accueil"].join('?');
        "url=" + location.href;
        localStorage.removeItem("usermenu")
        window.open(URL, "_self", "location=no,menubar=0,status=0,scrollbars=0,width=100,height=100")
    }
}
