import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  get(apiRoute: String, query: any): Observable<any> {
    return this.http.get(`${environment.url}/${apiRoute}`, { params: query })
  }

  getById(apiRoute: String, id: any): Observable<any> {
    return this.http.get(`${environment.url}/${apiRoute}/${id}`)
  }

  post(apiRoute: String, data: any): Observable<any> {
    return this.http.post(`${environment.url}/${apiRoute}`, data)
  }

  put(apiRoute: String, id: any, data: any): Observable<any> {
    return this.http.put(`${environment.url}/${apiRoute}/${id}`, data)
  }

  delete(apiRoute: String, id: any): Observable<any> {
    return this.http.delete(`${environment.url}/${apiRoute}/${id}`)
  }
}
