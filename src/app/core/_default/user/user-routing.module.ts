import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { UserComponent } from './user.component';
import { UserShowComponent } from './user-show.component';
import { UserDialogComponent } from './user-dialog.component';

import { UserRoleGuard } from 'src/app/shared/guard/user-role.guard';
import { USER_ROLE_HIERARCHY } from 'src/app/shared/constant/user-role-hierarchy.constant';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivate: [UserRoleGuard],
    data: { roles: USER_ROLE_HIERARCHY.ADMIN },
    children: [
      {
        path: '',
        component: UserComponent
      },
      {
        path: 'new',
        component: UserDialogComponent
      },
      {
        path: 'show/:id',
        component: UserShowComponent
      },
      {
        path: 'edit/:id',
        component: UserDialogComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
