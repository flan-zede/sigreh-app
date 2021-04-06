import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';

import { CityRoutingModule } from './city-routing.module';
import { CityComponent } from './list/city.component';
import { CityReadComponent } from './read/city-read.component';
import { CityDialogComponent } from './dialog/city-dialog.component';

@NgModule({
  declarations: [
    CityComponent,
    CityReadComponent,
    CityDialogComponent
  ],
  imports: [
    CommonModule,
    CityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class CityModule { }
