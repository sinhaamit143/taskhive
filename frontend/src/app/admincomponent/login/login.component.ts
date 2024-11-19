import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TokenService } from '../../services/token/token.service';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false; 
  
  files: File[] = [];

	
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.loginForm.valid) {
      this.isLoading = true;  // Set loading state to true
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (resp: any) => {
          this.isLoading = false;  // Set loading state to false
          
          if (resp.success) {
            this.tokenService.setToken(resp.accessToken, resp.refreshToken);
            this.tokenService.setUser(resp.user);
            this.router.navigate(['/dashboard']);
            alert("Login Successfully")
            this.alertService.successToast("Login Successfully");
          } else {
            this.alertService.errorToast('Invalid Credentials');
          }
        },
        error: (error) => {
          this.isLoading = false;  // Set loading state to false
          console.error('Login error:', error);
          this.alertService.errorToast('Server connection failed. Please try again later.');
        }
      });
    }
  }
  
}
