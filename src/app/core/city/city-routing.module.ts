import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { CityComponent } from './city.component';
import { CityShowComponent } from './city-show.component';
import { CityDialogComponent } from './city-dialog.component';

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
        component: CityComponent
      },
      {
        path: 'new',
        component: CityDialogComponent
      },
      {
        path: 'show/:id',
        component: CityShowComponent
      },
      {
        path: 'edit/:id',
        component: CityDialogComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
