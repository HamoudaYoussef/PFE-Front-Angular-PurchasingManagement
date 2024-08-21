import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { NewFournisseur } from 'src/app/Models/fournisseur.model';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-grid-fournisseur',
  templateUrl: './grid-fournisseur.component.html',
  styleUrls: ['./grid-fournisseur.component.scss']
})
export class GridFournisseurComponent implements OnInit {
  fournisseurs: NewFournisseur[] = [];
  dataSourceElement: any;
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  popupDeleteVisible: boolean = false;
  iddoc: any;
  popupAdd = false;
  popupEdit = false;
  id: any;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridDemande', { static: false }) dataGridDemande: DxDataGridComponent;

  constructor(
    private env: EnvService,
    private fournisseurService: FournisseurService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllFournisseurs();
  }

  getAllFournisseurs() {
    this.fournisseurService.getFournisseurs().subscribe((data) => {
      this.fournisseurs = data;
      this.dataSourceElement = new CustomStore({
        load: (loadOptions: any) => {
          loadOptions.requireTotalCount = true;
          const size = loadOptions.take || this.env.pageSize;
          const startIndex = loadOptions.skip || 0;
          const endIndex = startIndex + size;
          const paginatedData = this.fournisseurs.slice(startIndex, endIndex);

          return Promise.resolve({
            data: paginatedData,
            totalCount: this.fournisseurs.length,
          });
        },
        update: (key: any, values: any) => {
          // Trouver l'élément à mettre à jour
          const index = this.fournisseurs.findIndex(item => item.fournisseur_id === key);
          if (index !== -1) {
            // Mettre à jour l'élément avec les nouvelles valeurs
            this.fournisseurs[index] = { ...this.fournisseurs[index], ...values };
            // Vous pouvez également faire un appel API pour persister les modifications
            return this.fournisseurService.updateFournisseur(key, values).toPromise();
          }
          return Promise.reject('Element not found');
        }
      });
    });
  }
  onRowUpdating(e: any) {
    console.log('e.key:', e.key);
    console.log('e.newData:', e.newData);

    // Extrait l'ID correctement
    const id = typeof e.key === 'object' ? e.key.id : e.key;

    // Vérifiez si e.newData contient un ID et les données nécessaires
    if (id !== undefined && id !== null) {
        console.log('ID:', id);
        console.log('Data to Update:', e.newData);

        this.fournisseurService.updateFournisseur(id, e.newData).subscribe(
            (response) => {
                this.toastr.success('Fournisseur mis à jour avec succès');
                this.dataGridDemande.instance.refresh();
            },
            (error) => {
                this.toastr.error('Erreur lors de la mise à jour du fournisseur');
                console.error('Update Error:', error);
            }
        );
    } else {
        console.error('ID is undefined or null');
    }
}
  popupDelete(id: any) {
    this.popupDeleteVisible = true;
    this.iddoc = id;
  }

  fermerPopup() {
    this.popupDeleteVisible = false;
  }

  add(e: any) {
    this.popupAdd = e;
    this.popupEdit = e;
    this.dataGridDemande.instance.refresh();
  }

  Editclient(id: any) {
    this.id = id.data.id;
    this.popupEdit = true;
  }

  getdemande(id: any) {
    this.router.navigate(['Fournisseur/fournisseur', id.data.id]);
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        template: 'ExportPDF'
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          hint: 'Reset',
          icon: 'undo',
          onClick: this.resetGrid.bind(this),
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          hint: 'Refresh',
          icon: 'refresh',
          onClick: this.dataGridDemande.instance.refresh.bind(this.dataGridDemande.instance),
        }
      },
      {
        location: 'center',
        template: 'Liste des fournisseurs'
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          hint: 'Add',
          icon: 'plus',
          onClick: this.openAddPage.bind(this),
        },
      }
    );
  }

  resetGrid() {
    window.location.reload();
  }

  openAddPage() {
    this.popupAdd = true;
  }
}
