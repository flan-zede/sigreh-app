import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { DistrictComponent } from './district.component';
import { DistrictShowComponent } from './district-show.component';
import { DistrictDialogComponent } from './district-dialog.component';

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
        component: DistrictComponent
      },
      {
        path: 'new',
        component: DistrictDialogComponent
      },
      {
        path: 'show/:id',
        component: DistrictShowComponent
      },
      {
        path: 'edit/:id',
        component: DistrictDialogComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistrictRoutingModule { }
