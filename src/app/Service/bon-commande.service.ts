import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EnvService } from 'src/env.service';
import { TokenStorageService } from '../pages/Global/shared-service/token-storage.service';
import { NewBonCommande } from '../Models/bon-commande.model';

@Injectable({
  providedIn: 'root'
})
export class BonCommandeService {

  private BASE_URL = 'http://localhost:8888/achat/api/bon-commandes';

  constructor(private http: HttpClient,public env: EnvService,private tokenStorage: TokenStorageService) { }

  createBonCommande(bonCommandeDTO: NewBonCommande): Observable<NewBonCommande> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<NewBonCommande>(this.BASE_URL, bonCommandeDTO, { headers });
  }
  getOffreByBonCommandeId(bonCommandeId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${bonCommandeId}/offre`);
  }
  getPrixByBonCommandeId(bonCommandeId: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${bonCommandeId}/prixoffre`);
  }

  deleteBonCommande(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, { responseType: 'text' });
  }
  getBonCommandes(): Observable<any> {
    return this.http.get(`${this.BASE_URL}`);
  }

  getBonCommande(id: number): Observable<NewBonCommande> {
    return this.http.get<NewBonCommande>(`${this.BASE_URL}/${id}`);
  }
  
}
