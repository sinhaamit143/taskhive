import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ' ',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./../admincomponent/admincomponent.module').then((m) => m.AdmincomponentModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminlayoutRoutingModule { }
