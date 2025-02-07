import { Injectable } from '@angular/core';
import { NewProduitDemandee } from '../Models/produit-demandee.model';
import { BehaviorSubject, catchError, forkJoin, map, Observable, throwError } from 'rxjs';
import { EnvService } from 'src/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProduitService } from './produit.service';
import { NewDemandeAchat } from '../Models/demande-achat.model';
import { NewProduitCommandee } from '../Models/produit-commandee.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitDemandeeService {

  private ADD_URL = 'http://localhost:8888/achat/api/produit-demandees';
  private getProduitDByDA = 'http://localhost:8888/achat/api/produit-demandees';
  
  private produitsSource = new BehaviorSubject<any[]>([]);
  produits$ = this.produitsSource.asObservable();
  constructor(private http: HttpClient,public env: EnvService, private produitService:ProduitService) { }


  addProduitDemandee(produitDemandee: NewProduitDemandee): Observable<any> {
    return this.http.post<NewProduitDemandee>(`${this.ADD_URL}` ,produitDemandee)
  }
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
  getProduitDemandeByDemandeAchatId(demandeAchatId: any): Observable<NewProduitDemandee[]> {
    return this.http.get<NewProduitDemandee[]>(`${this.getProduitDByDA}/${demandeAchatId}/produits`);
  } 
   getProduitDemandeByDemandeDevisId(demandeDevisId: any): Observable<NewProduitDemandee[]> {
    return this.http.get<NewProduitDemandee[]>(`${this.getProduitDByDA}/byDemandeDevis/${demandeDevisId}`);
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
  updateProduitDemandee(id: number, produitDemandee: NewProduitDemandee): Observable<NewProduitDemandee> {
    const url = `${this.ADD_URL}/${id}`;
    return this.http.put<NewProduitDemandee>(url, produitDemandee, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getProduitDemandeeById(id: number): Observable<NewProduitDemandee> {
    return this.http.get<NewProduitDemandee>(`${this.getProduitDByDA}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getDemandeAchatByProduitDemandee(id: number): Observable<NewDemandeAchat> {
    return this.http.get<NewDemandeAchat>(`${this.getProduitDByDA}/${id}/demande-achat`);
  }

  getProduitCommandeesByProduitDemandeeAndDemandeAchat(produitDemandeeId: number, demandeAchatId: number): Observable<NewProduitCommandee[]> {
    const url = `${this.getProduitDByDA}/produit-commandee/by-produit-demandee/${produitDemandeeId}/demande-achat/${demandeAchatId}`;
    return this.http.get<NewProduitCommandee[]>(url);
  }

  findProduitByDemandeAchatAndProduit(demandeDevisId: number, produitId: number): Observable<NewProduitDemandee[]> {
    return this.http.get<NewProduitDemandee[]>(`${this.getProduitDByDA}/${demandeDevisId}/${produitId}`);
  }
}

