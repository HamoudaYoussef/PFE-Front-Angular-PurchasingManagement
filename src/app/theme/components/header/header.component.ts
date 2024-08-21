import {Component, OnInit, ViewEncapsulation, HostListener, Injector, ViewChild, ChangeDetectorRef, NgZone} from '@angular/core';
import { trigger,  state,  style, transition, animate } from '@angular/animations';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import {CookieService} from 'ngx-cookie-service';
import {EnvService} from '../../../../env.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Route, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {LoginService} from '../../../pages/Global/shared-service/login.service';
import {ConfigPstkComponent} from "../../../pages/Global/config-pstk/config-pstk.component";
import { WebSocketService } from 'src/app/Service/web-socket.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [MenuService],
    animations: [
        trigger('showInfo', [
            state('1', style({transform: 'rotate(180deg)'})),
            state('0', style({transform: 'rotate(0deg)'})),
            transition('1 => 0', animate('400ms')),
            transition('0 => 1', animate('400ms'))
        ])
    ]
})
export class HeaderComponent implements OnInit {
    DataLogo: any = JSON.parse(localStorage.getItem("DataLogo"));
    public showHorizontalMenu: boolean = true;
    public showInfoContent: boolean = false;
    public showSideChat: boolean = false;
    public settings: Settings;
    public menuItems: Array<any>;
    matricule: string = ""
    username1: string = ""

    /*Config PSTK component*/
    popupSetingPSTK = false
    submmited = false
    pstkInfo
    pstkEnable
    PstkisRunning
    @ViewChild(ConfigPstkComponent) private configPstkComponent: ConfigPstkComponent;

    /*Config PSTK component*/

    versionFront = require('../../../../../package.json').version


    // require('../../package.json').version
    constructor(private toastr: ToastrService,
                private fb: FormBuilder,
                private translateService: TranslateService,
                public appSettings: AppSettings,
                public menuService: MenuService,
                public loginService: LoginService,
                public router: Router,
                public env: EnvService,
                private injector: Injector,
                private cookieService: CookieService,
                private webSocketService: WebSocketService, private http: HttpClient,private cdr: ChangeDetectorRef,
                private ngZone: NgZone
                ) {

        this.settings = this.appSettings.settings;

        window.addEventListener('load', (event) => {
            this.VerifToken();
        });


        this.menuItems = this.menuService.getHorizontalMenuItems();
        if (localStorage.getItem('displayname') === null) {
            this.username1 = ""
        } else {
            this.username1 = localStorage.getItem('displayname')
        }

        if (localStorage.getItem('matricule') === null) {
            this.matricule = ""
        } else {
            this.matricule = localStorage.getItem('matricule')
        }
    }

    showMenu = false
username:any;
    ngOnInit() {
        this.username=this.cookieService.get('profil');
        if (window.location.href.indexOf("newwindow=false") != -1)
            this.showMenu = false
        else
            this.showMenu = true
        // this.settings.theme.showMenu=this.showMenu
        // console.log(this.settings.theme.showMenu,"show menu ************************** ",this.showMenu)
        if (window.innerWidth <= 768)
            this.showHorizontalMenu = false;


        // get all notifications
        this.http.get<any[]>('http://localhost:8888/achat/api/notifications/notifications').subscribe((notifications) => {
            // filter notifications by username
            notifications = notifications.filter(notification => notification.username.trim() == this.username.trim());
            // reverse the list
            notifications = notifications.reverse();
            console.log("notifffffffffffffffffffffff"+notifications.length)
            this.notifications = notifications;
            this.cdr.detectChanges();
        });


        this.webSocketService.notifications$.subscribe((notification) => {
            this.ngZone.run(() => {
               // console.log("usernameeeeeeeeee"+notification[0].username)
                if(this.cookieService.get('profil').trim()==notification[0].username) {
                    console.log('New notification received:', notification);
                    if (Array.isArray(notification) && notification.length > 0) {
                        const newNotification = notification[0];
                        this.notifications.unshift(newNotification);
                        this.unreadNotificationCount++;
                        this.cdr.detectChanges();
                    }
                }
            });
        });


        // count notification
        this.fetchUnreadNotificationCount();
    }

    showpupupconfigpstk() {
        this.popupSetingPSTK = true
    }

    submitEvent(e) {
        this.submmited = e
    }

    pstkInfoEvent(e) {
        this.pstkInfo = e
    }

    closepopupSetingPSTK(e) {
        this.popupSetingPSTK = e
    }

    pstkEnabled() {
        if (this.configPstkComponent != undefined)
            return this.configPstkComponent.pstkEnabled()
        else return this.pstkEnable

    }

    PstkRunning() {
        if (this.configPstkComponent != undefined)
            return this.configPstkComponent.PstkRunning()
        else return this.PstkisRunning
    }



