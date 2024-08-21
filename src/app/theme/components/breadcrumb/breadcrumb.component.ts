import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, UrlSegment, NavigationEnd } from "@angular/router"; 
import { Title } from '@angular/platform-browser';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import {TranslateService} from "@ngx-translate/core";
import {locale} from "devextreme/localization";

@Component({
    selector: 'app-breadcrumb',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
    public settings: Settings;
    public pageTitle:string;
    public breadcrumbs: {
        name: string;
        url: string
    }[] = [];

    constructor(public appSettings:AppSettings, 
                public router: Router, 
                public activatedRoute: ActivatedRoute,                
                public title:Title,
                private translateService: TranslateService) {
        
        this.settings = this.appSettings.settings;
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.breadcrumbs = [];                
                this.parseRoute(this.router.routerState.snapshot.root); 
                this.pageTitle = "";
                this.breadcrumbs.forEach(breadcrumb => {
                    this.pageTitle += ' > ' + breadcrumb.name;
                })       
                this.title.setTitle(this.settings.name + this.pageTitle);
            }
        })

    }

    parseRoute(node: ActivatedRouteSnapshot) { 
        if (node.data['breadcrumb']) {
            if(node.url.length){
                let urlSegments: UrlSegment[] = [];
                node.pathFromRoot.forEach(routerState => {
                    urlSegments = urlSegments.concat(routerState.url);
                });
                let url = urlSegments.map(urlSegment => {
                    return urlSegment.path;
                }).join('/');
                this.breadcrumbs.push({
                    name: node.data['breadcrumb'],
                    url: '/' + url
                }) 
            }         
        }
        if (node.firstChild) {
            this.parseRoute(node.firstChild);
        }
    }

     public closeSubMenus(){
        let menu = document.querySelector("#menu0"); 
        if(menu){
            for (let i = 0; i < menu.children.length; i++) {
                let child = menu.children[i].children[1];
                if(child){          
                    if(child.classList.contains('show')){            
                        child.classList.remove('show');
                        menu.children[i].children[0].classList.add('collapsed'); 
                    }             
                }
            }
        }
    }
}













// import { Component, ViewEncapsulation } from '@angular/core';

// import { AppState } from "../../../app.state";

// @Component({
//     selector: 'az-breadcrumb',
//     encapsulation: ViewEncapsulation.None,
//     styleUrls: ['./breadcrumb.component.scss'],
//     templateUrl: './breadcrumb.component.html'
// })

// export class BreadcrumbComponent {

//     public activePageTitle:string = '';

//     constructor(private _state:AppState){
//         this._state.subscribe('menu.activeLink', (activeLink) => {
//             if (activeLink) {
//                 this.activePageTitle = activeLink;
//             }
//         });
//     }

//     public ngOnInit():void {
//         if (!this.activePageTitle) {
//             this.activePageTitle = 'dashboard';
//         }
      
//     }

// }