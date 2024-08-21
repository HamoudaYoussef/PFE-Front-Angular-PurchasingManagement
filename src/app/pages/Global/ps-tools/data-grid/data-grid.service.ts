import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {HttpParam, ParamsMethode, ResultWs} from "../class";
import {LoggerService} from "../loggerService";
import {NGXLogger} from "ngx-logger";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {EnvService} from "../../../../../env.service";
import {TokenStorageService} from "../../shared-service/token-storage.service";

@Injectable({
    providedIn: 'root'
})
export class DataGridService {

    public loadingVisible = false;
    columns = [];
    private loggerService: LoggerService;
    private headers: HttpHeaders;
    private resultWs: ResultWs;

    constructor(private env: EnvService, private datePipe: DatePipe, private translateService: TranslateService, private toster: ToastrService, private logger: NGXLogger, private http: HttpClient, private tokenStorage: TokenStorageService) {
        this.loggerService = new LoggerService(logger);
        this.headers = new HttpHeaders().set('Authorization', this.tokenStorage.getToken()).append('application', require('package.json').name);
        this.resultWs = new ResultWs();
    }

    async method(paramsHttp: HttpParam, refrence?, successmsg?: string, errormsg?: string, toaster?: boolean) {
        try {
            this.loadingVisible = true;
            let result = await this.getResultWs(paramsHttp);
            this.resultWs.statut = true;
            this.resultWs['value'] = result;
        } catch (error) {
            this.resultWs.statut = false;
            if (paramsHttp.returnError != null && paramsHttp.returnError != undefined && paramsHttp.returnError == true) {
                this.resultWs.data = error;
                this.catchNotify(paramsHttp.method, error.error.message, refrence, successmsg, errormsg, toaster);
            } else {
                this.catchNotify(paramsHttp.method, error.error.message, refrence, successmsg, errormsg, toaster);
            }
        } finally {
            if (paramsHttp.method != 'get' && this.resultWs.statut) {
                this.catchNotify(paramsHttp.method, '', refrence, successmsg, errormsg, toaster);
            }
            this.loadingVisible = false;
            return this.resultWs;
        }
    }

    catchNotify(requestMethode, error?, refrence?, successmsg?, errormsg?, toaster?) {
        let toasterEnbled = true;
        if (toaster != null && toaster != undefined) {
            toasterEnbled = toaster;
        }
        let nameMessageTranslate = '';
        let message = '';

        if (this.resultWs.statut == true) {
            if (successmsg) {
                // console.log(error, successmsg, errormsg)
                nameMessageTranslate = successmsg;
            } else {
                switch (requestMethode) {
                    case ('post'): {
                        nameMessageTranslate = 'Global.messageCreateSucces';
                        break;
                    }
                    // case ('get'): {
                    //   nameMessageTranslate = "Global.messageGetSucces"
                    //   break
                    // }
                    case ('delete'): {
                        nameMessageTranslate = 'Global.messageDeleteSucces';
                        break;
                    }
                    case ('put'): {
                        nameMessageTranslate = 'Global.messageUpdateSucces';
                        break;
                    }
                    case ('patch'): {
                        nameMessageTranslate = 'Global.messageCreateSucces';
                        break;
                    }
                }
            }
        } else if (this.resultWs.statut == false) {
            if (errormsg) {
                // console.log(errormsg)

                nameMessageTranslate = errormsg;
            } else {
                nameMessageTranslate = error;
            }

        }

        if (requestMethode != 'get') {
            this.translateService.get(nameMessageTranslate.toString(), refrence).subscribe(
                res => {
                    message = res;
                });
            if (toasterEnbled) {
                if (this.resultWs.statut == true) {
                    this.toster.success(message, '', {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    });
                } else if (this.resultWs.statut == false) {
                    this.toster.error(message, '', {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    });
                }
            }
        }


    }

