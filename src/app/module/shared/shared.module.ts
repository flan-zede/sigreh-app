import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';

import {
  ConfirmComponent,
  SelectComponent,
  PaginatorComponent,
  PartnerComponent,
  SearchbarComponent,
} from './component';

import {
  ConfirmEqualDirective,
  NoSpaceDirective
} from './directive';

import {
  SearchFilterPipe
} from './pipe';

const elements = [
  ConfirmComponent,
  SelectComponent,
  PaginatorComponent,
  PartnerComponent,
  SearchbarComponent,
  ConfirmEqualDirective,
  NoSpaceDirective,
  SearchFilterPipe
];

@NgModule({
  declarations: elements,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: elements
})
export class SharedModule { }
