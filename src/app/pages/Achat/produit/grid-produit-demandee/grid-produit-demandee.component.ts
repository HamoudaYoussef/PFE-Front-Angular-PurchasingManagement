import { Component, OnInit, ViewChild } from '@angular/core';
import { EnvService } from 'src/env.service';
import { ProduitDemandeeService } from '../../../../Service/produit-demandee.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/pages/Global/shared-service/token-storage.service';

@Component({
  selector: 'app-grid-produit-demandee',
  templateUrl: './grid-produit-demandee.component.html',
  styleUrls: ['./grid-produit-demandee.component.scss']
})
export class GridProduitDemandeeComponent implements OnInit {

  constructor(private env: EnvService,private produitDemandeeService: ProduitDemandeeService, private translateService:TranslateService,
    private toastr: ToastrService,private tokenStorage: TokenStorageService,private router: Router, private route:ActivatedRoute,private httpClient:HttpClient) { }
  dataSourceElement: any;
  dateString = '2024-04-25';
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  @ViewChild('editForm', { static: false }) editForm: DxFormComponent;
   produitDemandees: NewProduitDemandee[]; // Update the type to Demande
 @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridDemande', {static: false}) dataGridDemande: DxDataGridComponent;
  packageName = require('package.json').name;
  iddoc:any;
  popupDeleteVisible: boolean=false;
  demandeadd: any;
  isNewRecord = true;
  visible = false;
  isHovered: { [key: number]: boolean } = {}; // Pour garder une trace des lignes survolées
  hoverPopupVisible: boolean = false;
  hoverData: any;
  hoverPosition: any = { top: 0, left: 0 };

  ngOnInit(): void {
    this.getRequestCaseLazy();
    console.log(this.dataSourceElement);
  }

  onRowHoverEnter(data) {
    this.isHovered[data.data.id] = true; // Activer le composant lorsque le curseur entre dans la ligne
  }
  
  onRowHoverLeave(data) {
    this.isHovered[data.data.id] = false; // Désactiver le composant lorsque le curseur quitte la ligne
  }
  popupDelete(id:any) {
    this.popupDeleteVisible=true;
    console.log("DELETE"+this.popupDeleteVisible.toString());
    this.iddoc=id;

  }
  fermerPopup() {
    this.popupDeleteVisible=false;
  }
  showbordereaux(id: any) {
    this.router.navigate(["DemandeAchat/demandeAchat"+id])

  }
  refresh(): void {
    this.dataGridDemande.instance.refresh();
  }
  popupAdd
  popupEdit
  add(e){
    this.popupAdd = e
    this.popupEdit = e
    this.refresh()
  }
  id
  Editclient(id) {
    this.id = id.data.id
    console.log(this.id)
    this.popupEdit = true

  }

    adddemande() {
        // Navigate to the add-demande component without an ID
        const demandeId = +this.route.snapshot.paramMap.get('id'); // Remplacez ceci par l'ID réel ou dynamique
       this.router.navigate(['DemandeDevis/allDemandesDevis/produitDemandee']);
    }

    Editdemande(id) {
        // Set the ID property
        this.id = id.data.id;
        // Navigate to the add-demande component with the specific ID
        this.router.navigate(['Produit/produitsDemandee', this.id]);
    }

  onToolbarPreparing(e) {


    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          template: 'ExportPDF'
        });
    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          widget: 'dxButton',
          options: {
            hint: 'Reset',
            icon: 'undo',
            onClick: this.resetGrid.bind(this),
          }
        });
    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          widget: 'dxButton',
          options: {
            hint: 'Refresh',
            icon: 'refresh',
            onClick: this.refresh.bind(this),
          }
        });

    e.toolbarOptions.items.unshift(
        {
          location: 'center',
          template: 'Liste des produits demandées'
        }
    );
 

  }
  openAddPage(e) {
    this.popupAdd = true   }
  resetGrid() {
    localStorage.removeItem(this.packageName + '_' + 'dataGridDemande');
    window.location.reload();
  }
   

  getAllPD() {
    this.produitDemandeeService.getProduitsDemandees().subscribe((data: any) => {
      this.produitDemandees = data.content; // Assurez-vous que data.content contient la liste des éléments
      this.dataSourceElement = new CustomStore({
        load: () => {
          return Promise.resolve({
            data: this.produitDemandees,
            totalCount: data.totalElements, // Assurez-vous que data.totalElements contient le nombre total d'éléments
          });
        },
      });
    });
  }
  getRequestCaseLazy() {
    let size = this.env.pageSize
    this.dataSourceElement = new CustomStore({
          key: 'id',
          load: function (loadOptions: any) {
            loadOptions.requireTotalCount = true
            var params = "";
            if (loadOptions.take == undefined) loadOptions.take = size;
            if (loadOptions.skip == undefined) loadOptions.skip = 0;

            //size
            params += 'size=' + loadOptions.take || size;
            //page
            params += '&page=' + loadOptions.skip / loadOptions.take || 0;

            //sort
            if (loadOptions.sort) {
              if (loadOptions.sort[0].desc)
                params += '&sort=' + loadOptions.sort[0].selector + ',desc';
              else
                params += '&sort=' + loadOptions.sort[0].selector + ',asc';
            }

            let tab: any[] = [];
            if (loadOptions.filter) {
              if (loadOptions.filter[1] == 'and') {
                for (var i = 0; i < loadOptions.filter.length; i++) {
                  if (loadOptions.filter[i][1] == 'and') {
                    for (var j = 0; j < loadOptions.filter[i].length; j++) {
                      if (loadOptions.filter[i][j] != 'and') {
                        if (loadOptions.filter[i][j][1] == 'and') {
                          tab.push(loadOptions.filter[i][j][0]);
                          tab.push(loadOptions.filter[i][j][2]);
                        } else
                          tab.push(loadOptions.filter[i][j]);
                      }
                    }
                  } else tab.push(loadOptions.filter[i]);
                }
              } else
                tab.push([loadOptions.filter[0], loadOptions.filter[1], loadOptions.filter[2]]);
            }

            let q: any[] = [];
            let reqRechercherAnd: any[] = [];

            for (let i = 0; i < tab.length; i++) {
              
              if (tab[i] !== undefined && tab[i] !== null) {
                if (tab[i][0] == 'startDate' || tab[i][0] == 'sysdateCreated' || tab[i][0] == 'sysdateUpdated' || tab[i][0] == 'dateTimeFrom' || tab[i][0] == 'dateTimeUntil') {
                  let isoDate = new Date(tab[i][2]).toISOString();
                  tab[i][2] = isoDate;
                }
                let operateur;
                switch (tab[i][1]) {
                  case ('notcontains'): {
                    operateur = 'doesNotContain';
                    break;
                  }
                  case  'contains': {
                    operateur = 'contains';

                    break;
                  }
                  case '<>' : {
                  
                    operateur = 'notEquals';
                    break;
                  }
                  case  '=': {
                    operateur = 'equals';
                    break;
                  }
                  case 'endswith': {
                    // q.push("(" + tab[i][0] + ":*" + tab[i][2] + ")");
                    break;
                  }
                  case  'startswith': {
                    //  q.push("(" + tab[i][0] + ":" + tab[i][2] + "*" + ")");
                    break;
                  }
                  case  '>=': {
                    
                    operateur = 'greaterThanOrEqual';
                    break;
                  }
                  case  '>': {
                    operateur = 'greaterThanOrEqual';
                    break;
                  }
                  case  '<=': {
                    operateur = 'lessOrEqualThan';
                    break;
                  }
                  case  '<': {
                    
                    operateur = 'lessOrEqualThan';
                    break;
                  }
                  case 'or' : {
                    console.log("test")
                    if (typeof (tab[i][0]) == "object") {
                      console.log("partie",tab[i][0][0])
                      let ch = ""
                      loadOptions.filter.forEach(element => {
                        console.log("element",element)
                        if (element[2] != null && element[2] != undefined && element[2] != "") {
                          ch += element[2] + ","
                        }
                      });
                      paramsCount += '&';
                      paramsCount += tab[i][0][0] + "." + "in=" + ch
                      paramsCount += ',';
                      params += '&';

                      if(tab[i][0][0]==='caseType.caseTypeName'){
                        params += 'caseTypeLabel' + "." + "in=" + ch
                      }else{
                        params += tab[i][0][0] + "." + "in=" + ch

                      }
                    } else
                      operateur = "notEquals"

                    break;
                  }
                }
                if (operateur !== null && operateur !== undefined && operateur != '') {
                  if (tab[i][0] == 'arrivedDatetime') {
                    paramsCount += '&';
                    paramsCount += tab[i][0] + '.' + operateur + '=' + new Date(tab[i][2]).toISOString();
                    paramsCount += ',';
                    params += '&';
                    params += tab[i][0] + '.' + operateur + '=' + new Date(tab[i][2]).toISOString();

                  } else {

                    paramsCount += '&';
                    paramsCount += tab[i][0] + '.' + operateur + '=' + tab[i][2];
                    paramsCount += ',';
                    params += '&';

                    params += tab[i][0] + '.' + operateur + '=' + tab[i][2];
                  }

                }
              }
            }

            let f: string = "";
            if (q.length != 0) f += q[0];
            for (let i = 1; i < q.length; i++) {
              f += "&" + q[i];
            }
            if (f.length != 0) params += "&" + f

            var paramsCount = ""
            var tabCount = []
            tabCount = params.split('&')
            if (tabCount.length > 2) paramsCount += "?"
            for (let i = 3; i < tabCount.length; i++) {
              paramsCount += tabCount[i]
              paramsCount += "&"
            }
            params+= '&sort=id,desc'
            
            
            return this.httpClient.get(this.env.urlProject + 'produit-demandees?' + params, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
                .toPromise()
                .then((data: any) => {
                  size = data.totalElements

                      return {data: data.content, totalCount: data.totalElements};

                    },
                    error => {
                      this.toastr.error("خطأ في تحميل البيانات ", "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                      })
                    })

          }.bind(this)
        }
    );
  }
  onCellHoverChanged(event: any) {
    if (event.eventType === 'mouseenter') {
      this.hoverData = event.data;
      this.hoverPosition = {
        top: event.event.clientY,
        left: event.event.clientX
      };
      this.hoverPopupVisible = true;
    } else if (event.eventType === 'mouseleave') {
      this.hoverPopupVisible = false;
    }
  }  
  getRowCssClass(rowData: any): string {
    return rowData.data.isMatch ? '' : 'highlight-non-match';
  }
  


  onRowPrepared(e: any) {
    if (e.rowType === 'data') {
      if (e.data.isMatch) {
        e.rowElement.style.backgroundColor = 'lightgreen';
      } else {
        e.rowElement.style.backgroundColor = 'lightcoral';
      }
    }
  }
  getRowCellStyle(rowData) {
    if (rowData.isMatch) {
      return { backgroundColor: 'lightgreen', fontWeight: 'bold' };
    } else {
      return { backgroundColor: 'lightcoral', fontWeight: 'bold' };
    }
  }
}

