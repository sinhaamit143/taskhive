import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { TokenService } from '../token/token.service';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    public tokenService: TokenService,
    public router: Router,
    private as: AlertService,
    private auth: AuthService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = this.tokenService.getToken();

    if (token) {
      if (!this.tokenService.isTokenExpired()) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        this.as.warningToast('Session Expired! Please Login');
        this.auth.logout();
        this.router.navigate(['/login']);
        return next.handle(request); // Ensure the request continues, even if token is expired
      }
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // Handle success response if needed
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              const msg = 'You are not authorized to perform this action';
              this.as.errorToast(msg);
              this.router.navigate([`/login`]);
            } else {
              this.as.errorToast(err.error?.error?.message || 'An error occurred');
            }
          }
        }
      )
    );
  }
}
