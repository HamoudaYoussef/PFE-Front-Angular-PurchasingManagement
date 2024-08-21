import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { EnvService } from 'src/env.service';
import { NewDemandeDevis } from '../../../../Models/demande-devis.model';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grid-demande-devis',
  templateUrl: './grid-demande-devis.component.html',
  styleUrls: ['./grid-demande-devis.component.scss']
})
export class GridDemandeDevisComponent implements OnInit {

  constructor(private env: EnvService,private demandeDevisService: DemandeDevisService, private translateService:TranslateService,
    private toastr: ToastrService,private router: Router, private route:ActivatedRoute) { }
  dataSourceElement: any;
  dateString = '2024-04-25';
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  @ViewChild('editForm', { static: false }) editForm: DxFormComponent;
   demandes: NewDemandeDevis[]; // Update the type to Demande
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
    this.getAllDemandes();
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
  deletedemande() {
    this.demandeDevisService.deleteDemandeDevis(this.iddoc).subscribe(data=>{
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
        this.router.navigate(['DemandeAchat/demandeAchat', this.id]);
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
                  onClick: this.adddemande.bind(this),
              },
          }
      );

  }
  openAddPage(e) {
    this.popupAdd = true   }
  resetGrid() {
    localStorage.removeItem(this.packageName + '_' + 'dataGridDemande');
    window.location.reload();
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
  getAllDemandes() {
    this.demandeDevisService.getDemandesDevis().subscribe((data) => {
      this.demandes = data.map(demandeDevis => {
        this.demandeDevisService.getFournisseurName(demandeDevis.id).subscribe(fournisseurName => {
          demandeDevis.fournisseurName = fournisseurName;
        });
        return demandeDevis;
      });  
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

  getFournisseurName(demandeDevisId: number): Observable<string> {
    return this.demandeDevisService.getFournisseurName(demandeDevisId);
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
}
