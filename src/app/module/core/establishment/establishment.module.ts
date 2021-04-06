import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/module/material/material.module';
import { SharedModule } from 'src/app/module/shared/shared.module';

import { EstablishmentRoutingModule } from './establishment-routing.module';
import { EstablishmentComponent } from './list/establishment.component';
import { EstablishmentReadComponent } from './read/establishment-read.component';
import { EstablishmentDialogComponent } from './dialog/establishment-dialog.component';

@NgModule({
  declarations: [
    EstablishmentComponent,
    EstablishmentReadComponent,
    EstablishmentDialogComponent
  ],
  imports: [
    CommonModule,
    EstablishmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class EstablishmentModule { }
