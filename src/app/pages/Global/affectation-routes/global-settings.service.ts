import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {EnvService} from "../../../../env.service";
import {TokenStorageService} from '../shared-service/token-storage.service';
import {WsServiceBackend} from '../shared-service/wsback-end';


@Injectable({
    providedIn: 'root'
})
export class GlobalSettingsService {
    Wservice=new WsServiceBackend();
    private headers: HttpHeaders
    constructor(private env: EnvService, private http: HttpClient, private tokenStorage: TokenStorageService) {
        this.headers = new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)

    }

    /*UTILE POUR AFFECTATION DES ROUTES*/
    getModuleUiByAppName(AppName): Observable<any> {
        let params = new HttpParams();
        params = params.append("name.equals", AppName);
        return this.http.get(this.env.apiUrlkernel + this.Wservice.getAllGestionModuleUi,
            {
                headers: this.headers
                , params: params
            });
    }

    updateModuleUi(id, ModuleUi): Observable<any> {
        return this.http.patch(this.env.apiUrlkernel + this.Wservice.putGestionModuleUi + id, ModuleUi, {headers: this.headers});
    }

    /*********************************/




}
