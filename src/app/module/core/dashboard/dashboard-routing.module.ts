import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from '../../layout/base.component';
import { DashboardComponent } from './dashboard.component';

import { AuthGuard } from 'src/app/guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: BaseComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
