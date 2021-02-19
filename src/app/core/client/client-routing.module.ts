import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { ClientComponent } from './client.component';
import { ClientShowComponent } from './client-show.component';
import { ClientDialogComponent } from './client-dialog.component';

import { UserRoleGuard } from 'src/app/shared/guard/user-role.guard';
import { USER_ROLE_HIERARCHY } from 'src/app/shared/constant/app.constant';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        component: ClientComponent
      },
      {
        path: 'new',
        component: ClientDialogComponent,
        canActivate: [UserRoleGuard],
        data: { roles: USER_ROLE_HIERARCHY.REH }
      },
      {
        path: 'show/:id',
        component: ClientShowComponent
      },
      {
        path: 'edit/:id',
        component: ClientDialogComponent,
        canActivate: [UserRoleGuard],
        data: { roles: USER_ROLE_HIERARCHY.ADMIN }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
