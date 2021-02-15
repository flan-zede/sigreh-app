import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { DistrictRoutingModule } from './district-routing.module';
import { DistrictComponent } from './district.component';
import { DistrictDialogComponent } from './district-dialog.component';
import { DistrictShowComponent } from './district-show.component';

@NgModule({
  declarations: [DistrictComponent, DistrictShowComponent, DistrictDialogComponent],
  imports: [
    CommonModule,
    DistrictRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    SharedModule
  ]
})
export class DistrictModule { }
