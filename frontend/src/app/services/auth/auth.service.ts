import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { environment } from '../../../environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http :HttpClient,
    private router:Router,
    private as:AlertService,
    private ts : TokenService
  ) { }

  // register(data:any) {
  //   return this.http.post(`${environment.url}/auth/register`, data);
  // }

  login(data:any) {
    console.log('Backend URL:', environment.url);  // Add this line
    return this.http.post(`${environment.url}/auth/login`, data);
  }

  isLoggedIn(): boolean {
    if (this.ts.getToken()) {
      return true;
    } else {
      return false;
    }
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  logout() {
   this.as.infoToast('You are logged out.');
    this.cleanUserData();
    this.router.navigate(['/login'])
    // }
    // );
  }

  cleanUserData() {
    localStorage.removeItem('user');
    localStorage.removeItem('Token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/']);
  }
}
