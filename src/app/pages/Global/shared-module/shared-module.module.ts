import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DxSpeedDialActionModule} from "devextreme-angular/ui/speed-dial-action";
import {DxDataGridModule} from "devextreme-angular/ui/data-grid";
import {DxDropDownBoxModule} from "devextreme-angular/ui/drop-down-box";
import {DxTreeViewModule} from "devextreme-angular/ui/tree-view";
import {DxTreeListModule} from "devextreme-angular/ui/tree-list";
import {DxSelectBoxModule} from "devextreme-angular/ui/select-box";
import {DxCheckBoxModule} from "devextreme-angular/ui/check-box";
import {DxListModule} from "devextreme-angular/ui/list";
import {DxTagBoxModule} from "devextreme-angular/ui/tag-box";
import {DxDropDownButtonModule} from "devextreme-angular/ui/drop-down-button";
import {DxToolbarModule} from "devextreme-angular/ui/toolbar";
import {DxButtonModule} from "devextreme-angular/ui/button";
import {DxFormModule} from "devextreme-angular/ui/form";
import {DxDateBoxModule} from "devextreme-angular/ui/date-box";
import {DxLoadPanelModule} from "devextreme-angular/ui/load-panel";
import {DxPopupModule} from "devextreme-angular/ui/popup";
import {DxSortableModule} from "devextreme-angular/ui/sortable";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../../app.module";
// MDB Modules
import {MdbCheckboxModule} from 'mdb-angular-ui-kit/checkbox';
import {MdbCollapseModule} from 'mdb-angular-ui-kit/collapse';
import {MdbDatepickerModule} from 'mdb-angular-ui-kit/datepicker';
import {MdbDropdownModule} from 'mdb-angular-ui-kit/dropdown';
import {MdbLazyLoadingModule} from 'mdb-angular-ui-kit/lazy-loading';
import {MdbLoadingModule} from 'mdb-angular-ui-kit/loading';
import {MdbModalModule} from 'mdb-angular-ui-kit/modal';
import {MdbPopoverModule} from 'mdb-angular-ui-kit/popover';
import {MdbRadioModule} from 'mdb-angular-ui-kit/radio';
import {MdbRangeModule} from 'mdb-angular-ui-kit/range';
import {MdbRippleModule} from 'mdb-angular-ui-kit/ripple';
import {MdbScrollspyModule} from 'mdb-angular-ui-kit/scrollspy';
import {MdbSelectModule} from 'mdb-angular-ui-kit/select';
import {MdbStepperModule} from 'mdb-angular-ui-kit/stepper';
import {MdbTabsModule} from 'mdb-angular-ui-kit/tabs';
import {MdbTimepickerModule} from 'mdb-angular-ui-kit/timepicker';
import {MdbTooltipModule} from 'mdb-angular-ui-kit/tooltip';
import {MdbValidationModule} from 'mdb-angular-ui-kit/validation';
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {DxScrollViewModule} from "devextreme-angular/ui/scroll-view";
import {DxPivotGridModule} from "devextreme-angular/ui/pivot-grid";
import {DxFileManagerModule} from 'devextreme-angular/ui/file-manager';
import {DxTextBoxModule} from 'devextreme-angular/ui/text-box';
import {DxPopoverModule} from 'devextreme-angular/ui/popover';
import {DxNumberBoxModule} from 'devextreme-angular/ui/number-box';
import {
    DxLookupModule,
    DxRadioGroupModule,
    DxSwitchModule,
    DxTemplateModule,
    DxTooltipModule
} from 'devextreme-angular';
import {TextMaskModule} from "angular2-text-mask";
import {LocalizationService} from "../shared-service/localization.service";
@NgModule({
    declarations: [

    ],
    providers: [LocalizationService], // Service should be provided here or in a higher module

    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    //    **************************** MDB5 ************************************
    MdbTimepickerModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDatepickerModule,
    MdbFormsModule,
    MdbDropdownModule,
    MdbLazyLoadingModule,
    MdbLoadingModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbSelectModule,
    MdbStepperModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    MdbFormsModule,
    DxPivotGridModule,

        //******************************************devextreme*******************************************************
        DxSpeedDialActionModule,
        DxDataGridModule,
        DxDropDownBoxModule,
        DxTreeViewModule,
        DxSelectBoxModule,
        DxCheckBoxModule,
        DxListModule,
        DxTagBoxModule,
        DxDropDownButtonModule,
        DxToolbarModule,
        DxButtonModule,
        DxFormModule,
        DxDateBoxModule,
        DxLoadPanelModule,
        DxPopupModule,
        DxSortableModule,
        DxTreeListModule,


        //********************************************Material *************
        DxScrollViewModule,
        DxFileManagerModule,
        DxNumberBoxModule

        // MatCheckboxModule,
        // MatCardModule

    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        //    **************************** export MDB***********************************************************

        MdbFormsModule,
        MdbCheckboxModule,
        MdbCollapseModule,
        MdbDatepickerModule,
        MdbDropdownModule,
        MdbLazyLoadingModule,
        MdbLoadingModule,
        MdbModalModule,
        MdbPopoverModule,
        MdbRadioModule,
        MdbRangeModule,
        MdbRippleModule,
        MdbScrollspyModule,
        MdbSelectModule,
        MdbStepperModule,
        MdbTabsModule,
        MdbTooltipModule,
        MdbValidationModule,
        //*****************************devextreme pour exporte dans les autres comp********************************
        DxSpeedDialActionModule,
        DxDataGridModule,
        DxDropDownBoxModule,
        DxTreeViewModule,
        DxTreeListModule,
        DxSelectBoxModule,
        DxCheckBoxModule,
        DxListModule,
        DxTagBoxModule,
        DxDropDownButtonModule,
        DxToolbarModule,
        DxButtonModule,
        DxFormModule,
        DxDateBoxModule,
        DxLoadPanelModule,
        DxPopupModule,
        DxSortableModule,
        DxScrollViewModule,
        DxPivotGridModule,
        DxFileManagerModule,
        DxTextBoxModule,
        DxPopoverModule,
        DxNumberBoxModule,
        DxSwitchModule,
        DxRadioGroupModule,
        DxLookupModule,
        TextMaskModule,
        DxTooltipModule
    ]
})
export class SharedModuleModule { }
