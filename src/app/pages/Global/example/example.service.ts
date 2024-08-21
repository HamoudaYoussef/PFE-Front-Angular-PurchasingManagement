import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvService} from "../../../../env.service";

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private env = new EnvService();
  private path = `${this.env.apiUrlBack}/api`;



  constructor(private http: HttpClient,
              )
  {

  }
  getAppById(id: string): Promise<any> {
    return this.http.get<any>(`${this.path}/module-uis/${id}`).toPromise();
  }

  postApp(obj: any): Promise<any> {
    return this.http.post<any>(`${this.path}/module-uis/`, obj).toPromise();
  }

}

