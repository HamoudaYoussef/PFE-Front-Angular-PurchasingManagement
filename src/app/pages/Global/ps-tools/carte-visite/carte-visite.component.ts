import {Component, HostBinding, Inject, Input, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {CarteVisiteService} from "./carte-visite.service";
import {NavigationEnd, Router} from "@angular/router";
import {OpenCarteVisite} from "./openCarteVisite";
import {DOCUMENT} from "@angular/common";

//let stylePop = localStorage.getItem("backgroundColorPop");

@Component({
    selector: 'app-carte-visite',
    templateUrl: './carte-visite.component.html',
    styleUrls: ['./carte-visite.component.scss', './carteVisite.scss'],
    // styles: ["::ng-deep .dx-popover-wrapper .dx-popup-content {\n" +
    // "  background: " + stylePop + " !important;\n" +
    // "padding-bottom: 0px !important;\n" +
    // "    padding-top: 0px !important;" +
    // "}\n" +
    // "\n" +
    // "::ng-deep .dx-popover-arrow::after {\n" +
    // "  background:" + stylePop + "  !important;\n" +
    // "}"]
})
export class CarteVisiteComponent implements OnInit {

    dataUser;
    widthPopover
    heightPopover
    backgroundCV

    constructor(private carteVisiteService: CarteVisiteService, public router: Router, public openCarteVisite: OpenCarteVisite, @Inject(DOCUMENT) private dom: any) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const _this = this
                let test = document.querySelectorAll('[class^="carteVisite"],[class*=" carteVisite"]')
                test.forEach(el => el.addEventListener("click", function (event) {
                    _this.openCarteVisite.openCarteVisiteJs(el.id)
                }, false));
            }
        })
    }

    ngOnInit(): void {
        this.carteVisiteService.getVariablesCarteVisite("carteVisiteStyle").subscribe(data => {
            this.carteVisiteStyle = data
            this.backgroundCV = this.carteVisiteStyle.backgroundColor
            if (data !== null && data !== undefined) {
                this.widthPopover = data.widthPopover
                this.heightPopover = data.heightPopover
            } else {
                this.widthPopover = 470
                this.heightPopover = 185
            }
        })
    }

    popupVisible: boolean = false;
    targetValue
    carteVisiteStyle

    openPopover() {
        let value = document.getElementById("popoverCarteVisite").innerHTML
        let valueWS
        this.targetValue = "#" + value.substring(value.indexOf(",") + 1)
        if (value.substring(0, value.indexOf(",")).indexOf("&amp;") !== -1)
            valueWS = value.substring(0, value.indexOf(",")).replace("&amp;", "&")
        else
            valueWS = value.substring(0, value.indexOf(","))
        this.carteVisiteService.getInfoCarteVisite(valueWS).subscribe(
            data => {
                this.dataUser = data
                this.popupVisible = !(this.dataUser.length === 0 && this.dataUser.length === undefined);
            }
        )

    }

    onShown(evt) {
        let popupElements = document.getElementsByClassName("dx-popup-normal")
        for (let i = 0; i < popupElements.length; i++) {
            const popup = popupElements[i];
            popup.addEventListener("mouseenter", e => {
                evt.component.show()
            });
            popup.addEventListener("mouseleave", e => {
                setTimeout(() => {
                    evt.component.hide()
                }, 5000) //after 5s
            });
        }
    }

    ArrayToStringGroupe(List) {
        let str = '';
        for (let t of List) {
            str = str + t.displayname + "(" + t.samaccountname + ")" + ',';
        }
        return str.slice(0, str.length - 1);
    }

    ArrayToStringMembre(List) {
        let str = '';
        for (let t of List) {
            str = str + t.displayname + ',';
        }
        return str.slice(0, str.length - 1);
    }

    initpopGen(e) {
        var contentElement = e.component.content();
        contentElement.id = 'popupCV'
        contentElement.style = 'background-color :'+this.carteVisiteStyle.backgroundColor;
    }
}
