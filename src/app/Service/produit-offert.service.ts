import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { NewProduitOffert } from '../Models/produit-offert.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NewBonCommande } from '../Models/bon-commande.model';
import { NewOffre } from '../Models/offre.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitOffertService {
  private Base_URL = 'http://localhost:8888/achat/api/produit-offerts';
  private Add_URL = 'http://localhost:8888/achat/api/produit-offerts';


  constructor(private http: HttpClient) { }
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }

  getProduitOffertsByOffreId(offreId: number): Observable<NewProduitOffert[]> {
    return this.http.get<NewProduitOffert[]>(`${this.Base_URL}/by-offre/${offreId}`);
  }
  getProduitOffert(id: number): Observable<NewProduitOffert> {
    return this.http.get<NewProduitOffert>(`${this.Base_URL}/${id}`);
  }
  updateProduitOffert(id: number, bonCommandeId: number, produitOffert: NewProduitOffert): Observable<any> {
    return this.http.put(`${this.Base_URL}/produits-offerts/${id}/${bonCommandeId}`, produitOffert);
  }
  addProduitffert(produitOffert: NewProduitOffert): Observable<any> {
    return this.http.post<NewProduitOffert>(`${this.Add_URL}` ,produitOffert)
  }
  getReferenceOffre(id: number) {
    return this.http.get(`${this.Base_URL}/${id}/referenceoffre`, { responseType: 'text' as 'json' }).pipe(
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
  getDateOffre(id: number): Observable<string> {
    const url = `${this.Base_URL}/${id}/dateOffre`;
    return this.http.get(url, { responseType: 'text' });
  }
  getBonCommandeByProduitOffertId(id: number): Observable<NewBonCommande> {
    return this.http.get<NewBonCommande>(`http://localhost:8888/achat/api/produit-offerts/produitOffert/${id}/bonCommande`);
  }

  getProduitOffertsByBonCommandeId(bonCommandeId: number): Observable<NewProduitOffert[]> {
    return this.http.get<NewProduitOffert[]>(`${this.Base_URL}/produitsOfferts/${bonCommandeId}`);
  }

  getProduitOffertById(id: number): Observable<NewProduitOffert> {
    return this.http.get<NewProduitOffert>(`${this.Base_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getOffreByProduitOffert(id: number): Observable<NewOffre> {
    return this.http.get<NewOffre>(`${this.Base_URL}/${id}/offre`);
  }
  findProduitOffertByProduitCommandeeAndDemandeDevis(produitCommandeeId: number, demandeDevisId: number): Observable<NewProduitOffert[]> {
    const url = `${this.Base_URL}/produit-offert/by-produit-commandee/${produitCommandeeId}/demande-devis/${demandeDevisId}`;
    return this.http.get<NewProduitOffert[]>(url);
  }
  getProduitsGroupedByBonCommande(offreId: number): Observable<Map<number, any[]>> {
    return this.http.get<Map<number, any[]>>(`${this.Base_URL}/groupedByBonCommande/${offreId}`);
  }
}
