import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { RegionComponent } from './region.component';
import { RegionShowComponent } from './region-show.component';
import { RegionDialogComponent } from './region-dialog.component';

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
        component: RegionComponent
      },
      {
        path: 'new',
        component: RegionDialogComponent
      },
      {
        path: 'show/:id',
        component: RegionShowComponent
      },
      {
        path: 'edit/:id',
        component: RegionDialogComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionRoutingModule { }
