import {Component, Input, OnInit} from '@angular/core';
import {CarteVisiteService} from "../carte-visite.service";

//let stylePop = localStorage.getItem("backgroundColorPop");

@Component({
    selector: 'app-carte-visite-grid',
    templateUrl: './carte-visite-grid.component.html',
    styleUrls: ['./carte-visite-grid.component.scss','../carteVisite.scss'],
    // styles: ["::ng-deep .dx-overlay-content .dx-popup-content {\n" +
    // "  background: "+stylePop+" !important;\n" +
    // "padding-bottom: 0px !important;\n" +
    // "    padding-top: 0px !important;"+
    // "}"]
})
export class CarteVisiteGridComponent implements OnInit {

    dataUser;
    @Input() value
    popupVisible: boolean = false
    widthPopover
    heightPopover
    backgroundCV
    carteVisiteStyle

    constructor(private carteVisiteService: CarteVisiteService) {
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

    openPopup(value) {
        this.carteVisiteService.getInfoCarteVisite(value).subscribe(
            data => {
                this.dataUser = data
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
                setTimeout(()=>{
                    evt.component.hide()
                },5000) //after 5s
            });
        }
    }

    ArrayToStringGroupe(List) {
        let str = '';
        for (let t of List) {
            str = str + t.displayname+"("+t.samaccountname+")" + ',';
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
