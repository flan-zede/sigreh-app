import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';

import { CityRoutingModule } from './city-routing.module';
import { CityComponent } from './city.component';
import { CityShowComponent } from './city-show.component';
import { CityDialogComponent } from './city-dialog.component';

@NgModule({
  declarations: [
    CityComponent,
    CityShowComponent,
    CityDialogComponent
  ],
  imports: [
    CommonModule,
    CityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    SharedModule
  ]
})
export class CityModule { }
