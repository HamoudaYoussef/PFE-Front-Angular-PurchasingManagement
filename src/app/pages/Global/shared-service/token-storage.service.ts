import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'AuthUsername';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {

    constructor(private cookieService :CookieService) {
    }

    signOut() {
        window.sessionStorage.clear();
    }

    public saveToken(token: string) {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string {
      //  return localStorage.getItem(TOKEN_KEY);
        return this.cookieService.get('token');
    }

    public saveUsername(username: string) {
        window.localStorage.removeItem(USERNAME_KEY);
        window.localStorage.setItem(USERNAME_KEY, username);
    }

    public getUsername(): string {
        return localStorage.getItem(USERNAME_KEY);
    }

}