    get smalllogo() {
        return this.DataLogo.smalllogo;
    }

    get smalllogoContentType() {
        return this.DataLogo.smalllogoContentType;
    }

    public closeSubMenus() {
        let menu = document.querySelector("#menu0");
        if (menu) {
            for (let i = 0; i < menu.children.length; i++) {
                let child = menu.children[i].children[1];
                if (child) {
                    if (child.classList.contains('show')) {
                        child.classList.remove('show');
                        menu.children[i].children[0].classList.add('collapsed');
                    }
                }
            }
        }
    }

    logout() {
        // window.open(this.env.UrlKernelProd, "_self", "location=no,menubar=0,status=0,scrollbars=0,width=100,height=100")
        localStorage.clear();
        sessionStorage.clear()
        this.cookieService.deleteAll('/', window.location.hostname.substring(window.location.hostname.indexOf('.')));
        window.open(this.env.apiUrlfrontkernel, "_self")
    }

    retourne() {
        var URL = [this.env.apiUrlfrontkernel + "#/Accueil"].join('?');
        "url=" + location.href;
        localStorage.removeItem("usermenu")
        window.open(URL, "_self", "location=no,menubar=0,status=0,scrollbars=0,width=100,height=100")
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        if (window.innerWidth <= 768) {
            this.showHorizontalMenu = false;
        } else {
            this.showHorizontalMenu = true;
        }
    }

    /*UTILE POUR AFFECTATION DES ROUTES*/
    appName = require('../../../../../package.json').name/*APP NAME FROM package.json*/
    synchrouteVisibe: boolean = false;/*popup affectation visible*/
    profile = this.cookieService.get("profil");
    roles = this.cookieService.get("roles");
    urls: string[] = [];/*list du nouveux routes*/
    synchronisation() {
        this.synchrouteVisibe = true
        this.syncroute()
    }

    closeEvent(statepopup) {
        this.synchrouteVisibe = statepopup
    }

    /*get new path and old before load compment */
    ngAfterViewInit() {

        this.configPstkComponent.ngOnInit()

        this.pstkEnable = this.configPstkComponent.pstkEnabled()
        this.PstkisRunning = this.configPstkComponent.PstkRunning()
        this.router.config.forEach(i => {
            this.getPaths(i);
        })
    }

    /*get new path courant*/
    getPaths(route: Route, parent: string = '') {
        if (route.redirectTo) {
            return;
        }
        if (route.children) {
            route.children.forEach(i => {
                this.getPaths(i, parent + route.path);
            });
        } else if (route.loadChildren) {
            (<any>this.router).configLoader.loadChildren(this.injector, route)
                .toPromise()
                .then(i => {
                    i.routes.forEach(j => {
                        this.getPaths(j, parent + route.path)
                    });
                });
        } else if (route.path != null) {
            let fullPath: string;
            if (route.path != null) {
                if (parent) {
                    fullPath = `/${parent}/${route.path}`;
                } else {
                    fullPath = `/${route.path}`
                }
            }
            this.urls.push(fullPath)
        }
    }

    /*pour synchroniser les nouveau routes*/
    syncroute() {
        const promise1 = Promise.resolve(this.urls);
        promise1.then((value) => {
            this.urls = value
        });
        return this.urls
    }

    /**********************************************/

    // change() {
    //     if(this.settings.theme.showSideChat===true){
    //         this.settings.theme.showSideChat=false;
    //     }else{
    //         this.settings.theme.showSideChat=true;
    //     }
    //
    // }
    VerifToken() {
        this.loginService.VerifToken().subscribe(data => {

        }, error => {
            console.log("error", error
            )
            if (error.error.status === 401 || error.error.status == 403) {
                localStorage.clear();
                this.cookieService.deleteAll('/', window.location.hostname.substring(window.location.hostname.indexOf('.')));
                // this.router.navigate(['/login'])
                this.router.navigate(['/login'])
            }

        })
    }

    notifications: any[] = [];
    unreadNotificationCount: number = 0;
    fetchUnreadNotificationCount() {
        this.username = this.cookieService.get('profil');
        this.http.get<number>(`http://localhost:8888/achat/notifications/unread-count/${this.username}`)
            .subscribe((count) => {
                this.unreadNotificationCount = count;
            });
    }

    markNotificationsAsRead() {
        this.username = this.cookieService.get('profil');
        this.http.put(`http://localhost:8888/achat/api/notifications/mark-as-seen/${this.username}`, {})
            .subscribe(() => {
                this.unreadNotificationCount = 0;
            });
    }


    navigateTo(url: string, demandeId: number) {
        this.router.navigate([url]).then(() => {
            window.location.reload();
        });
        console.log(`Navigating to ${url} with demandeAchat ID: ${demandeId}`);

    }
}