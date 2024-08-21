import {Component, OnInit} from '@angular/core';
import {DataGrid} from "../../ps-tools/data-grid/dataGridClass";
import {LocalizationService} from "../../shared-service/localization.service";
import {EnvService} from "../../../../../env.service";

@Component({
    selector: 'app-example-list',
    templateUrl: './example-list.component.html',
    styleUrls: ['./example-list.component.scss']
})
export class ExampleListComponent implements OnInit {
    private env = new EnvService();
    dataGrid: any;

    constructor(private localizationService: LocalizationService) {
    }

    initGrid(): void {
      this.dataGrid = new DataGrid(this.env)
      this.dataGrid.urlData = "https://psdev.picosoft.biz/kernel-v1/api/findAllModulesUIs" // web service get data source
      this.dataGrid.urlCount = "https://psdev.picosoft.biz/kernel-v1/api/module-uis/count" // ws get count data source
      this.dataGrid.lazy = true // egal true si web service lazy , par defaut true
      this.dataGrid.id = "id" // id doit etre unique
      this.dataGrid.linkAddButton = "Example/form"
      this.dataGrid.linkEditButton = "Example/edit/"
      this.dataGrid.wsButtonDelete = "this.env.WS.deleteSyncFile"
      this.dataGrid.onRowDblClick = function onRowDblClick(e) {
      }.bind(this) // Une fonction qui est exécutée lorsqu'une ligne est double-cliquée ou double-tapée. Exécuté après onCellDblClick .

      this.dataGrid.columns = [
        {
          caption: "captions.id",
          dataType: "number",
          dataField: "id",
          visible: false,
          allowHeaderFiltering: false,
          sortOrder: "desc"
        },
        {
          caption: "#",
          allowExporting: false,
          dataField: "",
          cellTemplate: "cellTemplateIndex",
          allowHeaderFiltering: false,
          width: "26",
          dataType: "number",
          allowResizing: false,
          allowReordering: false
        },
        {
          caption: "name",
          visible: true,
          dataField: "name",
          allowHeaderFiltering: false,
          allowResizing: false,
          allowReordering: false,
          filterOperations: ['contains', '=', 'notcontains', '<>']
        },
        {
          caption: "label",
          visible: true,
          dataField: "label",
          allowHeaderFiltering: false,
          allowResizing: false,
          allowReordering: false,
          filterOperations: ['contains', '=', 'notcontains', '<>'],
        },
        {
          caption: "url Prod",
          visible: true,
          dataField: "urlProd",
          allowHeaderFiltering: false,
          allowResizing: false,
          allowReordering: false,
          filterOperations: ['contains', '=', 'notcontains', '<>'],
        },
        {
          caption: "Action",
          dataField: "",
          width: "70",
          fixed: true,
          allowHeaderFiltering: false,
          visible: true,
          allowExporting:false,
          fixedPosition: "right",
          cellTemplate: "cellTemplateActions"
        }
      ]
    }

    ngOnInit(): void {
      this.localizationService.setInitialLanguage();
      this.initGrid();
    }
}
