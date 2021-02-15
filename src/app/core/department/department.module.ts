import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';
import { DepartmentDialogComponent } from './department-dialog.component';
import { DepartmentShowComponent } from './department-show.component';

@NgModule({
  declarations: [DepartmentComponent, DepartmentShowComponent, DepartmentDialogComponent],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    SharedModule
  ]
})
export class DepartmentModule { }
