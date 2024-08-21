import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {TokenStorageService} from "./token-storage.service";
import {EnvService} from '../../../../env.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    usermenu: any[]

    constructor(private env: EnvService, private http: HttpClient, private tokenStorage: TokenStorageService,private cookieService:CookieService) {
    }

    logout(): Observable<any> {
        return this.http.post(`${this.env.apiUrlkernel}` + "logout",null )
    }

    profile_user(): Observable<any> {
        return this.http.get(`${this.env.apiUrlkernel}` + "profile-user")
    }

    myFavoris(): Observable<any> {
        return this.http.get(`${this.env.apiUrlkernel}` + "my-favories")
    }

    postfavories(favories) {
        return this.http.post(`${this.env.apiUrlkernel + "favories"}`, favories)
    }

    deletefavories(id) {
        return this.http.delete(`${this.env.apiUrlkernel + "favories/" + id}`)
    }


    getmenubyapp(profileName, nameApplication): Observable<any> {
        console.log("in", profileName, nameApplication)
        let params = new HttpParams();
        params = params.append("profileName", profileName)
        params = params.append("moduleUiName", nameApplication)
        return this.http.get(`${this.env.apiUrlkernel + "user-menu-entries-module"}`, {
            params,
        })

    }

    VerifToken(): Observable<any> {
        return this.http.get(`${this.env.apiUrlkernel}` + "verif-token")

    }

    getMyProfiles(): Observable<any> {
        return this.http.get(`${this.env.apiUrlkernel}` + "my-profiles")

    }

    changeProfile(sid,sammacountname): Observable<any> {
        let params = new HttpParams();
        params = params.append("sammacountname", sammacountname)
        params = params.append("sidUser", sid)
        return this.http.post(`${this.env.apiUrlkernel}` + "change-profile", null, {
            params, headers: new HttpHeaders().append("Authorization", this.cookieService.get("token"))
                .append("application", require('package.json').name), responseType: 'text'
        })

    }

    getapplication() {
        return this.http.get(`${this.env.apiUrlkernel}` + "applications")
    }

    uploadPhoto(photo): Observable<any> {

        let Formdata = new FormData();
        Formdata.append("multipartFile", photo);

        return this.http.post(this.env.apiUrlkernel + 'my-photo', Formdata);
    }

    deletePhoto() {
        return this.http.delete(this.env.apiUrlkernel + 'my-photo');
    }

    deletefavorieBySid(sid) {
        return this.http.delete(`${this.env.apiUrlkernel + "favories?sid=" + sid}`)
    }

    putEmployePhoneNumber(employeid, mobile) {
        return this.http.put(`${this.env.apiUrlkernel + "putTelEmploye/" + employeid}`, mobile)
    }
}

