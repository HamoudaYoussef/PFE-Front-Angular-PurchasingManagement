import {Component, OnInit, ViewChild} from '@angular/core';
import {DataGridComponent} from "../data-grid/data-grid.component";
import {DataGrid} from "../data-grid/dataGridClass";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {EnvService} from '../../../../../env.service';
import {FormatDate} from '../../shared-service/formatDate';
import {WsServiceBackend} from '../../shared-service/wsback-end';

@Component({
  selector: 'app-simple-page',
  templateUrl: './simple-page.component.html',
  styleUrls: ['./simple-page.component.scss']
})
export class SimplePageComponent implements OnInit {
   dataGrid2
  @ViewChild(DataGridComponent)
  private dataGridComponent: DataGridComponent;
  public formatNumberDate
  private wsService= new WsServiceBackend()
  constructor(private env:EnvService,private router:Router,private datePipe:DatePipe) {
    // test dataGrid 1
    this.formatNumberDate=new FormatDate(this.env);
    this.dataGrid2=new DataGrid(this.env) // création instance DataGrid
    this.dataGrid2.urlData=""// web service get data source
    this.dataGrid2.urlCount="" // ws get count data source
    this.dataGrid2.lazy=true // egal true si web service lazy , par defaut true
    this.dataGrid2.id="gridGestionModules2" // id obligatoire et unique
    this.dataGrid2.title="Test gataGrid 2" // titre de dataGrid
    this.dataGrid2.returnEvent=false // pour l'evenement mouseover et dxdblclick,  par defaut true
    this.dataGrid2.focusedRowEnabled=false
    this.dataGrid2.showBorders=false
    this.dataGrid2.columns=[
      {
        alignment:undefined,
        allowEditing:true,
        caption:"name",
        cellComponent:null,
        cellRender:null,
        cellTemplate:null,
        columns:undefined,
        cssClass:undefined,
        customizeText:null,
        dataField:"defaultName",
        dataType:"string",
        editCellComponent:null,
        editCellRender:null,
        editCellTemplate:null,
        editorOptions:null,
        encodeHtml:true,
        falseText:false,
        filterOperations:undefined,
        filterType:"include",
        filterValue:undefined,
        filterValues:undefined,
        fixed:false,
        fixedPosition:undefined,
        format:"",
        formItem:null,
        groupCellComponent:null,
        groupCellRender:null,
        groupCellTemplate:null,
        hidingPriority:undefined,
        isBand:undefined,
        minWidth:undefined,
        name:"defaultName",
        ownerBand:undefined,
        renderAsync:false,
        selectedFilterOperation:undefined,
        setCellValue:null,
        sortIndex:undefined,
        sortingMethod:undefined,
        sortOrder:undefined,
        trueText:true,
        type:null,
        validationRules:null,
        visible:true,
        visibleIndex:undefined,
        width:undefined
      },
      {
        alignment:undefined,
        allowEditing:true,
        allowExporting:true,
        allowFiltering:true,
        allowFixing:true,
        allowGrouping:true,
        allowHeaderFiltering:true,
        allowHiding:true,
        allowReordering:true,
        allowResizing:true,
        allowSearch:true,
        allowSorting:true,
        autoExpandGroup:true,
        buttons: [
          {
            component:null,
            cssClass:null,
            disabled:false,
            hint:null,
            icon:null,
            name:null,
            onClick:null,
            render:null,
            template:null,
            text:null,
            visible:true
          }
        ],
        calculateCellValue:null,
        calculateDisplayValue:null,
        calculateFilterExpression:null,
        calculateGroupValue:null,
        calculateSortValue:null,
        caption:"id",
        cellComponent:null,
        cellRender:null,
        cellTemplate:null,
        columns:undefined,
        cssClass:undefined,
        customizeText:null,
        dataField:"id",
        dataType:"number",
        editCellComponent:null,
        editCellRender:null,
        editCellTemplate:null,
        editorOptions:null,
        encodeHtml:true,
        falseText:false,
        filterOperations:undefined,
        filterType:"include",
        filterValue:undefined,
        filterValues:undefined,
        fixed:false,
        fixedPosition:undefined,
        format:"",
        formItem:null,
        groupCellComponent:null,
        groupCellRender:null,
        groupCellTemplate:null,
        groupIndex:undefined,
        headerCellComponent:null,
        headerCellRender:null,
        headerCellTemplate:null,
        headerFilter: {
          allowSearch:false,
          dataSource:null,
          groupInterval:undefined,
          height:undefined,
          searchMode:"contains",
          width:undefined
        },
        hidingPriority:undefined,
        isBand:undefined,
        lookup: {
          allowClearing:false,
          dataSource:null,
          displayExpr:undefined,
          valueExpr:undefined
        },
        minWidth:undefined,
        name:"id",
        ownerBand:undefined,
        renderAsync:false,
        selectedFilterOperation:undefined,
        setCellValue:null,
        showEditorAlways:false,
        showInColumnChooser:true,
        showWhenGrouped:false,
        sortIndex:undefined,
        sortingMethod:undefined,
        sortOrder:undefined,
        trueText:true,
        type:null,
        validationRules:null,
        visible:true,
        visibleIndex:undefined,
        width:undefined
      }
    ] // les columns
  }

