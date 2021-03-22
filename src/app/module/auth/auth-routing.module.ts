import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseAuthComponent } from '../layout/base-auth.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AuthComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
