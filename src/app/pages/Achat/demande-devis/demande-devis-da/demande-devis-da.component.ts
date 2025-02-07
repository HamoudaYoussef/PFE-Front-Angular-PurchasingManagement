import { Component, OnInit, ViewChild } from '@angular/core';
import { IProduitDemandee, NewProduitDemandee } from '../../../../Models/produit-demandee.model';
import { DemandeDevisService } from 'src/app/Service/demande-devis.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { DevisDaSharedService } from '../../../../Service/devis-da-shared.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FournisseurService } from 'src/app/Service/fournisseur.service';

@Component({
  selector: 'app-demande-devis-da',
  templateUrl: './demande-devis-da.component.html',
  styleUrls: ['./demande-devis-da.component.scss']
})
export class DemandeDevisDaComponent implements OnInit {

  fournisseurs: any[] = []; // Array to store the list of fournisseurs

  dataSourceElement: NewProduitDemandee[] = [];
  selectedRowsData: NewProduitDemandee[];
  selectedProducts: any[] = [];
  dateHeaderFilter = [
    { text: 'Dernier mois', value: this.getLastMonthRange() },
    { text: 'Dernière année', value: this.getLastYearRange() },
    { text: 'Derniers 30 jours', value: this.getLast30DaysRange() },
    // Ajouter d'autres plages ou options de filtres selon les besoins
  ];

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  constructor(private demandeDevisService: DemandeDevisService,private fb:FormBuilder,
    private router: Router,private devisDaSharedService :DevisDaSharedService,private fournisseurService:FournisseurService) { }

  ngOnInit(): void {
    this.loadFournisseurs()
  }
  loadFournisseurs(): void {
    this.fournisseurService.getFournisseursSimple().toPromise().then(
      data => {
        this.fournisseurs = data; // Assign the list of fournisseurs to the component property
      },
      error => {
        console.error("Error fetching fournisseurs:", error);
      }
    );
  }
  
  demandeDevisForm = this.fb.group({
    nom: ['', Validators.required],
    description: ['', Validators.required],
    fournisseurId: ['', Validators.required]
  });
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
          //  onClick: this.resetGrid.bind(this),
          }
        });
    e.toolbarOptions.items.unshift(
        {
          location: 'after',
          widget: 'dxButton',
          options: {
            hint: 'Refresh',
            icon: 'refresh',
          //  onClick: this.refresh.bind(this),
          }
        });
  }

  onSelectionChanged(event: any) {
    this.selectedProducts = event.selectedRowsData;
  }
retrieveSelectedData() {
    this.selectedRowsData = this.dataGrid.instance.getSelectedRowsData();
    console.log('Selected Rows Data:', this.selectedRowsData);
    this.devisDaSharedService.setSelectedData(this.selectedRowsData);
    this.router.navigate(['DemandeDevis/addDemandeDevis/produitDemandee']);
  }
  getLastMonthRange() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return [lastMonth, today];
  }

  getLastYearRange() {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    return [lastYear, today];
  }

  getLast30DaysRange() {
    const today = new Date();
    const last30Days = new Date(today.setDate(today.getDate() - 30));
    return [last30Days, new Date()];
  }
}
