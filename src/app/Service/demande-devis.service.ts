import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/env.service';
import { WsService } from 'src/ws.service';
import { NewDemandeDevis } from '../Models/demande-devis.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeDevisService {

  constructor(private http: HttpClient,private Wservice: WsService,public env: EnvService) { }

  private BASE_URL = 'http://localhost:8888/achat/api/demande-devis';
  private BASE_URL_RECENT = 'http://localhost:8888/achat/api/produit-demandees/recent';
  private BASE_URL_DELETE = 'http://localhost:8888/achat/api/demande-devis';


  getDemandesDevis(): Observable<any> {
    return this.http.get(`${this.BASE_URL}`);
  }

  deleteDemandeDevis(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL_DELETE}/${id}`, { responseType: 'text' });
  }
  saveDemandeDevis(demandeDevis: NewDemandeDevis): Observable<NewDemandeDevis> {
    return this.http.post<NewDemandeDevis>(this.BASE_URL, demandeDevis);
  }
  getRecentProduitDemandees(): Observable<any[]> {
    return this.http.get<any[]>(this.BASE_URL_RECENT);
  }
  saveAll(demandeDevisList: NewDemandeDevis[]): Observable<NewDemandeDevis[]> {
    return this.http.post<NewDemandeDevis[]>(`${this.BASE_URL}/batch`, demandeDevisList);
  }
  getFournisseurName(id: number): Observable<string> {
    return this.http.get(`${this.BASE_URL}/${id}/fournisseur-name`, { responseType: 'text' });
  }


}
