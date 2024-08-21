import { Injectable } from '@angular/core';
import { NewProduitDemandee } from '../Models/produit-demandee.model';
import { BehaviorSubject, catchError, forkJoin, map, Observable, throwError } from 'rxjs';
import { EnvService } from 'src/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProduitService } from './produit.service';

@Injectable({
  providedIn: 'root'
})
export class ProduitDemandeeService {

  private ADD_URL = 'http://localhost:8888/achat/api/produit-demandees';
  private getProduitDByDA = 'http://localhost:8888/achat/api/produit-demandees';

  
  private produitsSource = new BehaviorSubject<any[]>([]);
  produits$ = this.produitsSource.asObservable();
  constructor(private http: HttpClient,public env: EnvService, private produitService:ProduitService) { }


  saveDemandeAchatWithProduits(demandeAchatId: any, produitDemandee: NewProduitDemandee): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.ADD_URL}/demande-achats/${demandeAchatId}/produits`;
    return this.http.post<any>(url, produitDemandee, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
  getProduitDemandeByDemandeAchatId(demandeAchatId: any): Observable<NewProduitDemandee[]> {
    return this.http.get<NewProduitDemandee[]>(`${this.getProduitDByDA}/${demandeAchatId}/produits`);
  }
  getPD(): Observable<NewProduitDemandee[]> {
    return this.http.get<NewProduitDemandee[]>(this.ADD_URL);
   }
  updateProduits(produits: any[]) {
    this.produitsSource.next(produits);
  }
  getProduitsGroupedByDemandeAchat(): Observable<any> {
    return this.http.get<any>(`${this.ADD_URL}/produits/grouped`);
  }

  getProduitsDemandees(): Observable<any> {
    return this.http.get<any>(`${this.ADD_URL}`);
  }
}