    getAllLazyWithoutCount(pageable,loadOptions: any, wsData: string, wsCount: string,paging:object,selectRequest?:[]): Promise<ResultWs> {
        var paramsData: any = []
        var paramsCount = []


        // paramsData.push(new ParamsMethode("size", (loadOptions.take === 0 ? 0 :  loadOptions.take || this.env.pageSize)))
        // paramsData.push(new ParamsMethode("page", (loadOptions.skip === 0 ? 0 : (Math.ceil( loadOptions.skip /loadOptions.take )))))

        if (paging["pageSize"]  == undefined) paging["pageSize"]  = 0
        if (paging["pageIndex"] == undefined) paging["pageIndex"] = 0
        paramsData.push(new ParamsMethode("size", (paging["pageSize"] === 0 ? 0 :  paging["pageSize"]  || this.env.pageSize)))
        paramsData.push(new ParamsMethode("page", (paging["pageIndex"] === 0 ? 0 : paging["pageIndex"])))



        if (loadOptions.sort != null && loadOptions.sort != undefined)
            paramsData.push(new ParamsMethode("sort", loadOptions.sort[0].selector + (loadOptions.sort[0].desc ? ',desc' : ',asc')))
        let tab: any[] = [];
        if (loadOptions.filter) {
            if (loadOptions.filter[1] == 'and') {

                for (var i = 0; i < loadOptions.filter.length; i++) {
                    if (loadOptions.filter[i][1] == 'and') {
                        for (var j = 0; j < loadOptions.filter[i].length; j++) {

                            if (loadOptions.filter[i][j] != 'and') {
                                if (loadOptions.filter[i][j][1] == 'and') {
                                    if(typeof (loadOptions.filter[i].filterValue) == "object")
                                        loadOptions.filter[i][j][0][2] = this.getLocalDate(loadOptions.filter[i][j][0][0],loadOptions.filter[i][j][0][2])
                                    tab.push(loadOptions.filter[i][j][0]);
                                    if(typeof (loadOptions.filter[i].filterValue) == "object")
                                        loadOptions.filter[i][j][2][2] = this.getLocalDate(loadOptions.filter[i][j][2][0],loadOptions.filter[i][j][2][2])
                                    tab.push(loadOptions.filter[i][j][2]);
                                } else {
                                    if (typeof (loadOptions.filter[i].filterValue) == "object")
                                        loadOptions.filter[i][j][2] = this.getLocalDate(loadOptions.filter[i][j][0],loadOptions.filter[i][j][2])
                                    tab.push(loadOptions.filter[i][j]);
                                }
                            }
                        }
                    } else {

                        if(typeof (loadOptions.filter[i]) == "object") {
                            // loadOptions.filter[i][2] = this.getLocalDate(loadOptions.filter[i][0],loadOptions.filter[i][2])
                            loadOptions.filter[i][2]=new Date(loadOptions.filter[i][2]).toISOString()

                        }
                        tab.push(loadOptions.filter[i]);
                    }
                }
            } else {

                if(typeof (loadOptions.filter.filterValue) == "object") {
                    tab.push([loadOptions.filter[0], loadOptions.filter[1], this.getLocalDate(loadOptions.filter[0],loadOptions.filter[2])])
                }else
                    tab.push([loadOptions.filter[0], loadOptions.filter[1], loadOptions.filter[2]])
            }
        }
        for (let i = 0; i < tab.length; i++) {
            if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                let isoDate = new Date(tab[i][2]).toISOString();
                tab[i][2] = isoDate
            }
            let operateur

            switch (tab[i][1]) {
                case ('notcontains'): {
                    operateur = "doesNotContain"
                    break
                }
                case  'contains': {
                    operateur = "contains"
                    break
                }
                case '<>' : {
                    operateur = "notEquals"
                    break
                }
                case  '=': {
                    operateur = "equals"
                    break
                }
                case 'endswith': {
                    // q.push("(" + tab[i][0] + ":*" + tab[i][2] + ")");
                    break
                }
                case  'startswith': {
                    //  q.push("(" + tab[i][0] + ":" + tab[i][2] + "*" + ")");
                    break
                }
                case  '>=': {
                    operateur = "greaterOrEqualThan"
                    break
                }
                case  '>': {
                    operateur = "greaterOrEqualThan"
                    break;
                }
                case  '<=': {
                    operateur = "lessOrEqualThan"
                    break
                }
                case  '<': {
                    operateur = "lessOrEqualThan"
                    break
                }
                case "or" : {
                    if (typeof (tab[i][0]) == "object") {
                        let ch = ""
                        loadOptions.filter.forEach(element => {
                            if (element[2] != null && element[2] != undefined && element[2] != "") {
                                ch += element[2] + ","
                            }
                        });
                        paramsCount.push(new ParamsMethode(tab[i][0][0] + "." + "in", ch))
                        paramsData.push(new ParamsMethode(tab[i][0][0] + "." + "in", ch))
                    } else
                        operateur = "notEquals"
                    break;
                }
            }
            if (operateur != null && operateur != undefined && operateur != "") {
                paramsCount.push(new ParamsMethode(tab[i][0] + "." + operateur, tab[i][2]))
                paramsData.push(new ParamsMethode(tab[i][0] + "." + operateur, tab[i][2]))
            }
        }
        if(selectRequest) {
            selectRequest.forEach(element => {
                if(element) {
                    if (element['displayExpr'] != null && element['displayExpr'] != undefined && element['displayExpr'] != "" && element['valueExpr'] != null && element['valueExpr'] != undefined && element['valueExpr'] != "") {
                        paramsCount.push(new ParamsMethode(element['displayExpr'], element['valueExpr']))
                        paramsData.push(new ParamsMethode(element['displayExpr'], element['valueExpr']))
                    }
                }
            })
        }
        let param = new HttpParam("get", wsData, '', null, paramsData)
        param.url = wsData
        param.params = paramsData
        let data1 = this.method(param)
        return data1;
    }

    public getResultWs(paramsHttp: HttpParam): Promise<Object> {

        let params = new HttpParams();
        paramsHttp.params.forEach(element => {
            params = params.append(element["attribut"], element["value"])
        })
        if (paramsHttp.body != null && paramsHttp.body != undefined && paramsHttp.body != "")
            return this.http[paramsHttp.method](paramsHttp.url + paramsHttp.id, paramsHttp.body, {
                headers: this.headers,
                params: params
            }).toPromise()
        else
            return this.http[paramsHttp.method]( paramsHttp.url + paramsHttp.id, {
                headers: this.headers,
                params: params
            }).toPromise()
    }

    getLocalDate(dataField, date) {
        let type;
        this.columns.forEach(element => {
            if (element.dataField == dataField) {
                type = element.dataType;
            }
        });
        if (type == 'date') {
            return this.datePipe.transform(date, 'yyyy-MM-dd');
        } else if (type == 'datetime') {
            return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss');
        } else {
            return date
        }
    }

    setColumns(data) {
        this.columns = data;
    }


}

