import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from '../../layout/base.component';
import { EstablishmentComponent } from './establishment.component';
import { EstablishmentShowComponent } from './establishment-show.component';
import { EstablishmentDialogComponent } from './establishment-dialog.component';

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
        data: { feature: Feature.Establishment, permission: Permission.Read },
        component: EstablishmentComponent
      },
      {
        path: 'create',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Establishment, permission: Permission.Create },
        component: EstablishmentDialogComponent
      },
      {
        path: 'read/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.Establishment, permission: Permission.Read },
        component: EstablishmentShowComponent
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
