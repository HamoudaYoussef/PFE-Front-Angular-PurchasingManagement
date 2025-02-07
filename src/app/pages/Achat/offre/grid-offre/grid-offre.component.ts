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
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/pages/Global/shared-service/token-storage.service';
import { NewProduitOffert } from 'src/app/Models/produit-offert.model';
import { FormGroup } from '@angular/forms';
import { OffreBonCommandeService } from 'src/app/Service/offre-bon-commande.service';

@Component({
  selector: 'app-grid-offre',
  templateUrl: './grid-offre.component.html',
  styleUrls: ['./grid-offre.component.scss']
})
export class GridOffreComponent implements OnInit {

  constructor(private env: EnvService,private offreService: OffreService,private cookieService:CookieService, private translateService:TranslateService,private tokenStorage: TokenStorageService,
    private toastr: ToastrService,private router: Router,private httpClient:HttpClient,private dialog: MatDialog, private bonCommandeService:BonCommandeService,
    private offreBonCommandeService:OffreBonCommandeService) { }
    nouveauOffreId: number; // Variable pour stocker l'ID de la nouvelle offre
    produitOffertSelectionne: NewProduitOffert[] = []; // Variable pour stocker le produit sélectionné
    fournisseur: NewFournisseur | null = null;

    bcadd: any;
  offres: NewOffre[]; // 
  dataSourceElement: any;
  offre: any;
  displayname: string;
offreId:number;
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
  fournisseurs: { [key: number]: string } = {}; // Un objet pour stocker les noms des fournisseurs par ID d'offre
  demandeachats: IDemandeAchat;
  demandeAchatIds: number[];



