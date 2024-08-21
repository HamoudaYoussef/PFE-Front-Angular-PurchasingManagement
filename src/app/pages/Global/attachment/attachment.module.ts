import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AttachmentComponent} from './attachment.component';
import {DataGridAttachmentsComponent} from './data-grid-attachments/data-grid-attachments.component';
import {TemplateAttachmentComponent} from './template-attachment/template-attachment.component';
import {TranslateModule} from '@ngx-translate/core';
import {SignatureComponent} from './signature/signature.component';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {DocViewerComponent} from './ngx-doc-viewer-file/docViewer.component';
import {ThumbnailComponent} from './thumbnail/thumbnail.component';
import {ClipboardModule} from 'ngx-clipboard';
import {PopupAttachmentViewerComponent} from './popup-attachment-viewer/popup-attachment-viewer.component';
import {ContainerTopViewerComponent} from './container-top-viewer/container-top-viewer.component';
import {SharedModuleModule} from '../shared-module/shared-module.module';
import {PsToolsModule} from '../ps-tools/ps-tools.module';
import {ListeattachementparametresComponent} from "./listeattachementparametres/listeattachementparametres.component";
import {DocumentEditorComponent} from "./document-editor/document-editor.component";
import {DocumentEditorContainerModule} from "@syncfusion/ej2-angular-documenteditor";
import {AttachementGridOnlyComponent} from "./attachement-grid-only/attachement-grid-only.component";
import { ListeattachementparametresCaseComponent } from './listeattachementparametres-case/listeattachementparametres-case.component';

@NgModule({
    declarations: [
        AttachmentComponent,
        DataGridAttachmentsComponent,
        TemplateAttachmentComponent,
        SignatureComponent,
        DocViewerComponent,
        ThumbnailComponent,
        ContainerTopViewerComponent,
        PopupAttachmentViewerComponent,
        ListeattachementparametresComponent,
        DocumentEditorComponent,
        AttachementGridOnlyComponent,
        ListeattachementparametresCaseComponent,

    ],
    imports: [
        CommonModule,
        TranslateModule,
        NgxDocViewerModule,
        ClipboardModule,
        SharedModuleModule,
        PsToolsModule,
        DocumentEditorContainerModule,

    ],
    exports: [
        AttachmentComponent,
        SignatureComponent,
        DataGridAttachmentsComponent,
        TemplateAttachmentComponent,
        ThumbnailComponent,
        DocViewerComponent,
        PsToolsModule,
        PopupAttachmentViewerComponent,
        ListeattachementparametresComponent,
        DocumentEditorComponent,
        AttachementGridOnlyComponent,
        ListeattachementparametresCaseComponent


    ]
})
export class AttachmentModule {
}
