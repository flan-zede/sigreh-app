import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from '../../layout/base.component';
import { CityComponent } from './city.component';
import { CityShowComponent } from './city-show.component';
import { CityDialogComponent } from './city-dialog.component';

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
        data: { feature: Feature.City, permission: Permission.Read },
        component: CityComponent
      },
      {
        path: 'create',
        canActivate: [FeatureGuard],
        data: { feature: Feature.City, permission: Permission.Create },
        component: CityDialogComponent
      },
      {
        path: 'read/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.City, permission: Permission.Read },
        component: CityShowComponent
      },
      {
        path: 'update/:id',
        canActivate: [FeatureGuard],
        data: { feature: Feature.City, permission: Permission.Update },
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
