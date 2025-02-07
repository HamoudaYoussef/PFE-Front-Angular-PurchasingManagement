import { Injectable } from '@angular/core';
import { NewProduitCommandee } from '../Models/produit-commandee.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NewDemandeDevis } from '../Models/demande-devis.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitCommandeeService {

  constructor(private http: HttpClient) { }

 private apiUrl = 'http://localhost:8888/achat/api/produit-commandees';

  saveProduitCommandee(produitCommandee: NewProduitCommandee): Observable<NewProduitCommandee> {
    return this.http.post<NewProduitCommandee>(`${this.apiUrl}`, produitCommandee);
  }

  getProduitCommandeeByDemandeDevisId(demandeDevisId: any): Observable<NewProduitCommandee[]> {
    return this.http.get<NewProduitCommandee[]>(`${this.apiUrl}/${demandeDevisId}/produits`);
  } 
  getDemandeDevisByProduitCommandee(id: number): Observable<NewDemandeDevis> {
    return this.http.get<NewDemandeDevis>(`${this.apiUrl}/${id}/demande-devis`);
  }
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
  
  getProduitCommandeeById(id: number): Observable<NewProduitCommandee> {
    return this.http.get<NewProduitCommandee>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProduitsCommandesByOffreAndProduit(offreId: number, produitId: number): Observable<NewProduitCommandee[]> {
    const url = `${this.apiUrl}/${offreId}/${produitId}`;
    return this.http.get<NewProduitCommandee[]>(url);
  }


}
