import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NewFournisseur } from '../Models/fournisseur.model'; 

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  constructor(private http: HttpClient) { }
  //private BASE_URL = 'http://localhost:8888/achat/api/fournisseurs/fournisseurs';
  private BASE_URL = 'http://localhost:8888/achat/api/fournisseurs/fournisseurs';
  private BASE_URL_Simple = ' http://localhost:8888/achat/api/fournisseurs/all'
  private BASE_URL_ID = 'http://localhost:8888/achat/api/fournisseurs';

  //private ADD_URL = 'http://localhost:8888/achat/api/fournisseurs/fournisseur';
  private ADD_URL = '  http://localhost:8888/achat/api/fournisseurs/fournisseur';
  private BASE_URL_DELETE = 'http://localhost:8888/achat/api/fournisseurs/delete';
  private BASE_URL_Update ='http://localhost:8888/achat/api/fournisseurs/update';


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
  getFournisseurs(): Observable<any> {
    return this.http.get(`${this.BASE_URL}`);
  }
  getFournisseursSimple(): Observable<any> {
    return this.http.get(`${this.BASE_URL_Simple}`);
  }
  ajouterOffre(fournisseur: NewFournisseur): Observable<NewFournisseur> {
    return this.http.post<NewFournisseur>(`${this.ADD_URL}`, fournisseur);
  }
  deleteFournisseur(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL_DELETE}/${id}`, { responseType: 'text' });
  }
  updateFournisseur(id: number, fournisseur: NewFournisseur): Observable<NewFournisseur> {
    console.log("Updating Fournisseur with ID:", id, "Data:", fournisseur);
    return this.http.put<NewFournisseur>(`${this.BASE_URL_Update}/${id}`, fournisseur);
  }
  getFournisseurName(id: number): Observable<string> {
    return this.http.get(`${this.BASE_URL_ID}/fournisseur/name/${id}`, { responseType: 'text' });
  }
  getFournisseur(id):Observable<any>{
    return this.http.get<any>(`${this.BASE_URL_ID}/${id}`);  }
   
}
