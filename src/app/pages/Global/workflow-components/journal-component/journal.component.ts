import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-journal',
    templateUrl: './journal.component.html',
    styleUrls: ['./journal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class JournalComponent implements OnInit, OnChanges {


    @Input() historicsWF: any;
    @Input() historicsEvt: any;
    @Input() historicsAcces: any;
    @Input() viewerUrl: any;

    constructor() { }

    ngOnInit() {

    }
    ngOnChanges(changes: SimpleChanges): void {
        //console.log("changesWF",changes);
    }
}
