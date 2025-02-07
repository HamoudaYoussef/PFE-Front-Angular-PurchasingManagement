import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';
import { NewFournisseur } from 'src/app/Models/fournisseur.model';
import { TokenStorageService } from 'src/app/pages/Global/shared-service/token-storage.service';
import { FournisseurService } from 'src/app/Service/fournisseur.service';
import { EnvService } from 'src/env.service';
import * as L from 'leaflet';
import 'leaflet-control-geocoder'; // Ajoutez cette ligne


@Component({
  selector: 'app-grid-fournisseur',
  templateUrl: './grid-fournisseur.component.html',
  styleUrls: ['./grid-fournisseur.component.scss']
})
export class GridFournisseurComponent implements OnInit {
  fournisseurs: NewFournisseur[] = [];
  afficherCarte = false;
  dataSourceElement: any;
  pageSize = this.env.pageSize;
  allowedPageSizes = this.env.allowedPageSizes;
  popupDeleteVisible: boolean = false;
  iddoc: any;
  popupAdd = false;
  popupEdit = false;
  id: any;
  showloader = false;
  myForm: FormGroup;
  newFournisseur: NewFournisseur = {
    id:null,
    nom: '',
    tel: '',
    adresse: '',
    email: ''
  };
  fournisseurForm:any;
  private customIcon: L.Icon; // Définir customIcon comme propriété de classe


  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridDemande', { static: false }) dataGridDemande: DxDataGridComponent;

  constructor(
    private env: EnvService,
    private fb:FormBuilder,
    private fournisseurService: FournisseurService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private httpClient: HttpClient,
    private tokenStorage: TokenStorageService
  ) {
    this.customIcon = L.icon({
      iconUrl: 'assets/img/icone-gps-removebg-preview.png', // chemin vers l'image de l'icône
      iconSize: [20, 32], // taille de l'icône
      iconAnchor: [10, 32], // point d'ancrage de l'icône
      popupAnchor: [0, -32] // point d'ancrage de la popup par rapport à l'icône
    });
    this.myForm = new FormGroup({
      adresse: new FormControl('') // Initialize form control for address
    });
  }
  
  @ViewChild('formRef', { static: false }) formInstance: DxFormComponent;

  
  ngOnInit(): void {
    this.getRequestCaseLazy();  
}


ouvrirCarte() {
  this.afficherCarte = true;

  // Utilisez setTimeout pour vous assurer que l'élément est rendu avant d'initialiser la carte
  setTimeout(() => {
      // Vérifiez que l'élément DOM est présent
      const mapElement = document.getElementById('map');
      if (mapElement) {
          console.log("L'élément de carte est présent.");
          this.initMap();
      } else {
          console.error("L'élément de carte n'a pas été trouvé.");
      }
  }, 0); // 0 ms pour exécuter après que le rendu soit terminé

}
map: any;
adresseChoisie: string = '';
marqueur: any;
latitude: number | null = null;
longitude: number | null = null;
initMap() {
console.log("Initialisation de la carte...");

if (!this.map) {
  this.map = L.map('map').setView([48.8566, 2.3522], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map);

  // Ajouter le contrôle de géocodage sans marquer automatiquement
  const geocoderControl = L.Control.geocoder({
    defaultMarkGeocode: false, // Désactiver le marquage automatique
  })
    .on('markgeocode', (e: any) => {
      const { center } = e.geocode;
      this.map.setView(center, 12);
      this.adresseChoisie = e.geocode.name;

      // Ajouter un marqueur aux coordonnées trouvées avec l'icône personnalisée
      this.addMarkerByCoordinates(center.lat, center.lng);
    })
    .addTo(this.map);

  // Ajouter un contrôle de recherche dans le coin supérieur droit
  const searchControl = L.Control.geocoder({
    position: 'topright'
  }).addTo(this.map);
} else {
  console.log("La carte existe déjà.");
  this.map.invalidateSize();
}

// Ajouter un marqueur personnalisé lors d'un clic sur la carte
this.map.on('click', (event: any) => {
  const { lat, lng } = event.latlng;
  this.addMarkerByCoordinates(lat, lng);
  this.reverseGeocode(lat, lng);
});
}

// Méthode pour ajouter un marqueur avec une icône personnalisée aux coordonnées spécifiées
addMarkerByCoordinates(lat: number, lng: number) {
if (this.marqueur) {
  this.map.removeLayer(this.marqueur); // Supprimer le marqueur précédent s'il existe
}

// Ajouter le marqueur avec les coordonnées spécifiées et l'icône personnalisée
this.marqueur = L.marker([lat, lng], { icon: this.customIcon })
  .addTo(this.map)
  .bindPopup(`<strong>Position :</strong><br>Latitude: ${lat}, Longitude: ${lng}`)
  .openPopup();
}
fermerCarte() {
if (this.marqueur) {
    this.map.removeLayer(this.marqueur);
    this.marqueur = null;
}

// Supprimez complètement la carte
if (this.map) {
    this.map.remove();
    this.map = null;
}

this.afficherCarte = false;
console.log("affichercarte", this.afficherCarte);
}
reverseGeocode(lat: number, lng: number) {
const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
this.httpClient.get(url).subscribe((data: any) => {
  this.adresseChoisie = data.display_name; // Stockez l'adresse lisible
  this.latitude = lat; // Stocker la latitude
  this.longitude = lng; // Stocker la longitude
  console.log("Adresse trouvée:", this.adresseChoisie);
  console.log("Coordonnées GPS:", this.latitude, this.longitude);
});
}
confirmerAdresse() {
if (this.adresseChoisie) {
  this.myForm.patchValue({ adresse: this.adresseChoisie });
  this.newFournisseur.adresse = this.adresseChoisie; // Met à jour `newFournisseur`
  console.log("Adresse patchée dans le formulaire :", this.adresseChoisie);

    // Attendez un court instant pour voir si la valeur est appliquée
    setTimeout(() => {
     //   console.log("Adresse confirmée (dans demandeF):", this.demandeF.get('adresselivraison')?.value);
    }, 100); // Attente de 100 ms pour la mise à jour du DOM

    this.fermerCarte();
} else {
    console.error("Aucune adresse n'a été choisie.");
}
}

validateAndSubmit() {
  const formIsValid = this.formInstance.instance.validate().isValid;
    
  if (formIsValid) {
    this.onSubmit(); // Soumettre les données
  } else {
    console.error('Validation échouée');
  }
}
  validateForm() {
    // Méthode pour vérifier si tous les champs requis sont remplis
    return (document.querySelector('dx-form') as any)?.instance.validate();
  }

onSubmit() {

  this.showloader = true;
  this.fournisseurService.ajouterOffre(this.newFournisseur).subscribe({
    next: (fournisseur) => {
      console.log('Fournisseur ajouté', fournisseur);
      this.popupAdd = false; // Ferme le popup après ajout
   //   this.resetForm(); 
      this.refresh();// Réinitialise le formulaire
      this.showloader = false;

    },
    error: (error) => {
      console.error('Erreur lors de l\'ajout du fournisseur', error);
      this.showloader = false;

    }
  });
}
maskRules = {
  '0': /[0-9]/  // Autorise uniquement les chiffres
};

resetForm() {
  this.newFournisseur = {
    id:null,
    nom: '',
    tel: '',
    adresse: '',
    email: ''
  };
}

