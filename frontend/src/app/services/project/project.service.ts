import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  onProjectGetAllPublic() {
    return this.http.get(`${environment.url}/projects/public`);
  }
  
  onProjectFindOne(id: string) {
    return this.http.get(`${environment.url}/projects/get/${id}`);
  }

  get(projectRoute: String, query: any): Observable<any> {
    return this.http.get(`${environment.url}/${projectRoute}`, { params: query })
  }

  getById(projectRoute: String, id: any): Observable<any> {
    return this.http.get(`${environment.url}/${projectRoute}/${id}`)
  }

  post(projectRoute: String, data: any): Observable<any> {
    return this.http.post(`${environment.url}/${projectRoute}`, data)
  }

  put(projectRoute: String, id: any, data: any): Observable<any> {
    return this.http.put(`${environment.url}/${projectRoute}/${id}`, data)
  }

  delete(projectRoute: String, id: any): Observable<any> {
    return this.http.delete(`${environment.url}/${projectRoute}/${id}`)
  }
}
