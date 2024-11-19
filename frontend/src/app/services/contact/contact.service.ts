import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../token/token.service'; 
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface ContactForm {
  _id?: string;  // Optional ID property if it exists
  name: string;
  email: string;
  countryCode: string;
  number: string;
  //subject: string;
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = `${environment.url}/contact`;

  constructor(private httpClient: HttpClient, private tokenService: TokenService) {}

  onContactSave(contactForm: ContactForm) {
    console.log(contactForm);
    return this.httpClient.post(`${environment.url}/contact`, contactForm);
  }

  // Get all contact forms
  onContactGetAll(): Observable<ContactForm[]> {
    //const token = this.tokenService.getToken(); // Retrieve token from TokenService
    //console.log('Token used for request:', token); // Log the token for debugging
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<ContactForm[]>(this.apiUrl);
  }
  
  // Delete a specific contact form by ID
  onContactDelete(id: string): Observable<any> {
    //const token = this.tokenService.getToken();
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token ? token : ''}`);
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
  
  // Find a specific contact form by ID
  onContactFindOne(id: string): Observable<ContactForm> {
    //const token = this.tokenService.getToken();
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token ? token : ''}`);
    return this.httpClient.get<ContactForm>(`${this.apiUrl}/${id}`);
  }
  
  // Update a specific contact form by ID
  onContactUpdate(id: string, form: ContactForm): Observable<ContactForm> {
    //const token = this.tokenService.getToken();
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token ? token : ''}`);
    return this.httpClient.put<ContactForm>(`${this.apiUrl}/${id}`, form);
  }
  
  // Delete all contact forms
  onContactDeleteAll(): Observable<any> {
    //const token = this.tokenService.getToken();
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token ? token : ''}`);
    return this.httpClient.delete(this.apiUrl);
  }
}
