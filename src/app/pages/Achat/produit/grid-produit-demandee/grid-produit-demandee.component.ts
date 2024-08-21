import { Component, OnInit, ViewChild } from '@angular/core';
import { EnvService } from 'src/env.service';
import { ProduitDemandeeService } from '../../../../Service/produit-demandee.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-grid-produit-demandee',
  templateUrl: './grid-produit-demandee.component.html',
  styleUrls: ['./grid-produit-demandee.component.scss']
})
export class GridProduitDemandeeComponent implements OnInit {

  constructor(private env: EnvService,private produitDemandeeService: ProduitDemandeeService, private translateService:TranslateService,
    private toastr: ToastrService,private router: Router, private route:ActivatedRoute) { }
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
    this.getAllPD();
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
        this.router.navigate(['DemandeAchat/demandeAchat', this.id]);
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

