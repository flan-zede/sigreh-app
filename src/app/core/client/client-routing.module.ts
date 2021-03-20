import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseComponent } from 'src/app/layout/base.component';
import { ClientComponent } from './client.component';
import { ClientShowComponent } from './client-show.component';
import { ClientDialogComponent } from './client-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        component: ClientComponent
      },
      {
        path: 'new',
        component: ClientDialogComponent
      },
      {
        path: 'show/:id',
        component: ClientShowComponent
      },
      {
        path: 'edit/:id',
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
