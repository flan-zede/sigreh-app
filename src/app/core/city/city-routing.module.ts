import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { CityComponent } from './city.component';
import { CityShowComponent } from './city-show.component';
import { CityDialogComponent } from './city-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
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
