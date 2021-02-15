import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { DepartmentComponent } from './department.component';
import { DepartmentShowComponent } from './department-show.component';
import { DepartmentDialogComponent } from './department-dialog.component';

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
        component: DepartmentComponent
      },
      {
        path: 'new',
        component: DepartmentDialogComponent
      },
      {
        path: 'show/:id',
        component: DepartmentShowComponent
      },
      {
        path: 'edit/:id',
        component: DepartmentDialogComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
