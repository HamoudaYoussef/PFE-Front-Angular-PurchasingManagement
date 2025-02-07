import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewDemandeAchat } from '../Models/demande-achat.model';
import { TokenStorageService } from 'src/app/pages/Global/shared-service/token-storage.service';
import { EnvService } from 'src/env.service';
import { WsService } from 'src/ws.service';
import { StatutDA } from '../Models/enumerations/statut-da.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeAchatService {

  constructor(private http: HttpClient,private Wservice: WsService,public env: EnvService,private tokenStorage: TokenStorageService) { }
  private BASE_URL = 'http://localhost:8888/achat/api/demande-achats/getDA';
  private ADD_URL = 'http://localhost:8888/achat/api/demande-achats/demandeachat';
  private BASE_URL_DELETE = 'http://localhost:8888/achat/api/demande-achats/delete';
  private BASE_URL_Update ='http://localhost:8888/achat/api/demande-achats/update';
  private BASE_URL_DAVALID ='http://localhost:8888/achat/api/demande-achats/demandes/termine';

  getDemandesAchat(params: {
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortOrder: string;
  }): Observable<{ data: NewDemandeAchat[]; totalCount: number }> {
    const httpParams = new HttpParams()
      .set('pageIndex', params.pageIndex.toString())
      .set('pageSize', params.pageSize.toString())
      .set('sortField', params.sortField)
      .set('sortOrder', params.sortOrder);

    return this.http.get<{ data: NewDemandeAchat[]; totalCount: number }>(
      `${this.BASE_URL}`,
      { params: httpParams }
    );
  }

  generateData(count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: i + 1,
        name: 'Item ' + (i + 1),
        value: Math.floor(Math.random() * 100)
      });
    }
    return data;
  }


  postDemandeAchatWF(demandeAchat, authors, readers, description) {
    let params = new HttpParams();

    params = params.append("authors", authors);
    params = params.append("readers", readers);
    params = params.append("description", description);
    return this.http.patch(`${this.env.piOpp}` + "submitDA",

    demandeAchat, {params, headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken()).append("application", require('package.json').name)});

  }
  initDemandeAchat() {
    return this.http.patch(this.env.piOpp + 'initDA', {}, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken())});
  }
  DemandeAchat_process_Submit(obj) {
    return this.http.patch(this.env.piOpp + 'submitDA', obj, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken())});
  }
  DemandeAchat_processValid_Submit(obj) {
    return this.http.patch(this.env.piOpp + 'submitValidDA', obj, {headers: new HttpHeaders().set("Authorization", this.tokenStorage.getToken())});
  }
  getDemandeAchatById(id): Observable<any> {
    const url = `${this.env.piOpp}demandeAchatDTO/${id}`;
    return this.http.get<any>(url);
  }

  /*getDemandesAchat(sortField: string, sortOrder: string, pageIndex: number, pageSize: number): Observable<any> {
    let params = new HttpParams()
    .set('sortField', sortField)
    .set('sortOrder', sortOrder)
    .set('pageIndex', pageIndex.toString())
    .set('pageSize', pageSize.toString());
    return this.http.get(`${this.BASE_URL}`, { params });
  }*/
  addDemandeAchat(demandeAchat: NewDemandeAchat): Observable<any> {
    return this.http.post<NewDemandeAchat>(`${this.ADD_URL}` ,demandeAchat)
  }
  deleteDemandeAchat(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL_DELETE}/${id}`, { responseType: 'text' });
  }
  updateDemandeAchat(demandeId: number, demandeAchat:any): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL_Update}/${demandeId}`, demandeAchat);
  }
  getDemandesTerminees():Observable<any>{
    return this.http.get(`${this.BASE_URL_DAVALID}`);
  }
  getDemandeAchat(id):Observable<any>{
    const url = `${this.env.piOpp}${id}`;
    return this.http.get<any>(url);  }

   
    updateStatut(id: number, nouveauStatut: StatutDA): Observable<any> {
      return this.http.put(`${this.env.piOpp}${id}/changer-statut`, 
        { statut: nouveauStatut },
        { responseType: 'text' } // Indique que la réponse est du texte
      );
    }
    updateStatutAnnuler(id: number, nouveauStatut: StatutDA): Observable<any> {
      return this.http.put(`${this.env.piOpp}${id}/changer-statut-annuler`, 
        { statut: nouveauStatut },
        { responseType: 'text' } // Indique que la réponse est du texte
      );
    }
    statutEnAttente(id: number, nouveauStatut: StatutDA): Observable<any> {
      return this.http.put(`${this.env.piOpp}${id}/statut-en-attente`, 
        { statut: nouveauStatut },
        { responseType: 'text' } // Indique que la réponse est du texte
      );
    }

  
}
