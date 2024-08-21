import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {EnvService} from "../../../../env.service";
import {Observable} from "rxjs";
import {TokenStorageService} from '../shared-service/token-storage.service';
import {WsServiceBackend} from '../shared-service/wsback-end';
var SockJs = require("sockjs-client");
var Stomp = require("stompjs");

@Injectable({
  providedIn: 'root'
})
export class WebsocketNotifService {
  private headers: HttpHeaders

  constructor(private env: EnvService, private http: HttpClient, private tokenStorage: TokenStorageService) {
    this.headers = new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)

  }

  connect() {
    let socket = new SockJs(this.env.apiUrlkernel + this.env.apiUrlkernel);
    return Stomp.over(socket);
  }




  getNotificationByBox(boiteAbonne) {
    return this.http.get(this.env.apiUrlkernel + 'notif?dest=' + boiteAbonne, {headers: this.headers});
  }

  deleteNotif(idNotif): Observable<any> {
    return this.http.delete(this.env.apiUrlkernel + 'notif?id=' + idNotif, {headers:  this.headers});
  }

  addNotif(data): Observable<any> {
    return this.http.post(this.env.apiUrlkernel + 'notif', data, {headers:  this.headers});
  }


}
