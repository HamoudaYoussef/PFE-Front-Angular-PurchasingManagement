import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataGrid} from "../data-grid/dataGridClass";
import {HttpServicesComponent} from "../http-services/http-services.component";
import {HttpParam, HttpParamMethodDelete, HttpParamMethodGet} from "../class";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenStorageService} from "../../shared-service/token-storage.service";
import {EnvService} from "../../../../../env.service";
import {ColorState} from "../../shared-service/colorState";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Input('webService') select:object
  @Output('itemSelected') itemSelected = new EventEmitter();
  public data
  @ViewChild(HttpServicesComponent)
  public httpServicesComponent: HttpServicesComponent;
  constructor(private tokenStorage:TokenStorageService,private http: HttpClient,private env:EnvService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.getData()
  }

  getData(){
    let paramsHttp = new HttpParamMethodGet(this.select['ws'],'',null,[] ,true)
    let resultat = this.httpServicesComponent.method(paramsHttp).then(data=>{
      if(data['statut']==true){
        this.data=data['value']
      }
    })
    // this.http.get(this.webService, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken())}).subscribe(data=>{
    //   this.data=data;
    // },error => {
    //   this.data=[
    //     {
    //       "id": 23,
    //       "name": "APPROVED",
    //       "description": null,
    //       "label": "Accordé",
    //       "color": "#24bf48",
    //       "classes": {
    //         "id": 9,
    //         "classe": "biz.picosoft.ordermission.domain.OrdreDeMission",
    //         "simpleName": "OrdreDeMission",
    //         "label": "OrdreDeMission",
    //         "tableName": "kernel.mm_ordre_mission_frais",
    //         "defaultState": {
    //           "id": 7,
    //           "name": "DRAFT",
    //           "description": null,
    //           "label": "Brouillon",
    //           "color": "#349fbf"
    //         },
    //         "sysdateCreated": "2021-12-27T08:46:06Z",
    //         "sysdateUpdated": "2022-01-28T14:33:31Z",
    //         "syscreatedBy": null,
    //         "sysupdatedBy": "root"
    //       }
    //     },
    //     {
    //       "id": 22,
    //       "name": "SUBMITTED",
    //       "description": null,
    //       "label": "Déposé",
    //       "color": "#6b7ec7",
    //       "classes": {
    //         "id": 9,
    //         "classe": "biz.picosoft.ordermission.domain.OrdreDeMission",
    //         "simpleName": "OrdreDeMission",
    //         "label": "OrdreDeMission",
    //         "tableName": "kernel.mm_ordre_mission_frais",
    //         "defaultState": {
    //           "id": 7,
    //           "name": "DRAFT",
    //           "description": null,
    //           "label": "Brouillon",
    //           "color": "#349fbf"
    //         },
    //         "sysdateCreated": "2021-12-27T08:46:06Z",
    //         "sysdateUpdated": "2022-01-28T14:33:31Z",
    //         "syscreatedBy": null,
    //         "sysupdatedBy": "root"
    //       }
    //     },
    //     {
    //       "id": 21,
    //       "name": "CANCELED",
    //       "description": null,
    //       "label": "Annulé",
    //       "color": "#eb2626",
    //       "classes": {
    //         "id": 9,
    //         "classe": "biz.picosoft.ordermission.domain.OrdreDeMission",
    //         "simpleName": "OrdreDeMission",
    //         "label": "OrdreDeMission",
    //         "tableName": "kernel.mm_ordre_mission_frais",
    //         "defaultState": {
    //           "id": 7,
    //           "name": "DRAFT",
    //           "description": null,
    //           "label": "Brouillon",
    //           "color": "#349fbf"
    //         },
    //         "sysdateCreated": "2021-12-27T08:46:06Z",
    //         "sysdateUpdated": "2022-01-28T14:33:31Z",
    //         "syscreatedBy": null,
    //         "sysupdatedBy": "root"
    //       }
    //     },
    //     {
    //       "id": 20,
    //       "name": "CLOSED",
    //       "description": null,
    //       "label": "Clôturé",
    //       "color": "#d94c4c",
    //       "classes": {
    //         "id": 9,
    //         "classe": "biz.picosoft.ordermission.domain.OrdreDeMission",
    //         "simpleName": "OrdreDeMission",
    //         "label": "OrdreDeMission",
    //         "tableName": "kernel.mm_ordre_mission_frais",
    //         "defaultState": {
    //           "id": 7,
    //           "name": "DRAFT",
    //           "description": null,
    //           "label": "Brouillon",
    //           "color": "#349fbf"
    //         },
    //         "sysdateCreated": "2021-12-27T08:46:06Z",
    //         "sysdateUpdated": "2022-01-28T14:33:31Z",
    //         "syscreatedBy": null,
    //         "sysupdatedBy": "root"
    //       }
    //     },
    //     {
    //       "id": 19,
    //       "name": "REFUND",
    //       "description": null,
    //       "label": "Remboursement",
    //       "color": "#d6d445",
    //       "classes": {
    //         "id": 9,
    //         "classe": "biz.picosoft.ordermission.domain.OrdreDeMission",
    //         "simpleName": "OrdreDeMission",
    //         "label": "OrdreDeMission",
    //         "tableName": "kernel.mm_ordre_mission_frais",
    //         "defaultState": {
    //           "id": 7,
    //           "name": "DRAFT",
    //           "description": null,
    //           "label": "Brouillon",
    //           "color": "#349fbf"
    //         },
    //         "sysdateCreated": "2021-12-27T08:46:06Z",
    //         "sysdateUpdated": "2022-01-28T14:33:31Z",
    //         "syscreatedBy": null,
    //         "sysupdatedBy": "root"
    //       }
    //     },
    //     {
    //       "id": 7,
    //       "name": "DRAFT",
    //       "description": null,
    //       "label": "Brouillon",
    //       "color": "#349fbf",
    //       "classes": {
    //         "id": 9,
    //         "classe": "biz.picosoft.ordermission.domain.OrdreDeMission",
    //         "simpleName": "OrdreDeMission",
    //         "label": "OrdreDeMission",
    //         "tableName": "kernel.mm_ordre_mission_frais",
    //         "defaultState": {
    //           "id": 7,
    //           "name": "DRAFT",
    //           "description": null,
    //           "label": "Brouillon",
    //           "color": "#349fbf"
    //         },
    //         "sysdateCreated": "2021-12-27T08:46:06Z",
    //         "sysdateUpdated": "2022-01-28T14:33:31Z",
    //         "syscreatedBy": null,
    //         "sysupdatedBy": "root"
    //       }
    //     }
    //   ]
    // })
  }
  colorState = new ColorState(this.env, this.http, this.tokenStorage)
  onValueChange(e: any){
    this.itemSelected.emit({displayExpr:this.select['itemFilter']+this.select['op'],valueExpr:e.value})
  }
}