import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenStorageService} from './token-storage.service';
import {EnvService} from '../../../../env.service';

export class ColorState {
    private headers: HttpHeaders

    states;
    backgroundState;
    Color="ffff";
    backgroundStateBtn;
    visibilityBtn: boolean = false;
    stateGridVisible = []
    labelBtn
    colorBtn

    constructor(private env: EnvService, private http: HttpClient, private tokenStorage: TokenStorageService) {
        this.headers = new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)

    }







    getStates(className, context) {
        this.http.get(this.env.apiUrlkernel + 'api/processing-states-filtre?className=' + className + '&context=' + context, {headers: this.headers}).subscribe(
            data => {
                this.states = data;
            })
    }





}
