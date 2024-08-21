import { Component, Input, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { ProduitOffertService } from 'src/app/Service/produit-offert.service';
import { EnvService } from 'src/env.service';

@Component({
  selector: 'app-hover-offre',
  templateUrl: './hover-offre.component.html',
  styleUrls: ['./hover-offre.component.scss']
})
export class HoverOffreComponent implements OnInit {

  dataSourceElement: any;
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  tasksDataSource: DataSource;
  ngOnInit(): void {
    // Initialiser ici si nécessaire
  }
  @Input() key: number;

 @Input() offreId: number;
  produits: NewProduitOffert[] = [];
  ngAfterViewInit() {
    this.loadProduitsByOffreId() ;
  }

  completedValue(rowData) {
    return rowData.Status == 'Completed';
  }


  constructor(private produitOffertService: ProduitOffertService, private env: EnvService) { }

/*  ngOnChanges(changes: SimpleChanges): void {
    if (changes.demandeAchatId && this.demandeAchatId) {
      this.loadProduitsByDemandeAchatId(this.demandeAchatId);
    }
  }*/

  loadProduitsByOffreId(): void {
    this.produitOffertService.getProduitOffertsByOffreId(this.offreId).subscribe(
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
