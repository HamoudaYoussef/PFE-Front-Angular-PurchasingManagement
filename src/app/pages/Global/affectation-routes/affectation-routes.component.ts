import {
    Compiler,
    Component,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange
} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {EnvService} from "../../../../env.service";
import {GlobalSettingsService} from "./global-settings.service";

@Component({
    selector: 'app-affectation-routes',
    templateUrl: './affectation-routes.component.html',
    styleUrls: ['./affectation-routes.component.scss']
})
export class AffectationRoutesComponent implements OnInit, OnChanges {

    visibleTrueModal: boolean/*modal tjr visible*/
    @Input('visibleTrue') visibleTrue: boolean/*modal tjr visible*/
    @Input('appNameInput') appNameInput: any/*App Name */
    @Input('newRoutes') newRoutes: any/*App Name */
    appName: any
    @Output('visibleFalse') visibleFalse = new EventEmitter<any>();/*Output to close modal*/
    /*show/hide second modal of confirm*/
    popupConfirmationVisible: boolean = false;
    //dev extreme variable
    showFilterRow: boolean;
    applyFilterTypes
    currentFilter: any;
    readonly allowedPageSizes = [5, 10, 15];
    displayMode = 'full';
    showPageSizeSelector = false;
    showNavButtons = true;
    /*****************/
    /*NEW ROUTE A AFFECTER*/
    routesNew = {
        routes: null
    }
    routes: any;/*Old routes sauvgarder*/
    moduleUi/*current module UI FRONT*/
    /*data src*/
    arrayOldSrc
    newDataSrc;
    interDataSrc;

    constructor(private translateService: TranslateService, public env: EnvService, private toastr: ToastrService, private compiler: Compiler, private injector: Injector,
                private globalSettingsService: GlobalSettingsService, public router: Router) {
    }

    ngOnInit(): void {
        console.log("in affecation")
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (changes['visibleTrue'] && changes['visibleTrue'].previousValue != changes['visibleTrue'].currentValue) {
            //console.log(changes['visibleTrue'].currentValue, ' changes[\'visibleTrue\']')
            this.visibleTrueModal = changes['visibleTrue'].currentValue
        }
        if (changes['appNameInput'] && changes['appNameInput'].previousValue != changes['appNameInput'].currentValue) {
            this.appName = changes['appNameInput'].currentValue
        }
        if (changes['newRoutes'] && changes['newRoutes'].previousValue != changes['newRoutes'].currentValue) {
            this.routesNew.routes = changes['newRoutes'].currentValue
        }
        this.showFilterRow = true;
        this.applyFilterTypes = [{
            key: 'auto',
            name: 'Immediately',
        }, {
            key: 'onClick',
            name: 'On Button Click',
        }];

        this.currentFilter = this.applyFilterTypes[0].key;

        this.globalSettingsService.getModuleUiByAppName(this.appName).subscribe((data1) => {
            if (data1.length != 0) {
                this.moduleUi = data1[0]
                if (this.moduleUi != null && this.moduleUi != '' && this.moduleUi != undefined)
                    this.routes = JSON.parse(data1[0].routes).routes
                //console.log("this.routes ", this.routes)
                //console.log("this.routesNew.routes", this.routesNew.routes)


                let x = []
                var z
                let y
                y = this.oldArray(this.routes, this.routesNew.routes)
                y.forEach(function (item, index) {
                    z = {}
                    z["id"] = index;
                    z["old"] = item;
                    x.push(z)
                });
                this.arrayOldSrc = x
                x = []


                y = this.newArray(this.routes, this.routesNew.routes)
                y.forEach(function (item, index) {
                    //console.log(item, index)
                    z = {}
                    z["id"] = index;
                    z["new"] = item;
                    x.push(z)
                });
                this.newDataSrc = x
                x = []


                y = this.intersectionArray(this.routes, this.routesNew.routes)
                y.forEach(function (item, index) {
                    z = {}
                    z["id"] = index;
                    z["inter"] = item;
                    x.push(z)
                });
                this.interDataSrc = x
            }
        });
        // //console.log("OLD ==>", this.arrayOldSrc)
        // //console.log("Intersection ==>", this.interDataSrc, this.interDataSrc.length)
        // //console.log("NEW ==>", this.newDataSrc, this.newDataSrc.length)
    }


    /*close first modal*/
    annuler() {
        this.popupConfirmationVisible = false;
        this.visibleTrueModal = false;
        this.visibleFalse.emit(this.visibleTrueModal);
        this.routes = null
        this.routesNew.routes = null
        this.arrayOldSrc = null
        this.newDataSrc = null
        this.interDataSrc = null
    }

    /*close second modal*/
    annulerSecondmodal() {
        this.visibleTrueModal = false;
        this.visibleFalse.emit(this.visibleTrueModal);
        this.routes = null
        this.routesNew.routes = null
        this.arrayOldSrc = null
        this.newDataSrc = null
        this.interDataSrc = null
    }

    /*Open second modal*/
    synchronisationProces() {
        this.popupConfirmationVisible = true
    }

    /*Calculer new route && old route && commun*/
    oldArray(array1, array2) {
        return array1.filter(x => array2.indexOf(x) === -1)
    }

    newArray(array1, array2) {
        return array2.filter(x => array1.indexOf(x) === -1)
    }

    intersectionArray(array1, array2) {
        return array1.filter(Set.prototype.has, new Set(array2))
    }

    /******************************************/

    /*execute web service of update modal routes*/
    ConfirmSync() {
        this.moduleUi.routes = JSON.stringify(this.routesNew)
        // //console.log(JSON.stringify(this.routesNew))
        // //console.log(" this.moduleUi", this.moduleUi)
        this.globalSettingsService.updateModuleUi(this.moduleUi.id, this.moduleUi).subscribe(
            data => {
                this.translateService.get("affectatioSucc").subscribe(
                    res => {
                        this.toastr.success(res, "", {
                            closeButton: true,
                            positionClass: 'toast-top-right',
                            extendedTimeOut: this.env.extendedTimeOutToastr,
                            progressBar: true,
                            disableTimeOut: false,
                            timeOut: this.env.timeOutToastr
                        })
                        this.popupConfirmationVisible = false
                        this.visibleTrueModal = false;
                        this.visibleFalse.emit(this.visibleTrueModal);
                        this.routes = null;
                        this.routesNew.routes = null
                        this.arrayOldSrc = null
                        this.newDataSrc = null
                        this.interDataSrc = null

                    }
                )
            }, error => {
                this.toastr.error(error.error.message, "", {
                    closeButton: true,
                    positionClass: 'toast-top-right',
                    extendedTimeOut: this.env.extendedTimeOutToastr,
                    progressBar: true,
                    disableTimeOut: false,
                    timeOut: this.env.timeOutToastr
                })
                this.popupConfirmationVisible = false
                this.routes = null;
                this.routesNew.routes = null
                this.arrayOldSrc = null
                this.newDataSrc = null
                this.interDataSrc = null
            }
        )
    }


}
