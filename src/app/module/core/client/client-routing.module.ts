import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutDefaultComponent } from 'src/app/module/layout/default/layout-default.component';
import { ClientComponent } from './list/client.component';
import { ClientReadComponent } from './read/client-read.component';
import { ClientDialogComponent } from './dialog/client-dialog.component';

import { AuthGuard, FeatureGuard } from 'src/app/guard';
import { Feature, Permission } from 'src/app/enum';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutDefaultComponent,
    children: [
      {
        path: '',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Client, permission: Permission.Read },
        component: ClientComponent
      },
      {
        path: 'read/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Client, permission: Permission.Read },
        component: ClientReadComponent
      },
      {
        path: 'create',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Client, permission: Permission.Create },
        component: ClientDialogComponent
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
