import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private httpClient: HttpClient) {}

  onContactSave(contactForm: any) {
    console.log(contactForm)
    return this.httpClient.post('http://localhost:5000/contact', contactForm);
  }


  onContactGetAll() {
    return this.httpClient.get('http://localhost:5000/contact');
  }

  onContactDelete(id: string) {
    return this.httpClient.delete('http://localhost:5000/contact/'+ id);
  }

  onContactFindOne(id: string) {
    return this.httpClient.get('http://localhost:5000/contact/'+ id);
  }

  onContactUpdate(id: string, form: any) {
    return this.httpClient.put('http://localhost:5000/contact/'+ id, form);
  }
}