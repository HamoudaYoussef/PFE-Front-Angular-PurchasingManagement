import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {LoginService} from "../../../pages/Global/shared-service/login.service";
import {Router} from "@angular/router";
import {EnvService} from "../../../../env.service";
import {CookieService} from "ngx-cookie-service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent implements OnInit {

  displayname
  profile
  appName = require('package.json').name
  profiles: any

  constructor(private loginService: LoginService, public router: Router, private env: EnvService, private translateService: TranslateService, private cookieService: CookieService) {

  }

  ngOnInit() {
    this.profile = this.cookieService.get('profil')
    this.displayname = this.cookieService.get('displayname')

    var array = this.cookieService.get('profiles').split(",")
    this.profiles = array
    // array.forEach((e) => {
    //     if (e != this.cookieService.get('profil'))
    //         this.profiles.push(e);
    // });

    console.log(this.profiles, '         this.profiles')
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear()
    this.cookieService.deleteAll('/', window.location.hostname.substring(window.location.hostname.indexOf('.')));
    window.open(this.env.apiUrlkernel, "_self")
  }


  onchageProfileApp(profile) {
    if (profile !== this.profile) {
      this.loginService.getmenubyapp(profile, this.appName).subscribe((data: any) => {
        this.cookieService.set('profil', profile, 1, "/", window.location.hostname.substring(window.location.hostname.indexOf('.')))
        localStorage.setItem('usermenu', JSON.stringify(data))

        window.location.reload();
      }, error => {
        if (error.error.message.includes("Access Denied")) {
          const ValueUrlmail = window.location.href.substring(window.location.href.indexOf('#/') + 1)
          var params =
              {
                "redirectTo": decodeURI(ValueUrlmail),

              };
          let URL = [this.env.apiUrlfrontkernel + '#/login', $.param(params)].join('?')
          window.open(URL, "_self", "location=no,menubar=0,status=0,scrollbars=0,width=100,height=100")
          localStorage.clear();

        }
      })
    }
  }


}
