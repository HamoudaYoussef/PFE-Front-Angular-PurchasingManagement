import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {EnvService} from '../../../../env.service';
import {CookieService} from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';
import {AttachementModuleService} from '../attachment/attachement.module.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CommunFuncService} from '../attachment/Commun/commun-func.service';

@Component({
  selector: 'app-header-components',
  templateUrl: './header-components.component.html',
  styleUrls: ['./header-components.component.scss']
})
export class HeaderComponentsComponent implements OnInit {


  configjson = this.formcontrol.group({
    scannerName: [null, Validators.required],
    scannerProfil:['', Validators.required],
  })
  popupConfigScanVisible: any = false;
  scan_preferences: any = [];
  loadingVisible: any = false;
  ListeScanner: any = [];
  pstkEnabledAndRunning = false;/*state of pstk capted in application and display avtetissment of pstk in the pdf viewer*/
  authorizationTokenScan = null;
  RefUserName;
  /*Module PSTK*/
  ModuleScan = require('../attachment/ModulePSTK.json').Module_Scan;

  scanner;
  avertissementPstk = false;
  profile = this.cookieService.get('profil');

  ngOnInit() {
  }

  constructor( public communService: CommunFuncService,private formcontrol: FormBuilder,public router: Router, private toastr: ToastrService, private env: EnvService, private cookieService: CookieService, private translateService: TranslateService, private fileservice: AttachementModuleService) {
    if (this.cookieService.get('displayname')){
      this.RefUserName = {displayName: this.cookieService.get('displayname')};
    } else {
      this.RefUserName = {displayName: 'utilisateur'};
    }

  }

  redirectProfil() {
    this.router.navigate(['/Profile/user']);
  }

  saveconfig() {
    let Config = this.configjson.value;


    this.cookieService.set('scannerName', String(Config.scannerName));
    this.cookieService.set('scannerProfil', Config.scannerProfil['name']);


    this.translateService.get("ATTACHEMENT.ConfigScanMiseAjour").subscribe((res) => {


      //this.clear() ;
      this.toastr.success(res, "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      })
    })

    this.popupConfigScanVisible = false;
    // this.scannButtonDisabled = false

  }


  async configscan() {
    this.popupConfigScanVisible = true;

    this.loadingVisible = true;
    /*LISTE PROFIL */
    this.fileservice.getscan_preferences().subscribe((data: any) => {
          this.scan_preferences = data;
      let Config = this.configjson.value;

      if ((this.cookieService.get('scannerName')) != 'null' && (this.cookieService.get('scannerName')) != ' ' && (this.cookieService.get('scannerName')) != '' && (this.cookieService.get('scannerName')) != 'undefined' &&
              (this.cookieService.get('scannerProfil')) != 'undefined' && (this.cookieService.get('scannerProfil')) != '' && (this.cookieService.get('scannerProfil') != ' ' && (this.cookieService.get('scannerProfil') != 'null'))) {
            this.scanner = this.cookieService.get('scannerName')
            let jsonscanpreference = (this.cookieService.get('scannerProfil'));
            let selectedprofile = data.find(({name}) => name === jsonscanpreference)

      this.configjson.get('scannerName').setValue(this.scanner);
      this.configjson.get('scannerProfil').setValue(selectedprofile);

          }
          this.loadingVisible = false;

        }, error1 => {
          this.toastr.error(error1.error.message, "", {
            closeButton: true,
            positionClass: 'toast-top-right',
            extendedTimeOut: this.env.extendedTimeOutToastr,
            progressBar: true,
            disableTimeOut: false,
            timeOut: this.env.timeOutToastr
          })
          this.loadingVisible = false;

        }
    )
    await this.ListScanner();
  }
  packageName = require('package.json').name;

  logout() {
    /*  localStorage.clear();*/
    localStorage.removeItem(this.packageName + '_' +'usermenu');
    localStorage.removeItem(this.packageName + '_' + 'AllMySid');

    sessionStorage.clear();
    /*This code seems to be written in JavaScript and is using a function called deleteAll from a service named cookieService. The function is deleting all the cookies stored in the browser for the current domain and its subdomains. The domain is obtained by using the hostname property of the window.location object and then using substring and indexOf methods to get the portion of the domain that starts after the first dot (.). The first argument to the function, "/", is the path of the cookie to delete.*/
    this.cookieService.deleteAll('/', window.location.hostname.substring(window.location.hostname.indexOf('.')));
    window.open(this.env.apiUrlfrontkernel, '_self');
  }



  async ListScanner() {
    this.pstkEnabledAndRunning = this.cookieService.get('envPstkRunning') === 'true';
    if (!this.pstkEnabledAndRunning) {
      this.avertissementPstk = true;
      // this.translateService.get('ATTACHEMENT.PstkNotEncours').subscribe((res) => {
      //   this.toastr.warning(res, '', {
      //     closeButton: true,
      //     positionClass: 'toast-top-right',
      //     extendedTimeOut: this.env.extendedTimeOutToastr,
      //     progressBar: true,
      //     disableTimeOut: false,
      //     timeOut: this.env.timeOutToastr
      //   });
      // });
    }
    if (this.pstkEnabledAndRunning) {
      this.authorizationTokenScan= await this.communService.authorizationToken(this.ModuleScan)


      this.fileservice.GetListScanner(this.authorizationTokenScan, 'GetListScanner').subscribe((res: any) => {
            if (res.result != null && res.result != undefined || res.result != []) {
              for (let i = 0; i < res.result.length; i++) {
                this.ListeScanner[i] = res.result[i];
              }
            }
            this.loadingVisible = false;
          }, err => {
            this.loadingVisible = false;
            this.avertissementPstk = true;
          }
      );
    }
  }

  // TelechargerTollkit() {
  //   this.popupInstallToolkitVisible = false;
  //   window.location.href = this.env.cloudMsiPSTK;
  // }

  absence() {
    this.router.navigate(['/absence']);
  }

  // logout(){
// this.loginService.logout().subscribe(logout=>{
//   this.router.navigate(['/login'])
// })
// }
}
