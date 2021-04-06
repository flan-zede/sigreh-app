import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutDefaultComponent } from 'src/app/module/layout/default/layout-default.component';
import { EstablishmentComponent } from './list/establishment.component';
import { EstablishmentReadComponent } from './read/establishment-read.component';
import { EstablishmentDialogComponent } from './dialog/establishment-dialog.component';

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
        data: { feature: Feature.Establishment, permission: Permission.Read },
        component: EstablishmentComponent
      },
      {
        path: 'read/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Establishment, permission: Permission.Read },
        component: EstablishmentReadComponent
      },
      {
        path: 'create',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Establishment, permission: Permission.Create },
        component: EstablishmentDialogComponent
      },
      {
        path: 'update/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Establishment, permission: Permission.Update },
        component: EstablishmentDialogComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablishmentRoutingModule { }
