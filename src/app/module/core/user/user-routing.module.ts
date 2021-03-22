import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from '../../layout/base.component';
import { UserComponent } from './user.component';
import { UserShowComponent } from './user-show.component';
import { UserDialogComponent } from './user-dialog.component';

import { AuthGuard, FeatureGuard } from 'src/app/guard';
import { Feature, Permission } from 'src/app/enum';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: BaseComponent,
    children: [
      {
        path: '',
        canActivate: [FeatureGuard],
        data: { feature: Feature.User, permission: Permission.Read },
        component: UserComponent
      },
      {
        path: 'create',
        canActivate: [FeatureGuard],
        data: { feature: Feature.User, permission: Permission.Create },
        component: UserDialogComponent
      },
      {
        path: 'read/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.User, permission: Permission.Read },
        component: UserShowComponent
      },
      {
        path: 'update/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.User, permission: Permission.Update },
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
