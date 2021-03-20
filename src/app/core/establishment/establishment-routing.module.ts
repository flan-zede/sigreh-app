import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { EstablishmentComponent } from './establishment.component';
import { EstablishmentShowComponent } from './establishment-show.component';
import { EstablishmentDialogComponent } from './establishment-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        component: EstablishmentComponent
      },
      {
        path: 'new',
        component: EstablishmentDialogComponent
      },
      {
        path: 'show/:id',
        component: EstablishmentShowComponent
      },
      {
        path: 'edit/:id',
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
