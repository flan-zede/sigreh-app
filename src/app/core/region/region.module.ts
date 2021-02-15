import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { RegionRoutingModule } from './region-routing.module';
import { RegionComponent } from './region.component';
import { RegionDialogComponent } from './region-dialog.component';
import { RegionShowComponent } from './region-show.component';

@NgModule({
  declarations: [RegionComponent, RegionShowComponent, RegionDialogComponent],
  imports: [
    CommonModule,
    RegionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    SharedModule
  ]
})
export class RegionModule { }
