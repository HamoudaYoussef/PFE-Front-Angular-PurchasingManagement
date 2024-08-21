import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {SafeResourceUrl} from '@angular/platform-browser';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-workflow-viewer',
    templateUrl: './workflow-viewer.component.html',
    styleUrls: ['./workflow-viewer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WorkflowViewerComponent implements OnInit, OnChanges {


    @Output() viewerEvent = new EventEmitter<any>();

    @Input() viewerUrl: any;

    url: SafeResourceUrl;

    constructor() {
    }

    ngOnInit() {
        this.getProcessDiagram();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getProcessDiagram();
    }

    getProcessDiagram() {
        this.url = 'data:' + this.viewerUrl.headers['Content-Type'][0] + ';base64,' + this.viewerUrl.body;
        // var blob = new Blob(this.viewerUrl.body, { type: this.viewerUrl.headers['Content-Type'][0] });
        // this.url = window.URL.createObjectURL(this.viewerUrl as Blob);
        // const reader = new FileReader();
        // reader.addEventListener('load', () => {
        //   this.url = reader.result;
        //   this.viewerEvent.emit(this.url);
        // }, false);
        //
        // if (blob) {
        //   reader.readAsDataURL(blob);
        // }

    }
}


