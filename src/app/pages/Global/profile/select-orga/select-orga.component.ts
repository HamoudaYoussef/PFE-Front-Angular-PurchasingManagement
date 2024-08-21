import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import CustomStore from "devextreme/data/custom_store";
import {DxDataGridComponent} from "devextreme-angular";
import {TranslateService} from "@ngx-translate/core";
import {LoginService} from "../../shared-service/login.service";
import {EnvService} from "../../../../../env.service";
import {favoris} from "../profile-user/profile-user.component";
import {TokenStorageService} from '../../shared-service/token-storage.service';

@Component({
    selector: 'app-select-orga',
    templateUrl: './select-orga.component.html',
    styleUrls: ['./select-orga.component.scss']
})
export class SelectOrgaComponent implements OnInit {

    @Input() selectbox: any = 'select';
    allOrgaData: any = [];
    userAffected: any = [];
    pageSize = this.env.pageSize
    allowedPageSizes = [10];
    public count: number = 0;

    @Output() personnes = new EventEmitter<any>();
    @Input() selectMode = "single";
    // errorMessageAffect :any =[];
    errorMessageDesaffect: any = '';
    @Input() selectdata: any
    @Input() mode
    userselect: any = [];
    userselectintr: any = []
    deselectItem: any;

    isReloaded: boolean = false
    selectedKeysSid: number[] = [];
    selectedKeysAffect: number[] = [];
    @ViewChild('gridSid', {static: false}) gridSid: DxDataGridComponent;
    @ViewChild('gridAff', {static: false}) gridAff: DxDataGridComponent;


    constructor(private translateService: TranslateService, private http: HttpClient, private env: EnvService, private loginService: LoginService, private tokenStorage: TokenStorageService, private toastr: ToastrService, private ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.getAllSid();
        this.userselect = []
        this.loginService.myFavoris().subscribe((data: []) => {
            let tab = []
            tab = data
            tab.forEach(element => {
                this.userselect.push(element['aclSid'])
            })
        })
    }

