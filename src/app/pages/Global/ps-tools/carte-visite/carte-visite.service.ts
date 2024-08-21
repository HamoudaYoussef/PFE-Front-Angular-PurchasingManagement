import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {EnvService} from '../../../../../env.service';
import {TokenStorageService} from '../../shared-service/token-storage.service';


@Injectable({
  providedIn: 'root'
})
export class CarteVisiteService {
  private headers: HttpHeaders

  constructor(private env: EnvService, private http: HttpClient, private tokenStorage: TokenStorageService) {
    this.headers = new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)

  }

  getInfoCarteVisite(name): Observable<any> {
    return this.http.get(this.env.apiUrlkernel + 'visit-card/'+name, {headers: this.headers});
  }

  getVariablesCarteVisite(variableName): Observable<any> {
    return this.http.get(this.env.apiUrlkernel + 'variables-by-name?variableName='+variableName, {headers: this.headers});
  }

}
