import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { SubprefectureComponent } from './subprefecture.component';
import { SubprefectureShowComponent } from './subprefecture-show.component';
import { SubprefectureDialogComponent } from './subprefecture-dialog.component';

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
        component: SubprefectureComponent
      },
      {
        path: 'new',
        component: SubprefectureDialogComponent
      },
      {
        path: 'show/:id',
        component: SubprefectureShowComponent
      },
      {
        path: 'edit/:id',
        component: SubprefectureDialogComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubprefectureRoutingModule { }
