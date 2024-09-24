import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { IDemandeDevis, NewDemandeDevis } from 'src/app/Models/demande-devis.model';
import { TokenStorageService } from 'src/app/pages/Global/shared-service/token-storage.service';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { EnvService } from 'src/env.service';
import { IDemandeAchat } from 'src/app/Models/demande-achat.model';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { IFournisseur } from 'src/app/Models/fournisseur.model';

@Component({
  selector: 'app-demande-devis-offre',
  templateUrl: './demande-devis-offre.component.html',
  styleUrls: ['./demande-devis-offre.component.scss']
})
export class DemandeDevisOffreComponent implements OnInit {

  constructor(
    private env: EnvService,
    private demandeDevisService: DemandeDevisService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private fournisseurService:FournisseurService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private produitDemandeeService: ProduitDemandeeService,
    private httpClient: HttpClient
  ) { }

  dataSourceElement: any;
  dataSourceElementD: any;

  dateString = '2024-04-25';
  demandeDevisList: IDemandeDevis[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  pageSize = 10;
  allowedPageSizes = [10, 20, 50];
  @ViewChild('editForm', { static: false }) editForm: DxFormComponent;
  demandes: NewDemandeDevis[]; 
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridDemande', { static: false }) dataGridDemande: DxDataGridComponent;
  packageName = require('package.json').name;
  iddoc: any;
  popupAddVisible = false;
  produits: NewProduitDemandee[] = [];
  popupDeleteVisible: boolean = false;
  demandeadd: any;
  isNewRecord = true;
  visible = false;
  isHovered: { [key: number]: boolean } = {};
  hoverPopupVisible: boolean = false;
  hoverData: any;
  hoverPosition: any = { top: 0, left: 0 };
  totalCount = 0;
  fournisseurs: IFournisseur[] = [];

  @Input() demandeDevisId: number;

  ngOnInit(): void {
    this.getRequestCaseLazy();
    this.fournisseurService.getFournisseurs().subscribe((data: IFournisseur[]) => {
      this.fournisseurs = data;
      console.log("fournisseurs",   data)
    });
 }
 /*onEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent<NewDemandeDevis>) {
  if (e.parentType === 'dataRow' && e.dataField === 'fournissuerID') {
    e.editorOptions.disabled = e.row.data.StateID === undefined;
  }
}*/
  openAddPopup(id: number): void {
      this.demandeDevisId = id;

    this.popupAddVisible = true;
    this.loadProduitsByDemandeDevis();
    console.log(`Open popup for demandeDevis ID: ${id}`);
  }

  closeAddPopup(): void {
    this.popupAddVisible = false;
  }

  popupDelete(id: number): void {
    this.popupDeleteVisible = true;
    this.iddoc = id;
    console.log("DELETE ID: " + this.iddoc);
  }

  refresh(): void {
    this.dataGridDemande.instance.refresh();
  }

  deletedemande(): void {
    this.demandeDevisService.deleteDemandeDevis(this.iddoc).subscribe(
      data => {
        this.refresh();
        this.translateService.get("deleteWithSuccess").subscribe(
          res => {
            this.toastr.success(res, "", {
              closeButton: true,
              positionClass: 'toast-top-right',
              extendedTimeOut: this.env.extendedTimeOutToastr,
              progressBar: true,
              disableTimeOut: false,
              timeOut: this.env.timeOutToastr
            });
          }
        );
        this.popupDeleteVisible = false;
      },
      error => {
        this.toastr.error(error.error.message, "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr
        });
      }
    );
  }

  fermerPopup(): void {
    this.popupDeleteVisible = false;
  }

  Editdemande(id: number): void {
    this.router.navigate(['DemandeDevis/demandeDevis', id]);
  }

  getAllDemandes(): void {
    this.demandeDevisService.getDemandesDevis().subscribe((response: NewDemandeDevis[]) => {
      this.dataSourceElement = new CustomStore({
        load: () => {
          return Promise.resolve({
            data: response,
            totalCount: response.length
          });
        },
      });
    }, (error) => {
      console.error('Error fetching demande devis:', error);
      this.errorMessage = 'Erreur lors de la récupération des données.';
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
            
            
            return this.httpClient.get(this.env.urlProject + 'demande-devis/getDD?' + params, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
                .toPromise()
                .then((data: any) => {
                    
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

  loadProduitsByDemandeDevis(): void {
    this.produitDemandeeService.getProduitDemandeByDemandeDevisId(this.demandeDevisId).subscribe(
      produits => {
        this.produits = produits;
        this.dataSourceElementD = new CustomStore({
          load: (loadOptions: any) => {
            loadOptions.requireTotalCount = true;
            const size = loadOptions.take || this.env.pageSize;
            const startIndex = loadOptions.skip || 0;
            const endIndex = startIndex + size;
            const paginatedData = this.produits.slice(startIndex, endIndex);

            return Promise.resolve({
              data: paginatedData,
              totalCount: this.produits.length,
            });
          },
        });
      },
      error => {
        console.log('Une erreur s\'est produite lors du chargement des produits : ', error);
      }
    );
  }
}
