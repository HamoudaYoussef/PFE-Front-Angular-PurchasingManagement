import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import ArrayStore from 'devextreme/data/array_store';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { ProduitDemandeeService } from 'src/app/Service/produit-demandee.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-hover-da',
  templateUrl: './hover-da.component.html',
  styleUrls: ['./hover-da.component.scss']
})
export class HoverDaComponent implements OnInit {

    dataSourceElement: any;
    pageSize = this.env.pageSize;
    allowedPageSizes = this.env.allowedPageSizes;
    tasksDataSource: DataSource;
    ngOnInit(): void {
      // Initialiser ici si nécessaire
    }
    @Input() key: number;

   @Input() demandeAchatId: number;
    produits: NewProduitDemandee[] = [];
    ngAfterViewInit() {
      this.loadProduitsByDemandeAchatId() ;
    }
  
    completedValue(rowData) {
      return rowData.Status == 'Completed';
    }
  
    constructor(private produitDemandeeService: ProduitDemandeeService, private env: EnvService) { }
  
  /*  ngOnChanges(changes: SimpleChanges): void {
      if (changes.demandeAchatId && this.demandeAchatId) {
        this.loadProduitsByDemandeAchatId(this.demandeAchatId);
      }
    }*/
  
    loadProduitsByDemandeAchatId(): void {
      this.produitDemandeeService.getProduitDemandeByDemandeAchatId(this.demandeAchatId).subscribe(
        produits => {
          this.produits = produits;
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
          });        },
        error => {
          console.log('Une erreur s\'est produite lors du chargement des produits : ', error);
        }
      );
    }

}
