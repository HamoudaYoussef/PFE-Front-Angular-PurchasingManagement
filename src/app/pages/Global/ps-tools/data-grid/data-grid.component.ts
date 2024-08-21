import {Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import CustomStore from "devextreme/data/custom_store";
import {DxDataGridComponent} from "devextreme-angular/ui/data-grid";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {DataGrid} from "./dataGridClass";
import { OptionChangedEvent } from "devextreme/ui/data_grid"
import {
    HttpParamMethodDelete, HttpParamMethodGet,
    HttpParamMethodPost,
    HttpParamMethodPut,
} from "../class";
import {ToastrService} from "ngx-toastr";
import {TokenStorageService} from "../../shared-service/token-storage.service";
import {EnvService} from "../../../../../env.service";
import {Export} from "../../shared-service/export";
import {DataGridService} from "./data-grid.service";



@Component({
    selector: 'app-data-grid',
    templateUrl: './data-grid.component.html',
    styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent implements OnInit {
    public allowedPageSizes = this.env.allowedPageSizes;
    public pageSize = this.env.pageSize
    dataSource: any;
    @Input('dataGrid') dataGrid: DataGrid
    @ViewChild(DxDataGridComponent, {static: false}) dataGridHTML: DxDataGridComponent;
    public displayCount=0
    @Output('event') event = new EventEmitter();
    public modele

    constructor(private translateService: TranslateService,
                private tokenStorage: TokenStorageService,
                private router: Router,
                private env: EnvService,
                private toastr: ToastrService,
                private dataGridService: DataGridService
    ) {
        if (this.tokenStorage.getToken() == null) {
            this.router.navigate(['/login']);
        }

        this.dataSource = new CustomStore({
                key: (this.dataGrid && this.dataGrid.key && this.dataGrid.key != null)? this.dataGrid.key : "id",
                load: async  function (loadOptions: any) {
                    loadOptions.requireTotalCount = true
                    if (loadOptions.take === undefined) loadOptions.take = 10
                    if (loadOptions.skip === undefined) loadOptions.skip = 0
                    let resultat = this.dataGridService.getAllLazyWithoutCount(this.dataGrid.pageable,loadOptions, this.dataGrid.urlData,this.dataGrid.urlCount,this.dataGridHTML.paging,this.selectRequest)
                    return resultat.then(data => {
                        return {
                            data: data.value['content'],
                            totalCount: data.value['totalElements'],
                            pageSize: data.value['size']
                        }
                    })

                }.bind(this),
                insert: (values) => {
                    let paramsHttp = new HttpParamMethodPost(this.dataGrid.wsPost, values)
                    let resultat = this.dataGridService.method(paramsHttp)
                    this.refreshgrid()
                    return values
                },
                update: (key, values) => {

                    let object = this.modele.find(({id}) => id === key)
                    for (const [name, value] of Object.entries(values)) {
                        object[name] = value
                    }
                    let paramsHttp = new HttpParamMethodPut(this.dataGrid.wsPut, object)
                    let resultat = this.dataGridService.method(paramsHttp)
                    this.refreshgrid()
                    return values
                },
                remove: (key) => {
                    let paramsHttp = new HttpParamMethodDelete(this.dataGrid.wsDelete, key)
                    let resultat = this.dataGridService.method(paramsHttp)
                    this.refreshgrid()
                    return key
                },
            }
        )

    }

    navigateEdit(e) {
        if (e !== undefined && e !== null)
            this.router.navigate([this.dataGrid.linkEditButton + e]);
        else {
            this.toastr.error("ID undefined", "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        }
    }

    navigateDisplay(e) {
        if (e !== undefined && e !== null)
            this.router.navigate([this.dataGrid.linkSowButton + e]);
        else {
            this.toastr.error("ID undefined", "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        }
    }

    public popUpDelete = false
    public idDelete

    deletePopUp(e) {
        if (e !== undefined && e !== null) {
            this.idDelete = e
            this.popUpDelete = true
        } else {
            this.toastr.error("ID undefined", "", {
                closeButton: true,
                positionClass: 'toast-top-right',
                extendedTimeOut: this.env.extendedTimeOutToastr,
                progressBar: true,
                disableTimeOut: false,
                timeOut: this.env.timeOutToastr
            })
        }
    }

    deletews() {
        let paramsHttp = new HttpParamMethodDelete(this.dataGrid.wsButtonDelete, this.idDelete)
        let resultat = this.dataGridService.method(paramsHttp)
        this.refreshgrid()
        this.popUpDelete = false
    }

    public storageKey
    public selectRequest=[]
    ngOnInit(): void {

    }
    ngAfterViewInit(){
        this.storageKey = this.dataGrid.id
        this.dataGridHTML.columns = this.dataGrid.columns;
        this.showIndex()
    }
    getNotLazy(){

        this.dataSource =[]
        let paramsHttp = new HttpParamMethodGet(this.dataGrid.urlData,"",null,[])

        this.dataGridService.method(paramsHttp).then(data => {

            this.dataSource=data["value"]
            //this.displayCount= this.dataSource.length
        })
    }
    loadState() {
        return JSON.parse(localStorage.getItem(this.storageKey))
    }
    showIndex(){
        if(this.dataGrid.showCellTemplateIndex==false) {
            setTimeout(res => {
                let index = this.dataGrid["_columns"].findIndex((object) => {
                    return object["cellTemplate"] === "cellTemplateIndex";
                });
                if (index !== -1) {
                    this.dataGrid["_columns"].splice(index, 1);
                }
            }, 1)
        }
    }
    saveState(state) {

        for (let item in state) {
            if (item == "pageSize") delete state[item];
            if (item == "allowedPageSizes") delete state[item];
            if (item == "pageIndex") delete state[item];
        }
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }
    // exportGridToPDF() {
    //     Export.exportGridToPDF(this.dataGridHTML.instance)
    // }


    onExporting(e) {
        let name
        let le
        let par

        if (e.format === 'xlsx') {
            if(this.dataGrid.title)
            {name = this.dataGrid.title}
            else
            {name = this.dataGridHTML.instance['_$element'][0].id}

            this.translateService.get("le").subscribe((res) => {
                le = res
            })
            this.translateService.get("par").subscribe((res) => {
                par = res
            })
            Export.exportGridToExcel(e, name, le, par)
        }
        else if (e.format === 'pdf') {
            Export.exportGridToPDF(this.dataGridHTML.instance)
        }
    }

    onToolbarPreparing(e) {
        // e.toolbarOptions.items.unshift(
        //     {
        //         location: 'after',
        //         template: 'ExportPDF'
        //     })
        if (this.dataGrid.stateStoring) {
            e.toolbarOptions.items.unshift(
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        hint: 'reset',
                        icon: 'undo',
                        onClick: this.resetGrid.bind(this),
                    }
                });
        }
        e.toolbarOptions.items.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
                hint: 'Refresh',
                icon: 'refresh',
                onClick: this.refreshgrid.bind(this),
            },
        });
        this.dataGrid.ButtonsonToolbarPreparing.forEach(element => {
            e.toolbarOptions.items.unshift(
                {
                    location: element['location'] ? element['location'] : "after",
                    visible:element['visible']!=null && element['visible']!=undefined? element['visible'] :true,
                    widget: 'dxButton',
                    options: {
                        disabled:element["disabled"],
                        text: element["text"],
                        width:element["width"],
                        hint: element["hint"],
                        icon: element["icon"],
                        onClick: element["onClick"],
                    }
                });
        })



        if (this.dataGrid.linkAddButton != null && this.dataGrid.linkAddButton != undefined && this.dataGrid.linkAddButton != "") {
            e.toolbarOptions.items.unshift({
                location: 'after',
                widget: 'dxButton',
                options: {
                    hint: 'Ajouter',
                    icon: 'plus',
                    onClick: this.openAddPage.bind(this),
                },
            });
        }
        e.toolbarOptions.items.unshift(
            {
                location: 'center',
                template: 'titreGrid'
            }
        )
        if (this.dataGrid.select) {
            e.toolbarOptions.items.unshift(
                {
                    location: 'before',
                    template: 'select-filter'
                }
            )
        }
    }

    openAddPage() {
        this.router.navigate([this.dataGrid.linkAddButton]);
    }
    refreshdataGridSelect(e){
        let result= this.selectRequest.find(({displayExpr}) => displayExpr === e.displayExpr)
        if(result){
            let index = this.selectRequest.findIndex(item => item.displayExpr ===  e.displayExpr);
            this.selectRequest.splice(index,1)
            result.valueExpr=e.valueExpr
            this.selectRequest.push(result)
        }else{
            this.selectRequest.push(e)
        }
        this.refreshgrid()
    }
    refreshgrid() {
        if(this.dataGrid.lazy ==true) {
            this.dataGridHTML.instance.refresh();
        }else {
            this.getNotLazy()
        }
    }




    public itemSelected: string = ""

    refreshdataGrid(e) {
        this.itemSelected = e
        this.refreshgrid()
    }

    resetGrid() {
        localStorage.removeItem(this.dataGrid.id);
        window.location.reload();
    }

    onRowDblClick(e) {
        if (this.dataGrid["eventDBLClickDataGrid"] != null && this.dataGrid["eventDBLClickDataGrid"] != undefined)
            this.dataGrid["eventDBLClickDataGrid"](e)
    }
    setItem(name , value){

        this.dataGridHTML[name]=value
        this.dataGridHTML.instance.repaint();

    }
    setDataSource(datasource:[]){
        this.dataSource=datasource;
        this.displayCount=this.dataSource.length
        // this.dataSource.load();
        // this.dataGridHTML.instance.repaint();
    }

    gridOptionChanged(e: OptionChangedEvent) {
        if (e.fullName.includes("pageSize")) {
            if (e.value > e.previousValue)
                e.component.refresh();
        }
    }

    protected readonly localStorage = localStorage;
}

