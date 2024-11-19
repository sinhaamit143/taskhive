import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  decodedToken: any;
  token: any;
  constructor(
    private route : Router,
  ) { }

  setToken(token: string, refreshToken: string) {
    localStorage.setItem('Token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getToken() {
    const token = localStorage.getItem('Token');
    this.token = token;
    return token;
  }

  getRefreshToken() {
    const token = localStorage.getItem('refershToken');
    return token;
  }

  deleteToken() {
    localStorage.removeItem('Token');
    localStorage.removeItem('refershToken');
    this.route.navigate(['/login'])
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  decodeToken() {
    if (this.getToken()) {
      this.decodedToken = jwtDecode(this.token);
    }
  }

  getDecodeToken() {
    return jwtDecode(this.token);
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: any = this.getExpiryTime();
    if (expiryTime) {
      return 1000 * expiryTime - new Date().getTime() < 5000;
    } else {
      return false;
    }
  }
}
