import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ContactService } from './services/contact/contact.service';
import { BlogService } from './services/blog/blog.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminlayoutComponent } from './adminlayout/adminlayout.component';
import { AdminHeaderComponent } from './adminlayout/admin-header/admin-header.component';
import { AdminSidebarComponent } from './adminlayout/admin-sidebar/admin-sidebar.component';
import { TokenInterceptorService } from './services/interceptor/token-interceptor.service';
import { AuthService } from './services/auth/auth.service';



@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    AdminlayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
    
  ],
  providers: [ContactService,BlogService,AuthService, TokenInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
