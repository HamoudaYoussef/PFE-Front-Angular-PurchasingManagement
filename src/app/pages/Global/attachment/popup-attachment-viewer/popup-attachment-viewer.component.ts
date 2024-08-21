import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'app-popup-attachment-viewer',
    templateUrl: './popup-attachment-viewer.component.html',
    styleUrls: ['./popup-attachment-viewer.component.scss']
})
export class PopupAttachmentViewerComponent implements OnInit {
    @Input() idAttachement;
    @Input() objectData;
    @Input() filebyId;
    @Input() fileName; /*File Name input*/
    @Input() visibleTrueModal;/* To Open Viwer Modal*/
    @Input() PcTkExist;/* Check if pctk exist or not */
    @Input() avertismentPopUp;/* avertissement if pdf is signed and save in data grid*/
    @Input() permissionDenied;/*Permission denied to top container viewer if is it not a pdf*/
    @Input() pgNbr;/*Page nbr*/
    @Input() base64;/*Base64 input*/
    @Input() permissionDeniedSig;/*Permission denied to signature*/
    @Input() permissionToTopViewer;/*PERMISSION FOR Top Viewer */
    @Input() jsondocviewer;/*PDF viwer input*/
    @Input() fileAccessToken

    @Output() BASE64_Output_Save = new EventEmitter();/*Base 64 output to saved*/
    @Output() BASE64_Output_Reload = new EventEmitter();/*Base 64 output to reloaded*/
    @Output() fileSigned = new EventEmitter();/*output file signed*/
    @Output() closeModal = new EventEmitter();/*close Modal event*/
    @Output() updateWaterMarker = new EventEmitter();/*close Modal event*/
    constructor() {
    }

    ngOnInit(): void {

    }

    close(e) {
        this.closeModal.emit(e)
    }

    updateWaterMarkers(e) {
        this.updateWaterMarker.emit(e)
    }

    Output_Save(e) {
        this.BASE64_Output_Save.emit(e)
    }

    Output(e) {
        this.BASE64_Output_Reload.emit(e)
    }

    signed(e) {
        this.fileSigned.emit(e)
    }
}
