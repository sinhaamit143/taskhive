import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentRoutingModule } from './component-routing.module';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { HomeComponent } from './home/home.component';
import { PricingComponent } from './pricing/pricing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { ServicesComponent } from './services/services.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

@NgModule({
  declarations: [
    AboutComponent,
    ContactComponent,
    PortfolioComponent,
    HomeComponent,
    PricingComponent,
    PrivacyPolicyComponent,
    TermsConditionComponent,
    ServicesComponent,
    BlogDetailsComponent,
    ProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    ComponentRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class ComponentModule { }
