import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './list/client.component';
import { ClientReadComponent } from './read/client-read.component';
import { ClientDialogComponent } from './dialog/client-dialog.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientReadComponent,
    ClientDialogComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class ClientModule { }
