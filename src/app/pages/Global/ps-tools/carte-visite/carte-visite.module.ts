import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CarteVisiteComponent} from "./carte-visite.component";
//
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {CardsModule} from "ng-uikit-pro-standard";
import {DxPopoverModule, DxPopupModule, DxScrollViewModule} from "devextreme-angular";
import {NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";
import { CarteVisiteGridComponent } from './carte-visite-grid/carte-visite-grid.component';



@NgModule({
  declarations: [
    CarteVisiteComponent,
    CarteVisiteGridComponent
  ],
    exports: [
        CarteVisiteComponent,
        CarteVisiteGridComponent
    ],
    imports: [
        CommonModule,

        TranslateModule,

        ReactiveFormsModule,
        CardsModule,
        DxPopupModule,
        NgbPopoverModule,
        DxScrollViewModule,
        DxPopoverModule
    ]
})
export class CarteVisiteModule { }
