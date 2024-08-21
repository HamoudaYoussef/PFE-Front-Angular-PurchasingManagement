import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {FormatDate} from '../../../shared-service/formatDate';
import {EnvService} from '../../../../../../env.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-workflow-history',
    templateUrl: './workflow-history.component.html',
    styleUrls: ['./workflow-history.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WorkflowHistoryComponent implements OnInit, OnChanges {

    public formatDate = new FormatDate(this.env);

    @Input() historics: any;

    historicTasks: any[] = [];

    constructor(private env:EnvService) { }

    ngOnInit() {
        this.historicTasks =  this.historics;
        //console.log(" this.historicTasks", this.historicTasks)
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.historicTasks =  this.historics;
    }

    onToolbarPreparingGridWf(e) {
        var ref = this;

        // e.toolbarOptions.items.unshift({
        //     location: 'before',
        //     template: 'totalGroupCount6'
        // })

    }



}


