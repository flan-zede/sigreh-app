import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from '../../layout/base.component';
import { ClientComponent } from './client.component';
import { ClientShowComponent } from './client-show.component';
import { ClientDialogComponent } from './client-dialog.component';

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
        data: { feature: Feature.Client, permission: Permission.Read },
        component: ClientComponent
      },
      {
        path: 'create',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Client, permission: Permission.Create },
        component: ClientDialogComponent
      },
      {
        path: 'read/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Client, permission: Permission.Read },
        component: ClientShowComponent
      },
      {
        path: 'update/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Client, permission: Permission.Update },
        component: ClientDialogComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
