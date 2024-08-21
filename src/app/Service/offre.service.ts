import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/env.service';
import { TokenStorageService } from '../pages/Global/shared-service/token-storage.service';
import { NewOffre } from '../Models/offre.model';

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private BASE_URL = 'http://localhost:8888/achat/api/offres/offres';
  private BASE= 'http://localhost:8888/achat/api/offres';

  private BASE_URLGeFournisseur = 'http://localhost:8888/achat/api/offres/offres-par-fournisseur';
  private BASE_URLGeDA = 'http://localhost:8888/achat/api/offres/offres-par-demandeachat';



  constructor(private http: HttpClient,public env: EnvService,private tokenStorage: TokenStorageService) { }

  getOffre(id: number): Observable<NewOffre> {
    return this.http.get<NewOffre>(`${this.BASE}/${id}`);
  }
  getOffres(): Observable<any> {
    return this.http.get(`${this.BASE_URL}`);
  }
  getOffresParFournisseur(): Observable<any> {
    return this.http.get(`${this.BASE_URLGeFournisseur}`);
  }
  getOffresParDemandeAchat(): Observable<any> {
    return this.http.get(`${this.BASE_URLGeDA}`);
  }
  getOnlyOffresByDemandeAchat(demandeachatId: number): Observable<NewOffre[]> {
    return this.http.get<NewOffre[]>(`${this.BASE}/demandeachat/${demandeachatId}`);
  }
  deleteOffre(id: number): Observable<any> {
    return this.http.delete(`${this.BASE}/${id}`, { responseType: 'text' });
  }
  getFournisseurName(id: number): Observable<string> {
    return this.http.get(`${this.BASE}/${id}/fournisseur-name`, { responseType: 'text' });
  }

}