   public dataGrid
  ngOnInit(): void {
    // test dataGrid
    this.dataGrid=new DataGrid(this.env)  //création instance DataGrid
    this.dataGrid.urlData=""// web service get data source
    this.dataGrid.urlCount=""// ws get count data source
    this.dataGrid.wsPost="acl-class"// web service get data source
    this.dataGrid.wsPut="acl-class/"// web service get data source
    this.dataGrid.wsDelete="acl-class/"// web service get data source
    this.dataGrid.lazy=true // egal true si web service lazy , par defaut true
    this.dataGrid.id="gridGestionModules3" // id doit etre unique
    this.dataGrid.title="Test gataGrid 2" //  titre
    this.dataGrid.allowedPageSizes = [10,25,100]
    this.dataGrid.stateStoring=false //Le stockage d'état permet au composant d'interface utilisateur d'enregistrer les paramètres appliqués et de les restaurer lors du prochain
    // chargement du composant d'interface utilisateur. Attribuez true à stateStoring
    this.dataGrid.rowAlternationEnabled=false // si vous définissez cette propriété sur true , des lignes d'apparence ordinaire alterneront avec des lignes légèrement ombrées.
    this.dataGrid.selectMode="multiple"  // <!-- "multiple" | "aucun" | "unique" --> Le composant d'interface utilisateur DataGrid prend en charge la sélection de lignes simples et multiples
    this.dataGrid.webServiceSelect=this.env.apiUrlkernel + '' // ws s'il y a un sélect state
     this.dataGrid.onRowDblClick=function onRowDblClick (e) {
       this.router.navigate(["GlobalSettings/Module/" + e.key.id]);
     }.bind(this) // Une fonction qui est exécutée lorsqu'une ligne est double-cliquée ou double-tapée. Exécuté après onCellDblClick .
    // format:"yyyy-MM-dd",
    this.dataGrid.columns=[
      {
        caption:"label",
        dataType:"string",
        dataField:"label",
        allowHeaderFiltering:false,

      },
      {
        allowHeaderFiltering: false,
        caption: "sysdateCreated",
        dataType: "date",
        dataField: "sysdateCreated"
      },
      {
        allowHeaderFiltering:false,
        caption:"sysdateCreated",
        dataType:"datetime",
        dataField:"sysdateUpdated",
        customizeText: function customizeText (cellInfo) {
      return this.formatNumberDate.formatDFTshort(cellInfo.value)
    }.bind(this)
      },
      {
        allowHeaderFiltering:false,
        caption:"Montant",
        dataField:"id",
        dataType:"number",
        format:"#0.000",
      },
      {
        allowHeaderFiltering:false,
        caption:"Montant",
        dataField:"id",
        dataType:"number",
        customizeText: function customizeText (cellInfo) {
          return this.formatNumberDate.DinarNumber(cellInfo.value)
      }.bind(this)
      },
      {
        caption:"table Name",
        dataField:"tableName",
        dataType:"string",
        headerFilter: {
          allowSearch:false,
          dataSource:[{
            text: "kernel.k_pa_users",
            value: ["tableName", "=", "kernel.k_pa_users"]
          },{
            text: "kernel.k_e_pb_report_template",
            value: ["tableName", "=", "kernel.k_e_pb_report_template"]
          },{
            text: "tmm.mm_task",
            value: ["tableName", "=", "tmm.mm_task"]
          },{
            text: "kernel.k_e_files",
            value: ["tableName", "=", "kernel.k_e_files"]
          }],
          groupInterval:undefined,
          height:undefined,
          searchMode:"contains",
          width:undefined
        }
      }
    ]  // Liste des colonnes
  }
}
//     calculateFilterExpression: function calculateFilterExpression(filterValue, selectedFilterOperation) {
//     const column = this as any;
//     // Override implementation for the "between" filter operation
//     if (selectedFilterOperation === "between" && Array.isArray(filterValue)) {
//   const filterExpression = [
//     [column.dataField, ">",filterValue[0]],
//     "and",
//     [column.dataField, "<", filterValue[1]]
//   ];
//   return filterExpression;
// }
//  console.log("toLocaleDateString ",new Date(arguments[0]).toLocaleDateString())
//  console.log("toLocaleTimeString ",new Date(arguments[0]).toLocaleTimeString())
// arguments[0]=new Date(arguments[0]).toLocaleDateString()
// return column.defaultCalculateFilterExpression.apply(column,  arguments);
//   }},