  refresh(): void {
    this.dataGridDemande.instance.refresh();
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
            
            
            return this.httpClient.get(this.env.urlProject + 'fournisseurs/fournisseurs?' + params, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)})
                .toPromise()
                .then((data: any) => {
                  console.log("API Response:", data); // Check the full response
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

          }.bind(this),
          update: (key, values) => {
            return this.fournisseurService.updateFournisseur(key, values).toPromise()
                .then(response => {
                    return response;
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour:', error);
                    throw error; // Let DevExtreme handle the error display
                });
        },
        }
    );
  }

  getAllFournisseurs() {
    this.fournisseurService.getFournisseurs().subscribe((response: NewFournisseur[]) => {
      this.dataSourceElement = new CustomStore({
        key: 'id',
        load: () => {
          return Promise.resolve({
            data: response,
            totalCount: response.length // Total count égale au nombre d'éléments récupérés
          });
        },
        update: (key, values) => {
          return this.fournisseurService.updateFournisseur(key, values).toPromise()
              .then(response => {
                  return response;
              })
              .catch(error => {
                  console.error('Erreur lors de la mise à jour:', error);
                  throw error; // Let DevExtreme handle the error display
              });
      },
      });


    });
  }
  onRowRemoving(event: any): void {
    // Empêche le DataGrid de supprimer la ligne avant la réponse du service
    event.cancel = true;
  
    // Récupère l'ID de la ligne à supprimer
    const idToDelete = event.data.id;
  
    // Confirmation de la suppression
    this.fournisseurService.deleteFournisseur(idToDelete).subscribe({
      next: () => {
        // Rafraîchir les données après la suppression
        this.refresh();
  
        // Afficher un toast de succès
        this.translateService.get("Fournisseur supprimé avec succès").subscribe(res => {
          this.toastr.success(res, "", {
            closeButton: true,
            positionClass: 'toast-top-right',
            extendedTimeOut: this.env.extendedTimeOutToastr || 2000,  // Valeur par défaut
            progressBar: true,
            disableTimeOut: false,
            timeOut: this.env.timeOutToastr || 3000  // Valeur par défaut
          });
        });
  
        // Annuler la suppression automatique (à retirer si non applicable)
        event.cancel = false;
      },
      error: (error) => {
        // Afficher un toast d'erreur en cas d'échec
        this.toastr.error(error.error.message || "Erreur lors de la suppression", "", {
          closeButton: true,
          positionClass: 'toast-top-right',
          extendedTimeOut: this.env.extendedTimeOutToastr || 2000,
          progressBar: true,
          disableTimeOut: false,
          timeOut: this.env.timeOutToastr || 3000
        });
      }
    });
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
  getFournisseur(fournisseurId: number): void {
    this.router.navigate(['Fournisseur/fournisseur/', fournisseurId]);
  }

  getdemande(id: any) {
    this.router.navigate(['Fournisseur/fournisseur', id.data.id]);
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(   
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
  closeAddPopup() {
    this.popupAdd = false;
  }
  openAddPage() {
    this.popupAdd = true;
  }
  onRowUpdating(event: any) {
    console.log('ID:', event.key);
    console.log('Données avant mise à jour:', event.data);
    
    const id = event.key;
    const fournisseur = {
      id: id,
      nom: event.data?.nom || null,
      adresse: event.data?.adresse || null,
      tel: event.data?.tel || null,
      email: event.data?.email || null
    };
  
    console.log('Données fournisseur après mise à jour:', fournisseur);
  
    this.fournisseurService.updateFournisseur(id, fournisseur).subscribe(response => {
      this.toastr.success("Fournisseur mis à jour avec succès", "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        timeOut: this.env.timeOutToastr
      });
    }, error => {
      console.error("Erreur lors de la mise à jour :", error);
      this.toastr.error("Erreur lors de la mise à jour du fournisseur : " + error.message, "", {
        closeButton: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: this.env.extendedTimeOutToastr,
        timeOut: this.env.timeOutToastr
      });
    });
  }
  
  
  
  
}
