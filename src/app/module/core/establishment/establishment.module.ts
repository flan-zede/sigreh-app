import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';

import { EstablishmentRoutingModule } from './establishment-routing.module';
import { EstablishmentComponent } from './establishment.component';
import { EstablishmentDialogComponent } from './establishment-dialog.component';
import { EstablishmentShowComponent } from './establishment-show.component';

@NgModule({
  declarations: [
    EstablishmentComponent,
    EstablishmentShowComponent,
    EstablishmentDialogComponent
  ],
  imports: [
    CommonModule,
    EstablishmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    SharedModule
  ]
})
export class EstablishmentModule { }
