import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewProduitOffert } from '../Models/produit-offert.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProduitOffertService {
  private Base_URL = 'http://localhost:8888/achat/api/produit-offerts';

  constructor(private http: HttpClient) { }


  getProduitOffertsByOffreId(offreId: number): Observable<NewProduitOffert[]> {
    return this.http.get<NewProduitOffert[]>(`${this.Base_URL}/by-offre/${offreId}`);
  }
}
