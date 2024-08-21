import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkflowHistoryComponent} from "./journal-component/workflow-history-component/workflow-history.component";
import {WorkflowViewerComponent} from "./journal-component/workflow-viewer-component/workflow-viewer.component";
import {IntsanceViewerComponent} from "./instance-viewer-component/instance-viewer.component";
import {EventHistoryComponent} from "./journal-component/event-history-component/event-history.component";
import {AccessHistoryComponent} from "./journal-component/access-history-component/access-history.component";
import {DxDataGridModule, DxScrollViewModule} from "devextreme-angular";
import {TranslateModule} from "@ngx-translate/core";
import {MdbFormsModule} from "mdb-angular-ui-kit/forms";
import {InstanceViewerTaskComponent} from './instance-viewer-task-component/instance-viewer-task.component';
import { JournalComponent } from './journal-component/journal.component';


@NgModule({
    declarations: [
     
    
    ],
    exports: [

   
    ],
    imports: [
        CommonModule,
        DxScrollViewModule,
        DxDataGridModule,
        TranslateModule,
        MdbFormsModule
    ]
})
export class WorkflowComponentModule {
}
