import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdmincomponentRoutingModule } from './admincomponent-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { BlogsComponent } from './blogs/blogs.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { QueryComponent } from './query/query.component';
import { LoginComponent } from './login/login.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectsComponent,
    AddProjectComponent,
    EditProjectComponent,
    BlogsComponent,
    AddBlogComponent,
    EditBlogComponent,
    LoginComponent,
    QueryComponent
  ],
  imports: [
    CommonModule,
    AdmincomponentRoutingModule,
    NgbModule,
    NgxPaginationModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdmincomponentModule { }
