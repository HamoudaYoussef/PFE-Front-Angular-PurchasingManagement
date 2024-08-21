import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {DxDataGridComponent} from "devextreme-angular";
import {EnvService} from "../../../../../../env.service";
import {TokenStorageService} from '../../../shared-service/token-storage.service';
import {FormatDate} from '../../../shared-service/formatDate';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-event-history',
    templateUrl: './event-history.component.html',
    styleUrls: ['./event-history.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EventHistoryComponent implements OnInit, OnChanges {

    @Input() document

    @Input() historics: any;
    @Input() Event: any;
    allowedPageSizes = this.env.allowedPageSizes;
    historicEvent;
    pageSize = this.env.pageSize;
    @ViewChild('grid', {static: false}) gridContainerjournal: DxDataGridComponent;
    public count: number = 0;
    public nbPage = 0;
    public numPage = 1;
    public formatDate = new FormatDate(this.env);
    public stateStoring = this.env.stateStoring;
    states: any[] = [];

    constructor( private env: EnvService, private router: Router, private http: HttpClient, private toastr: ToastrService, private tokenStorage: TokenStorageService, private translateService: TranslateService) {
        //console.log("historicEvent", this.historicEvent)
        let size = this.pageSize;
        //console.log("historicTasks", this.historicEvent)
        // this.historicEvent = new CustomStore({
        //
        //         load: function (loadOptions: any) {
        //             loadOptions.requireTotalCount = false
        //             var params = "";
        //             if (loadOptions.take == undefined) loadOptions.take = size;
        //             if (loadOptions.skip == undefined) loadOptions.skip = 0;
        //
        //             //size
        //             params += 'size=' + loadOptions.take || size;
        //             //page
        //             params += '&page=' + loadOptions.skip / size || 0;
        //
        //             //sort
        //             if (loadOptions.sort) {
        //                 if (loadOptions.sort[0].desc)
        //                     params += '&sort=' + loadOptions.sort[0].selector + ',desc';
        //                 else
        //                     params += '&sort=' + loadOptions.sort[0].selector + ',asc';
        //             }
        //
        //             let tab: any[] = [];
        //             if (loadOptions.filter) {
        //                 if (loadOptions.filter[1] == 'and') {
        //                     for (var i = 0; i < loadOptions.filter.length; i++) {
        //                         if (loadOptions.filter[i][1] == 'and') {
        //                             for (var j = 0; j < loadOptions.filter[i].length; j++) {
        //                                 if (loadOptions.filter[i][j] != 'and') {
        //                                     if (loadOptions.filter[i][j][1] == 'and') {
        //                                         tab.push(loadOptions.filter[i][j][0]);
        //                                         tab.push(loadOptions.filter[i][j][2]);
        //                                     } else
        //                                         tab.push(loadOptions.filter[i][j]);
        //                                 }
        //                             }
        //                         } else tab.push(loadOptions.filter[i]);
        //                     }
        //                 } else
        //                     tab.push([loadOptions.filter[0], loadOptions.filter[1], loadOptions.filter[2]]);
        //             }
        //
        //             let q: any[] = [];
        //             let reqRechercherAnd: any[] = [];
        //             for (let i = 0; i < tab.length; i++) {
        //                 switch (tab[i][1]) {
        //                     case ('notcontains'): {
        //                         q.push(tab[i][0] + ".doesNotContain=" + tab[i][2]);
        //                         break;
        //                     }
        //                     case  'contains': {
        //                         q.push(tab[i][0] + ".contains=" + tab[i][2]);
        //                         break;
        //                     }
        //                     case '<>' : {
        //                         if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated" || tab[i][0] == "dateTimeFrom" || tab[i][0] == "dateTimeUntil") {
        //                             let isoDate = new Date(tab[i][2]).toISOString();
        //                             q.push(tab[i][0] + ".notEquals=" + isoDate);
        //                             break;
        //                         } else {
        //                             q.push(tab[i][0] + ".notEquals=" + tab[i][2]);
        //                             break;
        //                         }
        //                     }
        //                     case  '=': {
        //                         if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated" || tab[i][0] == "dateTimeFrom" || tab[i][0] == "dateTimeUntil") {
        //                             let isoDate = new Date(tab[i][2]).toISOString();
        //                             q.push(tab[i][0] + ".equals=" + isoDate);
        //                             break;
        //                         } else {
        //                             q.push(tab[i][0] + ".equals=" + tab[i][2]);
        //                             break;
        //                         }
        //                     }
        //                     case 'endswith': {
        //                         // q.push("(" + tab[i][0] + ":*" + tab[i][2] + ")");
        //                         break;
        //                     }
        //                     case  'startswith': {
        //                         //  q.push("(" + tab[i][0] + ":" + tab[i][2] + "*" + ")");
        //                         break;
        //                     }
        //                     case  '>=': {
        //                         if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated" || tab[i][0] == "dateTimeFrom" || tab[i][0] == "dateTimeUntil") {
        //                             let isoDate = new Date(tab[i][2]).toISOString();
        //                             q.push(tab[i][0] + '.greaterThanOrEqual=' + isoDate);
        //                             break;
        //                         } else {
        //                             q.push(tab[i][0] + '.greaterThanOrEqual=' + tab[i][2]);
        //                             break;
        //                         }
        //                     }
        //                     case  '>': {
        //                         if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated" || tab[i][0] == "dateTimeFrom" || tab[i][0] == "dateTimeUntil") {
        //                             let isoDate = new Date(tab[i][2]).toISOString();
        //                             q.push(tab[i][0] + '.greaterThan=' + isoDate);
        //                             break;
        //                         } else {
        //                             q.push(tab[i][0] + '.greaterThan=' + tab[i][2]);
        //                             break;
        //                         }
        //                     }
        //                     case  '<=': {
        //                         if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated" || tab[i][0] == "dateTimeFrom" || tab[i][0] == "dateTimeUntil") {
        //                             let isoDate = new Date(tab[i][2]).toISOString();
        //                             q.push(tab[i][0] + '.lessThanOrEqual=' + isoDate);
        //                             break;
        //                         } else {
        //                             q.push(tab[i][0] + '.lessThanOrEqual=' + tab[i][2]);
        //                             break;
        //                         }
        //                     }
        //                     case  '<': {
        //                         if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated" || tab[i][0] == "dateTimeFrom" || tab[i][0] == "dateTimeUntil") {
        //                             let isoDate = new Date(tab[i][2]).toISOString();
        //                             q.push(tab[i][0] + '.lessThan=' + isoDate);
        //                             break;
        //                         } else {
        //                             q.push(tab[i][0] + '.lessThan=' + tab[i][2]);
        //                             break;
        //                         }
        //                     }
        //                     case "or" : {
        //                         q.push(tab[i][0][0] + '.notEquals=' + tab[i][0][2])
        //                         break;
        //                     }
        //                 }
        //             }
        //
        //             let f: string = "";
        //             if (q.length != 0) f += q[0];
        //             for (let i = 1; i < q.length; i++) {
        //                 f += "&" + q[i];
        //             }
        //             if (f.length != 0) params += "&" + f
        //
        //             var paramsCount = ""
        //             var tabCount = []
        //             tabCount = params.split('&')
        //             if (tabCount.length > 2) paramsCount += "?"
        //             for (let i = 3; i < tabCount.length; i++) {
        //                 paramsCount += tabCount[i]
        //                 paramsCount += "&"
        //             }
        //
        //             http.get(this.env.BackUrl + 'events-OM/count' + paramsCount.substring(0, paramsCount.length - 1), {headers: new HttpHeaders().set("Authorization", tokenStorage.getToken())}).subscribe(data => {
        //                 this.count = (<number>data)
        //                 this.numPage = (loadOptions.skip / loadOptions.take) + 1
        //                 this.nbPage = Math.floor(this.count / this.env.pageSize)
        //                 if ((this.count % this.env.pageSize) != 0) {
        //                     this.nbPage++
        //                 }
        //             }),
        //                 error => {
        //                     if (error.status == 0) {
        //                         this.translateService.get("messageErrorWs").subscribe((res) => {
        //                             notify("\n" + res, "error", 3600);
        //                         })
        //                     } else {
        //                         notify("\n" + error.message, "error", 3600);
        //                     }
        //                 }
        //             let params2 = params+"&objectId.equals=" + 3
        //             return http.get(this.env.BackUrl + 'events-OM?' + params2, {headers: new HttpHeaders().set("Authorization", tokenStorage.getToken())})
        //                 .toPromise()
        //                 .then((data: any[]) => {
        //
        //                         return {
        //                             data: data,
        //                             totalCount: this.count
        //                         }
        //                     },
        //                     error => {
        //                         notify("\n" + error.message, "error", 3600);
        //                     });
        //         }.bind(this)
        //     }
        // );
    }

    ngOnInit() {
        // this.getAllState(3)
        this.historicEvent =  this.historics;
        //console.log(" this.historicTasks", this.historicEvent)
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.historicEvent =  this.historics;
    }

    onToolbarPreparingGridWf(e) {
        var ref = this;

        // e.toolbarOptions.items.unshift({
        //     location: 'before',
        //     template: 'totalGroupCount6'
        // })

    }



}


