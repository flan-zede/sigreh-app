import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseAuthComponent } from 'src/app/layout/base-auth.component';
import { AuthComponent } from './auth.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseAuthComponent,
    children: [
      {
        path: '',
        component: AuthComponent
      },
      {
        path: 'me',
        component: AuthComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