    getAllSid() {
        let size = this.pageSize;
        this.allOrgaData = new CustomStore({
            load: async function (loadOptions: any) {
                loadOptions.requireTotalCount = true
                var params = "";
                if (loadOptions.take == undefined) loadOptions.take = size;
                if (loadOptions.skip == undefined) loadOptions.skip = 0;

                //size
                //params += 'size=' + loadOptions.take || size;
                params += 'size=0';
                //page
                params += '&page=' + loadOptions.skip / size || 0;

                //sort
                if (loadOptions.sort) {
                    if (loadOptions.sort[0].desc)
                        params += '&sort=' + loadOptions.sort[0].selector + ',desc';
                    else
                        params += '&sort=' + loadOptions.sort[0].selector + ',asc';
                }
                if (loadOptions.searchValue) {
                    params += '&' + loadOptions.searchExpr + '.contains=' + loadOptions.searchValue;
                }
                let tab: any[] = [];
                if (loadOptions.filter) {
                    if (loadOptions.filter[1] == 'and') {
                        for (var i = 0; i < loadOptions.filter.length; i++) {
                            if (loadOptions.filter[i][1] == 'and') {
                                for (var j = 0; j < loadOptions.filter[i].length; j++) {
                                    if (loadOptions.filter[i][j] != 'and') {
                                        if (loadOptions.filter[i][j][1] == 'and') {
                                            tab.push(loadOptions.filter[i][j][0]);
                                            tab.push(loadOptions.filter[i][j][2]);
                                        } else
                                            tab.push(loadOptions.filter[i][j]);
                                    }
                                }
                            } else tab.push(loadOptions.filter[i]);
                        }
                    } else
                        tab.push([loadOptions.filter[0], loadOptions.filter[1], loadOptions.filter[2]]);
                }

                let q: any[] = [];
                let reqRechercherAnd: any[] = [];
                for (let i = 0; i < tab.length; i++) {
                    switch (tab[i][1]) {
                        case ('notcontains'): {
                            q.push(tab[i][0] + ".doesNotContain=" + tab[i][2]);
                            break;
                        }
                        case  'contains': {
                            q.push(tab[i][0] + ".contains=" + tab[i][2]);
                            break;
                        }
                        case '<>' : {
                            if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                let isoDate = new Date(tab[i][2]).toISOString();
                                q.push(tab[i][0] + ".notEquals=" + isoDate);
                                break;
                            } else {
                                q.push(tab[i][0] + ".notEquals=" + tab[i][2]);
                                break;
                            }
                        }
                        case  '=': {
                            if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                let isoDate = new Date(tab[i][2]).toISOString();
                                q.push(tab[i][0] + ".equals=" + isoDate);
                                break;
                            } else {
                                q.push(tab[i][0] + ".equals=" + tab[i][2]);
                                break;
                            }
                        }
                        case 'endswith': {
                            // q.push("(" + tab[i][0] + ":*" + tab[i][2] + ")");
                            break;
                        }
                        case  'startswith': {
                            //  q.push("(" + tab[i][0] + ":" + tab[i][2] + "*" + ")");
                            break;
                        }
                        case  '>=': {
                            if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                let isoDate = new Date(tab[i][2]).toISOString();
                                q.push(tab[i][0] + '.greaterOrEqualThan=' + isoDate);
                                break;
                            } else {
                                q.push(tab[i][0] + '.greaterOrEqualThan=' + tab[i][2]);
                                break;
                            }
                        }
                        case  '>': {
                            if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                let isoDate = new Date(tab[i][2]).toISOString();
                                q.push(tab[i][0] + '.greaterOrEqualThan=' + isoDate);
                                break;
                            } else {
                                q.push(tab[i][0] + '.greaterOrEqualThan=' + tab[i][2]);
                                break;
                            }
                        }
                        case  '<=': {
                            if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                let isoDate = new Date(tab[i][2]).toISOString();
                                q.push(tab[i][0] + '.lessOrEqualThan=' + isoDate);
                                break;
                            } else {
                                q.push(tab[i][0] + '.lessOrEqualThan=' + tab[i][2]);
                                break;
                            }
                        }
                        case  '<': {
                            if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                let isoDate = new Date(tab[i][2]).toISOString();
                                q.push(tab[i][0] + '.lessOrEqualThan=' + isoDate);
                                break;
                            } else {
                                q.push(tab[i][0] + '.lessOrEqualThan=' + tab[i][2]);
                                break;
                            }
                        }
                        case "or" : {
                            q.push(tab[i][0][0] + '.notEquals=' + tab[i][0][2])
                            break;
                        }
                    }
                }

                let f: string = "";
                if (q.length != 0) f += q[0];
                for (let i = 1; i < q.length; i++) {
                    f += "&" + q[i];
                }
                if (f.length != 0) params += "&" + f

                var paramsCount = ""
                var tabCount = []
                tabCount = params.split('&')
                if (tabCount.length > 2) paramsCount += "?"
                for (let i = 3; i < tabCount.length; i++) {
                    paramsCount += tabCount[i]
                    paramsCount += "&"
                }

                return this.http.get(this.env.apiUrlkernel + 'orga/get_all-emp-dep?' + params, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
                    .toPromise()
                    .then((data: any) => {
                            const filteredData = data.filter(item => {
                                return !this.userselect.find(user => user.sid === item.sid);
                            });
                            return {
                                data: filteredData,
                                totalCount: data.length
                            };
                        },
                        error => {
                            this.toastr.error(error.error.message, "", {
                                closeButton: true,
                                positionClass: 'toast-top-right',
                                extendedTimeOut: this.env.extendedTimeOutToastr,
                                progressBar: true,
                                disableTimeOut: false,
                                timeOut: this.env.timeOutToastr
                            })
                        });
            }.bind(this)
        })
    }


    changeDropDownBoxSid(e: any) {
        this.userselectintr = []
        if (e.selectedRowsData != undefined) {
            for (let t of e.selectedRowsData) {
                this.userselectintr.push(t)
            }
        }
    }


    changeDropDownBoxAffect(e) {
        this.deselectItem = [];
        if (e.selectedRowsData != undefined) {
            for (let t of e.selectedRowsData) {
                this.deselectItem.push(t)
            }
        }
    }

    affectSid() {
        this.affectionSid(this.userselectintr);
        this.personnes.emit(this.userselect)
        this.gridAff.instance.option("dataSource", this.userselect);
        // Update the dataSource property of the dx-data-grid with the updated userselect array
        this.gridSid.instance.refresh()
    }

    desaffectSid() {
        this.userselect = this.userselect.filter(ar => !this.deselectItem.find(rm => (rm.sid === ar.sid)))
        this.desaffectionSid(this.deselectItem);
        this.personnes.emit(this.userselect)
        this.gridSid.instance.refresh()
    }

    async affectionSid(sids: any) {
        let fav = new favoris();
        let errorMessageAffect = [];
        for (let t of sids) {
            fav.aclSid = {"sid": t['sid']};
            try {
                let data = await this.loginService.postfavories(fav).toPromise();
                this.userselect.push(t);
            } catch (error) {
                errorMessageAffect.push(t['sid'] + ',');
                const index = this.userselect.indexOf(t);
                if (index > -1) {
                    this.userselect.splice(index, 1);
                }
            }
        }
        if (errorMessageAffect.length > 0) {
            this.toastr.error('', "Sids erronées : " + errorMessageAffect.join(''), {
                closeButton: true,
                positionClass: 'toast-top-full-width',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            });
        }
    }

    async desaffectionSid(sids: any) {
        let errorMessageDesaffect = [];
        for (let t of sids) {
            try {
                let data = await this.loginService.deletefavorieBySid(t['sid']).toPromise();
            } catch (error) {
                errorMessageDesaffect.push(t['sid'] + ',');
            }
        }
        if (this.errorMessageDesaffect !== '') {
            this.toastr.error('', "Sids erronées : " + this.errorMessageDesaffect, {
                closeButton: true,
                positionClass: 'toast-top-full-width',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        }
    }

}
