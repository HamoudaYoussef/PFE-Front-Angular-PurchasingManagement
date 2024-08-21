import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import themes from 'devextreme/ui/themes';
import { NewDemandeAchat } from 'src/app/Models/demande-achat.model';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { NewProduit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Service/produit.service';
import { EnvService } from 'src/env.service';
import { ProduitDemandeeService } from '../../../../Service/produit-demandee.service';
import { ActivatedRoute } from '@angular/router';
import { DemandeAchatService } from 'src/app/Service/demande-achat.service';

@Component({
  selector: 'app-produit-da',
  templateUrl: './produit-da.component.html',
  styleUrls: ['./produit-da.component.scss']
})
export class ProduitDaComponent implements OnInit {
  produits: NewProduit[];
  dataSourceElement: any;
  selectedRows: number[] = [];
  demandeAchatId:any;
  selectedProductIds: number[] = [];
  selectionChangedBySelectbox: boolean;
  prefix: string;
  @ViewChild('grid', { static: false }) grid: DxDataGridComponent;
  checkBoxesMode: string;
  products: NewProduit[] = [];
  demandeAchat: NewDemandeAchat; // La demande d'achat associée
  selectedRowsP: NewProduit[] = []; 
  
  
  constructor(private produitService: ProduitService,private produitDemandeeService :ProduitDemandeeService, private env: EnvService
    ,public route: ActivatedRoute, public demandeAchatService: DemandeAchatService) {}
  ngOnInit(): void {
      this.getAllProduits()
      this.demandeAchatId=this.route.snapshot.paramMap.get('id');
      this.loadDemandeAchat();
    }
  loadDemandeAchat() {
    this.demandeAchatService.getDemandeAchatById(this.demandeAchatId).subscribe(
      (demandeAchat) => {
        //ous pouvez traiter la demande d'achat obtenue ici
        console.log('Demande d\'achat chargée avec succès:', demandeAchat);
      },
      error => {
        console.error('Erreur lors du chargement de la demande d\'achat:', error);
      }
    );
    console.log(this.demandeAchatId)
  }
  handleSelectionChange(selectedItems: any[], productId: number) {
    
    if(selectedItems.length > 0) {
      this.selectedProductIds = selectedItems.map(item => item.id);
      console.log(this.selectedProductIds); // Vérifiez si les données sélectionnées contiennent l'ID du produit
      // Assurez-vous que la propriété id est correcte pour l'ID du produit
    } else {
    }
  }
  filterSelected(event) {
    this.selectionChangedBySelectbox = true;
    const prefix = event.value;
    
    if (!prefix) { return; }
    if (prefix === 'All') { this.selectedRows = this.dataSourceElement.map((produit) => produit.ID); } else {
      this.selectedRows = this.dataSourceElement.filter((produit) => produit.Prefix === prefix).map((produit) => produit.ID);
    }

    this.prefix = prefix;
  }

  getAllProduits() {
    this.produitService.getProduits().subscribe((data) => {
      this.produits = data;
      this.dataSourceElement = new CustomStore({
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
    });

  }

  
}
@Pipe({ name: 'stringifyProduits' })
export class StringifyProduitsPipe implements PipeTransform {
  transform(produits: NewProduit[]) {
    return produits.map((produit) => `${produit.nom}`);
  }
}

