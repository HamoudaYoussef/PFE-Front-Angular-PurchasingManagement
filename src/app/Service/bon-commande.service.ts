import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EnvService } from 'src/env.service';
import { TokenStorageService } from '../pages/Global/shared-service/token-storage.service';
import { StatutBonCommande } from '../Models/enumerations/statut-bc.model';

@Injectable({
  providedIn: 'root'
})
export class BonCommandeService {

  private BASE_URL = 'http://localhost:8888/achat/api/bon-commandes';

  constructor(private http: HttpClient,public env: EnvService,private tokenStorage: TokenStorageService) { }

  initBonCommande(offreId: number) {
    return this.http.patch(this.env.piOppBC + `initBonCommande/${offreId}`, {}, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken())});
  }
  BonCommande_process_Submit(obj) {
    return this.http.patch(this.env.piOppBC + 'submitBonCommande', obj, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken())});
  }
  getBonCommandetById(id): Observable<any> {
    const url = `${this.env.piOppBC}bonCommandeDTO/${id}`;
    return this.http.get<any>(url);
  }
  getOffreByBonCommandeId(bonCommandeId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${bonCommandeId}/offre`);
  }
  getPrixByBonCommandeId(bonCommandeId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${bonCommandeId}/prixoffre`);
  }
  getReferenceOffre(id: number) {
    return this.http.get(`${this.BASE_URL}/${id}/referenceoffre`, { responseType: 'text' as 'json' }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.error('Erreur côté client :', error.error.message);
        } else {
          console.error(`Erreur côté serveur : code ${error.status}, ${error.error}`);
        }
        return throwError('Erreur lors de la récupération de la référence de l\'offre.');
      })
    );
  }
  updateStatutBC(id: number, nouveauStatut: StatutBonCommande): Observable<any> {
    const url = `${this.BASE_URL}/${id}/changer-statut`;
    return this.http.put(url, { statutBC: nouveauStatut });
  }
  deleteBonCommande(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, { responseType: 'text' });
  }
  getBonCommandes(): Observable<any> {
    return this.http.get(`${this.BASE_URL}`);
  }


  
}
