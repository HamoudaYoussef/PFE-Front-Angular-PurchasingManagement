import {ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DxValidationGroupComponent} from "devextreme-angular/ui/validation-group";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {EnvService} from "../../../../env.service";
import {WebsocketNotifService} from "./websocket-notif.service";
import {TranslateService} from "@ngx-translate/core";
import {DomSanitizer} from "@angular/platform-browser";
import {DatePipe} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import CustomStore from "devextreme/data/custom_store";
import notify from "devextreme/ui/notify";
import Swal from "sweetalert2";
import Speech from "speak-tts";
import DataSource from "devextreme/data/data_source";
import {ToastrService} from "ngx-toastr";

import {CookieService} from "ngx-cookie-service";
import {TokenStorageService} from '../shared-service/token-storage.service';

@Component({
    selector: 'app-websocket-notif',
    templateUrl: './websocket-notif.component.html',
    styleUrls: ['./websocket-notif.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})
export class WebsocketNotifComponent implements OnInit {

    public messages: Array<Object>;
    public files: Array<Object>;
    public meetings: Array<Object>;
    // @ViewChild('notifications')
    public withShadingOptionsVisible = false;

    public valueInputed = [];
    public notifications = [];
    dateNow = new Date()
    dateFormat = "dd/MM/yyyy HH:mm"
    public notificationsReverse = [];
    nbrNotif = 0;
    UserList = [];
    chaineCardHeaderFinal;
    timerNotif = this.env.timerNotif;
    levelNotifR = this.env.levelNotifR;
    maxHeightNotifAdminSys;
    userConnecte;
    profile = localStorage.getItem('profiles');
    public popupVisible: boolean = false;
    @ViewChild('targetGroup', {static: false}) validationGroup: DxValidationGroupComponent;
    public myForm: FormGroup;
    // from: AbstractControl;
    sendto: AbstractControl;
    body: AbstractControl;
    level: AbstractControl;
    subject: AbstractControl;

    levelNotif = this.env.levelNotif;
    photo = "";
    testPhoto: boolean = false;
    public iconInfo = this.env.iconInfo;
    public iconError = this.env.iconError;
    public iconWarning = this.env.iconWarning;
    public iconDebug = this.env.iconDebug;
    public iconTrace = this.env.iconTrace;
    public iconFatal = this.env.iconFatal;
    public theCheckboxLevel: boolean = false;
    sendtoValue: [] = [];
    gridBoxValue;
    isGridBoxOpened: boolean = false;
    pageSize = 20;

    constructor(private env: EnvService, private ref: ChangeDetectorRef, private translateService: TranslateService, private webSocketService: WebsocketNotifService, private toastr: ToastrService,
                private tokenStorage: TokenStorageService, private http: HttpClient, private cookieService: CookieService, private sanitizer: DomSanitizer, private fb: FormBuilder, private translate: TranslateService, public datepipe: DatePipe) {
        if (localStorage.getItem('locale') != null) {
            translateService.use(localStorage.getItem('locale'));

        } else {
            translateService.use('fr');

        }
    }

    ngOnInit() {
        if (this.cookieService.get('destNotif') !== "" && this.cookieService.get('destNotif') !== null)
            this.destNotif = this.cookieService.get('destNotif');
        else
            this.destNotif = localStorage.getItem('destNotif');
        this.getListDest()
        this.myForm = this.fb.group({
            // from: '',
            sendto: '',
            body: '',
            level: '',
            subject: '',
        });

        // this.from = this.myForm.controls['from'];
        this.sendto = this.myForm.controls['sendto'];
        this.body = this.myForm.controls['body'];
        this.level = this.myForm.controls['level'];
        this.subject = this.myForm.controls['subject']

        this.userConnecte = localStorage.getItem('username');

        this.getNotifByUser();

        jQuery('#messagesTabs').on('click', '.nav-item a', function () {
            setTimeout(() => jQuery(this).addClass('show'));
        });
        jQuery(document).on('click.bs.dropdown.data-api', '.dropdown.keep-inside-clicks-open', function (e) {
            e.stopPropagation();
        });

        this.connect()
    }

    connect() {
        this.stompClient = this.webSocketService.connect()
        const _this = this;
        this.stompClient.connect({}, function (frame) {
            // for (let i = 0; i < _this.destNotif.length; i++) {
            _this.stompClient.subscribe("/ws/topic/" + _this.destNotif, function (message) {
                _this.notifications = JSON.parse(message.body);
                //_this.notificationsReverse = _this.notifications.reverse();
                //_this.nbrNotif = JSON.parse(message.body).length;
                _this.getNotifByUser();
                let chaineCardHeader = "";
                let sendToValue = "";
                let fromValue = "";
                //if (_this.nbrNotif !== 0) {
                if (_this.oldNotif.indexOf(_this.notifications['id']) === -1) {
                    if (_this.notifications['level'] == 'INFO') {
                        chaineCardHeader += "<div class='d-flex card-header row bg-info text-white  styleLevelB'>" +
                            "<div class='col-md-1'> <i  class='fa fa-info fa-2x'></i> </div> " + "<div class='col-md-10' style='font-size: 20px;'>" + "<b>" + _this.notifications['subject'] + "</b>" + "</div> <div class='col-md-1'></div></div>";

                    }
                    if (_this.notifications['level'] == 'FATAL') {
                        chaineCardHeader += "<div class='d-flex card-header row bg-secondary text-white styleLevelB'>" +
                            "<div class='col-md-1'> <i  class='fa fa-exclamation-triangle fa-2x'></i> </div> " + "<div class='col-md-10' style='font-size: 20px;'>" + "<b>" + _this.notifications['subject'] + "</b>" + "</div> <div class='col-md-1'></div></div></div>";
                    }
                    if (_this.notifications['level'] == 'ERROR') {
                        chaineCardHeader += "<div class='d-flex card-header row bg-danger text-white styleLevelB'>" +
                            "<div class='col-md-1'> <i  class='fa fa-times-circle fa-2x'></i> </div> " + "<div class='col-md-10' style='font-size: 20px;'>" + "<b>" + _this.notifications['subject'] + "</b>" + "</div> <div class='col-md-1'></div></div></div>";
                    }
                    if (_this.notifications['level'] == 'WARNING') {
                        chaineCardHeader += "<div class='d-flex card-header row bg-warning text-white styleLevelB'>" +
                            "<div class='col-md-1'> <i  class='fa fa-warning fa-2x'></i> </div> " + "<div class='col-md-10' style='font-size: 20px;'>" + "<b>" + _this.notifications['subject'] + "</b>" + "</div> <div class='col-md-1'></div></div></div>";
                    }
                    if (_this.notifications['level'] == 'TRACE') {
                        chaineCardHeader += "<div class='d-flex card-header row bg-primary text-white styleLevelB'>" +
                            "<div class='col-md-1'> <i  class='fa fa-bars fa-2x'></i> </div> " + "<div class='col-md-10' style='font-size: 20px;'>" + "<b>" + _this.notifications['subject'] + "</b>" + "</div> <div class='col-md-1'></div></div></div>";
                    }
                    if (_this.notifications['level'] == 'DEBUG') {
                        chaineCardHeader += "<div class='d-flex card-header row bg-success text-white styleLevelB'>" +
                            "<div class='col-md-1'> <i  class='fa fa-bug fa-2x'></i> </div> " + "<div class='col-md-10' style='font-size: 20px;'>" + "<b>" + _this.notifications['subject'] + "</b>" + "</div> <div class='col-md-1'></div></div></div>";
                    }

                    if (_this.notifications['fromDisplay'] !== null) {
                        fromValue = "<div>" + _this.notifications['fromDisplay'] + " </div> ";
                    } else {
                        fromValue = "<div>" + _this.notifications['from'] + " </div> ";
                    }

                    if (_this.notifications['sendToDisplay'] === null) {
                        sendToValue = "&nbsp <i class='fa fa-share' aria-hidden='true'></i>&nbsp " +
                            _this.notifications['sendTo'] + " </div>";
                    } else {
                        sendToValue = "&nbsp <i class='fa fa-share' aria-hidden='true'></i>&nbsp " +
                            _this.notifications['sendToDisplay'] + " </div>";
                    }


                    _this.chaineCardHeaderFinal = _this.sanitizer.bypassSecurityTrustHtml(chaineCardHeader)
                    Swal.fire({
                        width: '33em',
                        padding: '0em',
                        html:
                            "<div class='card' " + _this.ngStyleBorder +
                            "style='width: 112.6%;margin-left: -6.4%; border-radius: 0.25rem; '>" +
                            "<div " + chaineCardHeader +
                            "</div>" +
                            "<div class='card-body' style='padding: 0px;'>" +

                            "<div class='d-flex py-1' style='font-size: 12.5px;color: gray;font-style: italic;'>" +
                            " <div class='my-auto mr-2 d-flex'>" +
                            "<span class='fa fa-clock-o' role='img'>" + "</span>" +
                            "</div>" +
                            "<div class='pg-bg-etime my-auto mr-2'>" + _this.datepipe.transform(_this.dateNow, "dd-MM-yy HH:mm") + "</div>" +
                            "<div class='ml-auto d-flex'>" +
                            fromValue +
                            "</div>" +
                            "</div>" +
                            "<div class='pg-bg-status py-1' style='text-align: left;'>" +
                            "<div (show)='" + _this.readNotifB(_this.notifications['body'], _this.notifications['from']) + "'>" +
                            _this.notifications['body'] +
                            " </div></div>" +

                            " </li>" +
                            " </div>",
                        position: 'bottom-end',
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: _this.timerNotif,
                        timerProgressBar: true,
                    })
                    Notification.requestPermission().then(function (status) {
                        var n = new Notification(_this.notifications['subject'], {
                            body: _this.notifications['body'],
                            icon: "assets/icon/favicon-32x32.png"
                        }); // this also shows the notification
                    });
                }
                //}
            })
            //}
        });
        this.stompClient.debug = true;
    }

    oldNotif = [];
    findId: boolean = false;
    ngStyleBorder = "[ngStyle]= \"{'border-color': this.notifications['level'] == 'INFO'? '#00BBD3' :  this.notifications['level'] == 'ERROR'? '#F34235':   this.notifications['level'] == 'FATAL'? '#6c757d' : this.notifications['level'] == 'WARNING'? '#ffc107' : this.notifications['level'] == 'TRACE'? '#007bff' : this.notifications['level'] == 'DEBUG'? '#28a745' : 'white' }\"";
    stompClient;

    onMessageReceived(notifications) {
        this.notifications = notifications;
    }

    levelValue: boolean = false;

    levelChecked(e) {
        if (e.value === null)
            this.levelValue = false
        else this.levelValue = true
    }

    notifByUser;
    notifUser = [];
    destNotif;

    getNotifByUser() {
        this.notifUser = []
        this.webSocketService.getNotificationByBox(this.destNotif + ",").subscribe(
            (data: []) => {
                this.notifByUser = data;
                this.notifUser = data
                this.nbrNotif = this.notifUser.length;
                if (this.nbrNotif === 0) {
                    this.maxHeightNotifAdminSys = 30
                } else if (this.nbrNotif === 1) {
                    this.maxHeightNotifAdminSys = 110;
                } else if (this.nbrNotif === 2) {
                    this.maxHeightNotifAdminSys = 190;
                } else {
                    this.maxHeightNotifAdminSys = 83 * this.env.nbrHeightNotif + 10;
                }
            }
        );
        for (let i = 0; i < this.notifUser.length - 1; i++) {
            this.oldNotif.push(this.notifUser[i]['id']);
        }
    }

    get sortData() {
        return this.notifUser.sort((a, b) => {
            return <any>new Date(b.sysdateCreated) - <any>new Date(a.sysdateCreated);
        });
    }

    deleteNotif(e) {
        this.webSocketService.deleteNotif(e).subscribe(
            data => {
                this.getNotifByUser();
            }, error => {
                console.log(error)
            }
        )
    }

    deleteAllNotif() {
        if (this.sortData.length !== 0 && this.sortData.length !== null && this.sortData.length !== undefined) {
            this.sortData.forEach(element => {
                this.deleteNotif(element.id)
            })
        }

    }

    listDestination
    @Input() sendValue;

    public ouvrirNotifPopup() {
        this.popupVisible = true;
        this.levelValue = false;
        this.myForm.reset();
        this.userConnecte = localStorage.getItem("username");
        this.myForm.get('sendto').setValue(this.sendValue)
        this.validationGroup.instance.reset();
        this.subjectLength = 0;
    }

    getListDest() {
        let size = this.env.pageSize
        this.listDestination = new DataSource({
            store: new CustomStore({
                    key: "cle",
                    byKey: function (key) {
                        return this.http.get(this.env.baseapiUrlkernel + 'box' + key.toString());
                    }.bind(this),

                    load: function (loadOptions: any) {
                        loadOptions.requireTotalCount = false
                        var params = "";
                        if (loadOptions.take == undefined) loadOptions.take = size;
                        if (loadOptions.skip == undefined) loadOptions.skip = 0;

                        //size
                        params += 'size=' + loadOptions.take || size;
                        //page
                        params += '&page=' + loadOptions.skip / size || 0;

                        //sort
                        if (loadOptions.sort) {
                            if (loadOptions.sort[0].desc)
                                params += '&sort=' + loadOptions.sort[0].selector + ',desc';
                            else
                                params += '&sort=' + loadOptions.sort[0].selector + ',asc';
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
                                    q.push(tab[i][0] + "=" + tab[i][2]);
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
                                    if (typeof (tab[i][2]) == "object") tab[i][2] = tab[i][2].id
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
                                        q.push(tab[i][0] + '.greaterThanOrEqual=' + isoDate);
                                        break;
                                    } else {
                                        q.push(tab[i][0] + '.greaterThanOrEqual=' + tab[i][2]);
                                        break;
                                    }
                                }
                                case  '>': {
                                    if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                        let isoDate = new Date(tab[i][2]).toISOString();
                                        q.push(tab[i][0] + '.greaterThan=' + isoDate);
                                        break;
                                    } else {
                                        q.push(tab[i][0] + '.greaterThan=' + tab[i][2]);
                                        break;
                                    }
                                }
                                case  '<=': {
                                    if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                        let isoDate = new Date(tab[i][2]).toISOString();
                                        q.push(tab[i][0] + '.lessThanOrEqual=' + isoDate);
                                        break;
                                    } else {
                                        q.push(tab[i][0] + '.lessThanOrEqual=' + tab[i][2]);
                                        break;
                                    }
                                }
                                case  '<': {
                                    if (tab[i][0] == "startDate" || tab[i][0] == "sysdateCreated" || tab[i][0] == "sysdateUpdated") {
                                        let isoDate = new Date(tab[i][2]).toISOString();
                                        q.push(tab[i][0] + '.lessThan=' + isoDate);
                                        break;
                                    } else {
                                        q.push(tab[i][0] + '.lessThan=' + tab[i][2]);
                                        break;
                                    }
                                }
                                case "or" : {
                                    if (typeof (tab[i][0][2]) == "object") tab[i][0][2] = tab[i][0][2].id
                                    q.push(tab[i][0][0] + '.equals=' + tab[i][0][2])
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

                        let urlBack;
                        urlBack = this.env.apiUrlkernel + 'box';
                        this.http.get(this.env.apiUrlkernel + 'box/count?' + paramsCount.substring(0, paramsCount.length - 1), {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)}).subscribe(data => {
                                this.count = (<number>data)
                                this.numPage = (loadOptions.skip / loadOptions.take) + 1
                                this.nbPage = Math.floor(this.count / this.env.pageSize)
                                if ((this.count % this.env.pageSize) != 0) {
                                    this.nbPage++
                                }
                            },
                            error => {
                                if (error.status == 0) {
                                    this.translateService.get("messageErrorWs").subscribe((res) => {
                                        notify("\n" + res, "error", 3600);
                                    })
                                } else {
                                    notify("\n" + error.message, "error", 3600);
                                }
                            })
                        return this.http.get(urlBack+'?'+params, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
                            .toPromise()
                            .then((data: any) => {
                                    // this.count = data.length
                                    // this.numPage = (loadOptions.skip / loadOptions.take) + 1
                                    // this.nbPage = Math.floor(this.count / this.pageSize)
                                    // if ((this.count % this.pageSize) != 0) {
                                    //     this.nbPage++
                                    // }
                                    this.listDepartement = [];
                                    for (let t of data) {
                                        this.listDepartement.push(t)
                                    }

                                    return {
                                        data: this.listDepartement,
                                        totalCount: this.count
                                    }
                                },
                                error => {

                                })
                    }
                        .bind(this)
                }
            ),
        })
    }

    closePopupVisible() {
        this.popupVisible = false;
        this.myForm.reset();
        this.validationGroup.instance.reset();
        this.subjectLength = 0;
    }

    addNotif(value) {
        if (!this.validationGroup.instance.validate().isValid) {
            this.translateService.get("verifRequiered").subscribe((res) => {
                notify(res, 'error');
            })
        } else {
            if (this.theCheckboxLevel === true) {
                value.level = "ERROR"
            } else if (this.theCheckboxLevel === false) {
                value.level = "INFO"
            } else
                value.level = "INFO"
            if (this.cookieService.get('sammacountname') !== null && localStorage.getItem('sammacountname') !== undefined)
                value.from = this.cookieService.get('sammacountname')
            else
                value.from = this.cookieService.get('displayname')
            value.lifeSeconds = this.env.timerNotif
            //value.sendto =
            value.sendto = this.sendToSelected
            this.webSocketService.addNotif(value).subscribe(
                data => {
                    this.isGridBoxOpened = null
                    this.toastr.success("Votre notification n°" + data[0]['id'] + " a été envoyé avec succès. ", "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                    })
                    this.getNotifByUser();
                    this.onMessageReceived(data)
                    this.popupVisible = false;

                }
            )
        }
    }

    selectedUser;

    customItem(data) {
        if (!data.text) {
            data.customItem = null;
            return;
        }
        if (this.listDestination.length > 0) {
            const newItem = {
                value: data.text,
                cle: data.text,
            };
            this.selectedUser = newItem;
            this.listDestination.store().insert(newItem);
            this.listDestination.load();
            data.customItem = newItem;
        }
    }

    subjectLength = 0;
    subjectValue = '';
    maxNotif = this.env.maxLengthNotift;
    minNotif = this.env.minLengthNotif;
    btnDisabled: boolean = true;

    lengthBody(e) {
        this.subjectValue = e.target.value;
        this.subjectLength = this.subjectValue.length;
        if (this.subjectLength >= this.minNotif)
            this.btnDisabled = false
        else this.btnDisabled = true
    }

    extractContent(s) {
        var span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
    }

    sendToSelected
    selectedChanged(e: any, data: any) {
        this.sendtoValue = []
        this.sendtoValue = e.selectedRowsData
        this.sendToSelected = e.selectedRowKeys
    }

    onGridBoxOptionChanged(e) {
        if (e.name === 'value') {
            this.ref.detectChanges();
            this.isGridBoxOpened = false;
        }
    }

    speech = new Speech();

    initNotif() {
        this.speech
            .init({
                volume: 1,
                lang: "fr-FR",
                rate: 1,
                pitch: 1
                //'voice':'Google UK English Male',
                //'splitSentences': false,
            })
            .then((data) => {
                // playSubject(speech);
            })
            .catch((e) => {
                console.error("An error occured while initializing : ", e);
            });
    }

    readNotif(e) {
        this.initNotif();
        this.speech
            .speak({
                text: this.extractContent(e),
                queue: false,
                listeners: {
                    onboundary: (event) => {
                    }
                }
            })
            .then((data) => {
            })
            .catch((e) => {
                console.error("An error occurred :", e);
            });
    }

    valueNotif;
    selectedKeys: any=[];

    readNotifB(e, e2) {

        this.valueNotif = "Vous avez une nouvelle notification de la part de " + e2 + ". contenu de la notification " + e;
        this.initNotif();
        this.speech
            .speak({
                text: this.extractContent(this.valueNotif),
                queue: false,
                listeners: {
                    onboundary: (event) => {
                    }
                }
            })
            .then((data) => {
            })
            .catch((e) => {
                console.error("An error occurred :", e);
            });
    }
}
