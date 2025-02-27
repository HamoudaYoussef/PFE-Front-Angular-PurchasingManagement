import { Component, Input, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { NewProduitDemandee } from 'src/app/Models/produit-demandee.model';
import { EnvService } from 'src/env.service';
import { ProduitCommandeeService } from '../../../../Service/produit-commandee.service';
import { NewProduitCommandee } from 'src/app/Models/produit-commandee.model';

@Component({
  selector: 'app-hover-demande-devis',
  templateUrl: './hover-demande-devis.component.html',
  styleUrls: ['./hover-demande-devis.component.scss']
})
export class HoverDemandeDevisComponent implements OnInit {
  dataSourceElement: any;
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  tasksDataSource: DataSource;
  ngOnInit(): void {
    this.loadProduitsByDemandeDevis();
    // Initialiser ici si nécessaire
  }
  @Input() key: number;

 @Input() demandeDevisId: number;
  produits: NewProduitCommandee[] = [];
  ngAfterViewInit() {
   // this.loadProduitsByDemandeDevis() ;
  }

  completedValue(rowData) {
    return rowData.Status == 'Completed';
  }


  constructor(private ProduitCommandeeService: ProduitCommandeeService, private env: EnvService) { }

/*  ngOnChanges(changes: SimpleChanges): void {
    if (changes.demandeAchatId && this.demandeAchatId) {
      this.loadProduitsByDemandeAchatId(this.demandeAchatId);
    }
  }*/

   loadProduitsByDemandeDevis(): void {
    this.ProduitCommandeeService.getProduitCommandeeByDemandeDevisId(this.demandeDevisId).subscribe(
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