  ngOnInit(): void {
    this.getRequestCaseLazy();
    this.displayname = this.cookieService.get('displayname');
    console.log("data",this.dataSourceElement);
    console.log("data",this.displayname);
   
   // this.produitOffertSelectionne = this.offreBonCommandeService.getProduitsSelectionnes();
  //  

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
  onProduitDejaSelectionne(message: string) {
    this.toastr.warning(message); // Affiche le toast d'avertissement
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
      const demandeachatId = offre.demandeDevis.demandeAchat.id;
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
  }
  customizeTotalText(options: any): string {
    return `${options.value.toFixed(2)} DT`; // Ajoute 'DT' après la valeur
  }
  goToAddOffre() {
    // Vérifiez si event et event.data sont définis
   
      this.router.navigate(['/Offre/addOffre']);
   
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
  getRequestCaseLazy() {
    let size = this.env.pageSize
    this.dataSourceElement = new CustomStore({
          key: 'id',
          load: function (loadOptions: any) {
            loadOptions.requireTotalCount = true
            var params = "";
            if (loadOptions.take == undefined) loadOptions.take = size;
            if (loadOptions.skip == undefined) loadOptions.skip = 0;

            //size
            params += 'size=' + loadOptions.take || size;
            //page
            params += '&page=' + loadOptions.skip / loadOptions.take || 0;

            //sort
            if (loadOptions.sort) {
              if (loadOptions.sort[0].desc)
                params += '&sort=' + loadOptions.sort[0].selector + ',desc';
              else
                params += '&sort=' + loadOptions.sort[0].selector + ',asc';
            }

            let tab: any[] = [];
            if (loadOptions.filter) {
              if (loadOptions.filter[1] == 'and') {
                for (var i = 0; i < loadOptions.filter.length; i++) {
                  if (loadOptions.filter[i][1] == 'and') {
                    for (var j = 0; j < loadOptions.filter[i].length; j++) {
                      if (loadOptions.filter[i][j] != 'and') {
                        if (loadOptions.filter[i][j][1] == 'and') {
                          tab.push(loadOptions.filter[i][j][0]);
                          tab.push(loadOptions.filter[i][j][2]);
                        } else
                          tab.push(loadOptions.filter[i][j]);
                      }
                    }
                  } else tab.push(loadOptions.filter[i]);
                }
              } else
                tab.push([loadOptions.filter[0], loadOptions.filter[1], loadOptions.filter[2]]);
            }

            let q: any[] = [];
            let reqRechercherAnd: any[] = [];

            for (let i = 0; i < tab.length; i++) {
              
              if (tab[i] !== undefined && tab[i] !== null) {
                if (tab[i][0] == 'startDate' || tab[i][0] == 'sysdateCreated' || tab[i][0] == 'sysdateUpdated' || tab[i][0] == 'dateTimeFrom' || tab[i][0] == 'dateTimeUntil') {
                  let isoDate = new Date(tab[i][2]).toISOString();
                  tab[i][2] = isoDate;
                }
                let operateur;
                switch (tab[i][1]) {
                  case ('notcontains'): {
                    operateur = 'doesNotContain';
                    break;
                  }
                  case  'contains': {
                    operateur = 'contains';

                    break;
                  }
                  case '<>' : {
                  
                    operateur = 'notEquals';
                    break;
                  }
                  case  '=': {
                    operateur = 'equals';
                    break;
                  }
                  case 'endswith': {
                    // q.push("(" + tab[i][0] + ":*" + tab[i][2] + ")");
                    break;
                  }
                  case  'startswith': {
                    //  q.push("(" + tab[i][0] + ":" + tab[i][2] + "*" + ")");
                    break;
                  }
                  case  '>=': {
                    
                    operateur = 'greaterThanOrEqual';
                    break;
                  }
                  case  '>': {
                    operateur = 'greaterThanOrEqual';
                    break;
                  }
                  case  '<=': {
                    operateur = 'lessOrEqualThan';
                    break;
                  }
                  case  '<': {
                    
                    operateur = 'lessOrEqualThan';
                    break;
                  }
                  case 'or' : {
                    console.log("test")
                    if (typeof (tab[i][0]) == "object") {
                      console.log("partie",tab[i][0][0])
                      let ch = ""
                      loadOptions.filter.forEach(element => {
                        console.log("element",element)
                        if (element[2] != null && element[2] != undefined && element[2] != "") {
                          ch += element[2] + ","
                        }
                      });
                      paramsCount += '&';
                      paramsCount += tab[i][0][0] + "." + "in=" + ch
                      paramsCount += ',';
                      params += '&';

                      if(tab[i][0][0]==='caseType.caseTypeName'){
                        params += 'caseTypeLabel' + "." + "in=" + ch
                      }else{
                        params += tab[i][0][0] + "." + "in=" + ch

                      }
                    } else
                      operateur = "notEquals"

                    break;
                  }
                }
                if (operateur !== null && operateur !== undefined && operateur != '') {
                  if (tab[i][0] == 'arrivedDatetime') {
                    paramsCount += '&';
                    paramsCount += tab[i][0] + '.' + operateur + '=' + new Date(tab[i][2]).toISOString();
                    paramsCount += ',';
                    params += '&';
                    params += tab[i][0] + '.' + operateur + '=' + new Date(tab[i][2]).toISOString();

                  } else {

                    paramsCount += '&';
                    paramsCount += tab[i][0] + '.' + operateur + '=' + tab[i][2];
                    paramsCount += ',';
                    params += '&';

                    params += tab[i][0] + '.' + operateur + '=' + tab[i][2];
                  }

                }
              }
            }

            let f: string = "";
            if (q.length != 0) f += q[0];
            for (let i = 1; i < q.length; i++) {
              f += "&" + q[i];
            }
            if (f.length != 0) params += "&" + f

            var paramsCount = ""
            var tabCount = []
            tabCount = params.split('&')
            if (tabCount.length > 2) paramsCount += "?"
            for (let i = 3; i < tabCount.length; i++) {
              paramsCount += tabCount[i]
              paramsCount += "&"
            }
            params+= '&sort=id,desc'
            
            
            return this.httpClient.get(this.env.urlProject + 'offres/offres?' + params, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
                .toPromise()
                .then((data: any) => {
                  size = data.totalElements

                      return {data: data.content, totalCount: data.totalElements};

                    },
                    error => {
                      this.toastr.error("خطأ في تحميل البيانات ", "", {
                        closeButton: true,
                        positionClass: 'toast-top-right',
                        extendedTimeOut: this.env.extendedTimeOutToastr,
                        progressBar: true,
                        disableTimeOut: false,
                        timeOut: this.env.timeOutToastr
                      })
                    })

          }.bind(this)
        }
    );
  }
  produitsOfferts: FormGroup[] = []; // Tableau pour stocker les groupes de formulaire

  onProduitOffertSelected(produit: NewProduitOffert) {
    console.log('Produit sélectionné :', produit); // Vérification
    this.offreBonCommandeService.ajouterProduit(produit);
    
    // Récupérer les produits sélectionnés
    this.produitOffertSelectionne = this.offreBonCommandeService.getProduitsSelectionnes();
    console.log('Produits dans le service après sélection :', this.produitOffertSelectionne);
  
    // Vérifier si les fournisseurs sont différents
  }
  removeProduitOffert(produit: NewProduitOffert): void {
    // Trouver l'index du produit dans la liste
    const index = this.produitOffertSelectionne.findIndex(prod => prod.id === produit.id);
    
    // Si le produit est trouvé, le retirer
    if (index !== -1) {
      this.produitOffertSelectionne.splice(index, 1); // Retirer le produit de la liste
      console.log('Produit retiré de la liste :', produit);
    } else {
      console.log('Produit non trouvé dans la liste.');
    }
  }
  scrollToProductDetails() {
    const targetElement = document.getElementById('produit-details');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth',  // Défilement fluide
        block: 'start',     // Centrer l'élément verticalement
        inline: 'nearest'   });
    }
  }
  goBC(){
    this.offreBonCommandeService.setProduitsSelectionnes(this.produitOffertSelectionne);
    const fournisseurs = new Set(this.produitOffertSelectionne.map(p => p.offre.fournisseur.id));
    
    if (!this.produitOffertSelectionne || this.produitOffertSelectionne.length === 0) {
      this.toastr.warning('Aucun produit sélectionné.');
      return;
    }
  
  // Vérifiez si un bon de commande est déjà associé à un produit
  const produitAvecBonCommande = this.produitOffertSelectionne.find(produit => produit.bonCommande?.id);
  if (produitAvecBonCommande) {
    this.toastr.warning('Un ou plusieurs produits sélectionnés sont déjà affectés à un bon de commande.');
    return;
  }
    
    if (fournisseurs.size > 1) {
      this.toastr.warning('Les produits sélectionnés ont des fournisseurs différents.');
      this.toastr.info('Veuillez choisir des produits d\'un seul fournisseur.');

    } else {
      this.router.navigate(['/BonCommande/add'], {
        queryParams: {
          produits: JSON.stringify(this.produitOffertSelectionne)
        }
      });    }
    console.log('ps',this.produitOffertSelectionne)
    // Pass the offer ID
}

  fournisseurNom: string | undefined;



  

}
