import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { BlogsComponent } from './blogs/blogs.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { QueryComponent } from './query/query.component';
import { AuthGuard } from '../services/authGuard/auth.guard';

const routes: Routes = [
  {
    path:'dashboard',
    component:DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'projects',
    component:ProjectsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'projects/add-project',
    component:AddProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'projects/edit-project/:id',
    component:EditProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'query',
    component:QueryComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'blogs',
    component:BlogsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'blogs/add-blog',
    component:AddBlogComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'blogs/edit-blog/:id',
    component:EditBlogComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmincomponentRoutingModule { }
