import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from 'src/env.service';
import { WsService } from 'src/ws.service';
import { TokenStorageService } from '../pages/Global/shared-service/token-storage.service';
import { Observable } from 'rxjs';
import { NewFournisseur } from '../Models/fournisseur.model';
import { NewProduit } from 'src/app/Models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(private http: HttpClient,private Wservice: WsService,public env: EnvService,private tokenStorage: TokenStorageService) { }
 private BASE_URL = 'http://localhost:8888/achat/api/produits/getProduits';
 private BASE_URLS = 'http://localhost:8888/achat/api/produits/produits';

 private BASE_URL_PDA = 'http://localhost:8888/achat/api/produits/demande-achat/';
 private BASE_URL_F = 'http://localhost:8888/achat/api/produits/demande-achat/';
 private ADD_BASE_URL = 'http://localhost:8888/achat/api/produits';




 



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

  getProduitsByDemandeAchatId(demandeAchatId: number): Observable<NewProduit[]> {
    return this.http.get<NewProduit[]>(`${this.BASE_URL_PDA}${demandeAchatId}`);
  }
  getProduitsByFournisseur(fournisseurId: number): Observable<NewProduit[]> {
    return this.http.get<NewProduit[]>(`${this.BASE_URL_F}${fournisseurId}`);
  }
  getDemandeAchatById(id): Observable<NewProduit> {
    const url = `${this.env.piOpp}produitDTO/${id}`;
    return this.http.get<NewProduit>(url);
  }
  updateProduit(id: number, produit: any): Observable<any> {
    const url = `${this.ADD_BASE_URL}/update/${id}`;
    return this.http.put(url, produit);
  }

  getProduits(): Observable<any> {
    return this.http.get(`${this.BASE_URL}`);
  }
  getProduitsSimple(): Observable<any> {
    return this.http.get(`${this.BASE_URLS}`);
  }
  addProduit(produit: NewProduit): Observable<any> {
    return this.http.post<NewProduit>(`${this.ADD_BASE_URL}` ,produit)
  }
  deleteProduit(id: number): Observable<any> {
    return this.http.delete(`${this.ADD_BASE_URL}/${id}`, { responseType: 'text' });
  }
  addProduitWithImage(formData: FormData) {
    return this.http.post(`${this.ADD_BASE_URL}/add-produit-with-image`, formData);
  }

  getProduitsByCategorie(categorieId: number): Observable<NewProduit[]> {
    return this.http.get<NewProduit[]>(`${this.ADD_BASE_URL}/byCategorie/${categorieId}`);
  }
}
