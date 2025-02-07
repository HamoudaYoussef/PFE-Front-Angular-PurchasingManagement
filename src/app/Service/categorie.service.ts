import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewCategorie } from '../Models/categorie.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private apiUrl = 'http://localhost:8888/achat/api/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<NewCategorie[]> {
    return this.http.get<NewCategorie[]>(this.apiUrl);
  }
}
