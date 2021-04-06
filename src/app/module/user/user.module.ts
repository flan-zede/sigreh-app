import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './list/user.component';
import { UserReadComponent } from './read/user-read.component';
import { UserDialogComponent } from './dialog/user-dialog.component';

@NgModule({
  declarations: [
    UserComponent,
    UserReadComponent,
    UserDialogComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class UserModule { }
