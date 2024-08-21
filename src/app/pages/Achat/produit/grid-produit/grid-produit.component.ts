import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DxDataGridComponent, DxTextAreaModule, } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { IProduit, NewProduit } from 'src/app/Models/produit.model';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { ProduitService } from 'src/app/Service/produit.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-grid-produit',
  templateUrl: './grid-produit.component.html',
  styleUrls: ['./grid-produit.component.scss']
})
export class GridProduitComponent implements OnInit {

  constructor(private env: EnvService,private produitService: ProduitService, private translateService:TranslateService,
    private toastr: ToastrService,private router: Router) { }

    produits: NewProduit[] = [];
    formData = {};

    dataSourceElement: any;
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridDemande', {static: false}) dataGridDemande: DxDataGridComponent;
  packageName = require('package.json').name;
  iddoc:any;
  popupDeleteVisible: boolean=false;
  popupAddVisible = false;
  demandeadd: any;
  isNewRecord = true;
  visible = false;

  ngOnInit(): void {
    this.getAllProduits();
    console.log(this.dataSourceElement);

  }
  openAddPopup() {
    this.popupAddVisible = true;
  }

  closeAddPopup() {
    this.popupAddVisible = false;
  }

  saveNewItem() {
    // Handle saving new item logic here
    console.log('New item data:', this.formData);
    this.closeAddPopup();
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
    this.router.navigate(["Demande/add/"+id])

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


/*  exportGrid() {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGridDemande.instance
    }).then(() => {
      doc.save('Demandes.pdf');
    })
  }*/


  openAddPage(e) {
    this.popupAdd = true   }
  resetGrid() {
    localStorage.removeItem(this.packageName + '_' + 'dataGridDemande');
    window.location.reload();
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
          template: 'Liste des demandes d achats'
        }
    );
      e.toolbarOptions.items.unshift(
          {
              location: 'after',
              widget: 'dxButton',
              options: {
                  hint: 'Add',
                  icon: 'plus',
                  onClick: () => this.openAddPopup(),
                },
          }
      );

  }
  adddemande() {
    // Navigate to the add-demande component without an ID
   this.router.navigate(['Produit/add']);
}
Editdemande(id) {
  // Set the ID property
  this.id = id.data.id;
  // Navigate to the add-demande component with the specific ID
  this.router.navigate(['DemandeAchat/demandeAchat', this.id]);
}
deletedemande() {
  this.produitService.deleteProduit(this.iddoc).subscribe(data=>{
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
getAllProduits() {
  this.produitService.getProduits().subscribe((data) => {
    this.produits = data.content;
    this.dataSourceElement = new CustomStore({
      load: () => {
        return Promise.resolve({
          data: this.produits,
          totalCount: data.totalElements,
        });
      },
    });
  });
}

  

}
