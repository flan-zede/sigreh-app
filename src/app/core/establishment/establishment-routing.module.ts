import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { EstablishmentComponent } from './establishment.component';
import { EstablishmentShowComponent } from './establishment-show.component';
import { EstablishmentDialogComponent } from './establishment-dialog.component';

import { UserRoleGuard } from 'src/app/shared/guard/user-role.guard';
import { USER_ROLE_HIERARCHY } from 'src/app/shared/constant/app.constant';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivate: [UserRoleGuard],
    data: { roles: USER_ROLE_HIERARCHY.ADMIN },
    children: [
      {
        path: '',
        component: EstablishmentComponent
      },
      {
        path: 'new',
        component: EstablishmentDialogComponent
      },
      {
        path: 'show/:id',
        component: EstablishmentShowComponent
      },
      {
        path: 'edit/:id',
        component: EstablishmentDialogComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablishmentRoutingModule { }
