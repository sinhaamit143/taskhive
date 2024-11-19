import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AdminlayoutComponent } from './adminlayout/adminlayout.component';
import { LoginComponent } from './admincomponent/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layout/layout.module').then((m) =>m.LayoutModule),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
      path: 'login',
      component: LoginComponent,
  },
  {
    path: '',
    component: AdminlayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./adminlayout/adminlayout.module').then((m) =>m.AdminlayoutModule),
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
