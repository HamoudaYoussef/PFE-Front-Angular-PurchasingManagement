import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { IOffre, NewOffre } from 'src/app/Models/offre.model';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { OffreService } from 'src/app/Service/offre.service';
import { EnvService } from 'src/env.service';
import dayjs from 'dayjs/esm';
import { IFournisseur } from 'src/app/Models/fournisseur.model';
import { IDemandeAchat } from 'src/app/Models/demande-achat.model';
import { GetOffreByIdComponent } from '../get-offre-by-id/get-offre-by-id.component';
import { MatDialog } from '@angular/material/dialog';
import { BonCommandeService } from 'src/app/Service/bon-commande.service';
import { NewFournisseur } from '../../../../Models/fournisseur.model';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-grid-offre',
  templateUrl: './grid-offre.component.html',
  styleUrls: ['./grid-offre.component.scss']
})
export class GridOffreComponent implements OnInit {

  constructor(private env: EnvService,private offreService: OffreService, private translateService:TranslateService,
    private toastr: ToastrService,private router: Router,private dialog: MatDialog, private bonCommandeService:BonCommandeService) { }

    bcadd: any;
  offres: NewOffre[]; // 
  dataSourceElement: any;
  offre: any;

  dateString = '2024-04-25';
  selectedOption = '';
  offresParFournisseur = [];
  offresParDemandeAchat = [];
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridOffre', {static: false}) dataGridOffre: DxDataGridComponent;
  packageName = require('package.json').name;
  iddoc:any;
  popupDeleteVisible: boolean=false;
  offreadd: any;
  isNewRecord = true;
  visible = false;
  fournisseurs: IFournisseur; // Assurez-vous d'importer IFournisseur depuis votre modèle
  demandeachats: IDemandeAchat;
  demandeAchatIds: number[];



  ngOnInit(): void {
    this.getAllOffre();
    console.log("data",this.dataSourceElement);
  }

  getFournisseurName(offreId: number): Observable<string> {
    return this.offreService.getFournisseurName(offreId);
  }

  popupDelete(id:any) {
    this.popupDeleteVisible=true;
    console.log("DELETE"+this.popupDeleteVisible.toString());
    this.iddoc=id;

  }
  deletedemande() {
    this.offreService.deleteOffre(this.iddoc).subscribe(data=>{
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

  navigateToOffre(event): void {
    const id = event.data.id;
    this.router.navigate(['/Offre/offre', id]);
  }
  Editdemande(id) {
    // Set the ID property
    this.id = id.data.id;
    // Navigate to the add-demande component with the specific ID
    this.router.navigate(['BonCommande/boncommande', this.id]);
}
  navigateToOffreDA(id: number): void {
      this.router.navigate(['/Offre/offre', id]);
  }
  navigateToDetail(offre: NewOffre): void {
    //if (offre && offre.demandeachatId) {
      const demandeachatId = offre.demandeachat.id;
      console.log("idda", demandeachatId);
      this.router.navigate(['/Offre/demandeachat', demandeachatId]);
   /* } else {
      console.error("offre object is null or undefined");
    }*/
  }
  
  openOffreDetail(offre: IOffre): void {
    const dialogRef = this.dialog.open(GetOffreByIdComponent, {
      width: '500px',
      data: { offre: offre }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
 /* deletedemande() {
    this.offreService.deleteOffre(this.iddoc).subscribe(data=>{
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
*/
  fermerPopup() {
    this.popupDeleteVisible=false;
  }
  showbordereaux(id: any) {
    this.router.navigate(["Offre/offre"+id])

  }
  refresh(): void {
    this.dataGridOffre.instance.refresh();
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

 /*   adddemande() {
        // Navigate to the add-demande component without an ID
       this.demandeAchatService.initDemandeAchat().subscribe(data => {
       this.demandeadd = data['id'];
       this.router.navigate(['DemandeAchat/add/'+this.demandeadd]);
      });

    }*/

    getOffre(id) {
        // Set the ID property
        this.id = id.data.id;
        // Navigate to the add-demande component with the specific ID
        this.router.navigate(['Offre/offre', this.id]);
    }
/*  exportGrid() {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGridDemande.instance
    }).then(() => {
      doc.save('Demandes.pdf');
    })
  }*/

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
          template: 'Liste des offres'
        }
    );
      e.toolbarOptions.items.unshift(
          {
              location: 'after',
              widget: 'dxButton',
              options: {
                  hint: 'Add',
                  icon: 'plus',
                //  onClick: this.adddemande.bind(this),
              },
          }
      );

  }
  openAddPage(e) {
    this.popupAdd = true   }
  resetGrid() {
    localStorage.removeItem(this.packageName + '_' + 'dataGridOffre');
    window.location.reload();
  }
  getOffresParFournisseur(): void {
    this.offreService.getOffresParFournisseur().subscribe(response => {
      this.offresParFournisseur = response;
      console.log(this.offresParFournisseur);
    });
  }
  getOffresParDemandeAchat(): void {
    this.offreService.getOffresParDemandeAchat().subscribe(response => {
      this.offresParDemandeAchat = response;
      console.log(this.offresParDemandeAchat);
    });
  }

  onSelectChange(option: string) {
    this.selectedOption = option;
    if (option === 'fournisseur') {
      this.getOffresParFournisseur();
    } else if(option === 'demandeAchat'){
      this.getOffresParDemandeAchat();

    }
  }
  extractDescription(demandeAchat: string): string {
    const match = demandeAchat.match(/description='([^']*)'/);
    return match ? match[1] : 'Description non disponible';
  }
  extractNom(demandeAchat: string): string {
    const match = demandeAchat.match(/nom='([^']*)'/); 
    return match ? match[1] : 'nom non disponible';
  }

  // getAllDemandes() {
  //   this.demandeService.getDemandes().subscribe((data) => {
  //     this.demandes = data;
  //     this.dataSourceElement = new CustomStore({
  //       load: (loadOptions: any) => {
  //         loadOptions.requireTotalCount = true;
  //         const size = loadOptions.take || this.env.pageSize;
  //         const startIndex = loadOptions.skip || 0;
  //         const endIndex = startIndex + size;
  //         const paginatedData = this.demandes.slice(startIndex, endIndex);
  //
  //         return Promise.resolve({
  //           data: paginatedData,
  //           totalCount: this.demandes.length,
  //         });
  //       },
  //     });
  //   });
  // }
  getAllOffre() {
    this.offreService.getOffres().subscribe((data) => {
      this.offres = data.map(offre => {
        this.offreService.getFournisseurName(offre.id).subscribe(fournisseurName => {
          offre.fournisseurName = fournisseurName;
        });
        return offre;
      });

      this.dataSourceElement = new CustomStore({
        load: (loadOptions: any) => {
          loadOptions.requireTotalCount = true;
          const size = loadOptions.take || this.env.pageSize;
          const startIndex = loadOptions.skip || 0;
          const endIndex = startIndex + size;
          const paginatedData = this.offres.slice(startIndex, endIndex);
          return Promise.resolve({
            data: paginatedData,
            totalCount: this.offres.length,
          });
        },
      });
    });
  }
  goBC(offreId: number){
    this.bonCommandeService.initBonCommande(offreId).subscribe(data => {
      console.log('ID Offre:', offreId);
        this.bcadd = data['id'];
        this.router.navigate(['/BonCommande/add', this.bcadd, offreId /*offre.idoffre*/]); // Pass the offer ID
      });
    }
    

}
