import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { EnvService } from 'src/env.service';
import { NewDemandeAchat } from '../../../../Models/demande-achat.model';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-demande-achat-valid',
  templateUrl: './demande-achat-valid.component.html',
  styleUrls: ['./demande-achat-valid.component.scss']
})
export class DemandeAchatValidComponent implements OnInit {

  constructor(private env: EnvService,private demandeAchatService: DemandeAchatService, private translateService:TranslateService,
    private toastr: ToastrService,private router: Router) { }

    demandes: NewDemandeAchat[]; // Update the type to Demande
    dataSourceElement: any;
    dateString = '2024-04-25';
    pageSize = this.env.pageSize;
    allowedPageSizes = this.env.allowedPageSizes;
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    @ViewChild('dataGridDemande', {static: false}) dataGridDemande: DxDataGridComponent;
    packageName = require('package.json').name;
    iddoc:any;
    popupDeleteVisible: boolean=false;
    demandeadd: any;
    isNewRecord = true;
    visible = false;
  

  ngOnInit(): void {
    this.getValidDemandes();
  }



  getValidDemandes() {
    this.demandeAchatService.getDemandesTerminees().subscribe((data) => {
      this.demandes = data;
      this.dataSourceElement = new CustomStore({
        load: (loadOptions: any) => {
          loadOptions.requireTotalCount = true;
          const size = loadOptions.take || this.env.pageSize;
          const startIndex = loadOptions.skip || 0;
          const endIndex = startIndex + size;
          const paginatedData = this.demandes.slice(startIndex, endIndex);

          return Promise.resolve({
            data: paginatedData,
            totalCount: this.demandes.length,
          });
        },
      });
    });

  }

  fermerPopup() {
    this.popupDeleteVisible=false;
  }
  refresh(): void {
    this.dataGridDemande.instance.refresh();
  }
  deletedemande() {
    this.demandeAchatService.deleteDemandeAchat(this.iddoc).subscribe(data=>{
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
            })
          }
      )
      this.popupDeleteVisible = false;
    }, error => {
      this.toastr.error(error.error.message, "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        progressBar: true,
        disableTimeOut: false,
        timeOut: this.env.timeOutToastr
      })
    })

  }
  showbordereaux(id: any) {
    this.router.navigate(["Demande/add/"+id])

  }
  popupDelete(id:any) {
    this.popupDeleteVisible=true;
    console.log("DELETE"+this.popupDeleteVisible.toString());
    this.iddoc=id;

  }

}
