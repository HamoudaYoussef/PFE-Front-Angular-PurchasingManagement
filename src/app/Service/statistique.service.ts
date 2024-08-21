import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  private baseUrl = 'http://localhost:8888/achat/api/statistiques';


  constructor(private http: HttpClient) { }

  getStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getStat`);
  }
  getDemandesAchatParMois(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/demande-achat-par-mois`);
  }

  getBonsCommandeParMois(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/bon-commande-par-mois`);
  }
  getOffresParMois(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/offres-par-mois`);
  }

  getDemandesAchatParRegion(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/demande-achat-par-region`);
  }
  getDemandesAchatParStatut(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/demande-achat-par-statut`);
  }
}
