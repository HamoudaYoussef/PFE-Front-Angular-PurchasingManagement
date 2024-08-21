import {Inject, Injectable, ViewChild} from "@angular/core";
import {DOCUMENT} from "@angular/common";

@Injectable({providedIn: 'root'})
export class OpenCarteVisite {
    constructor(@Inject(DOCUMENT) private dom: any) {

    }


    openCarteVisiteJs(value) {
        if (this.dom.getElementById(value).value !== undefined && this.dom.getElementById(value).value !== null) {
            this.dom.getElementById("popoverCarteVisite").innerHTML = this.dom.getElementById(value).value + "," + value
            this.dom.getElementById("popoverCarteVisite").click()
        } else {
            if (this.dom.getElementById(value).firstChild.firstChild !== undefined && this.dom.getElementById(value).firstChild.firstChild !== null) {
                this.dom.getElementById("popoverCarteVisite").innerHTML = this.dom.getElementById(value).firstChild.firstChild.value + "," + value
                this.dom.getElementById("popoverCarteVisite").click()
            } else {
                this.dom.getElementById("popoverCarteVisite").innerHTML = this.dom.getElementById(value).innerHTML + "," + value
                this.dom.getElementById("popoverCarteVisite").click()
            }
        }
    }
}
