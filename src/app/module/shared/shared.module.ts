import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';

import {
  AlertConfirmComponent,
  ModalSelectComponent,
  PaginatorComponent,
  PartnerComponent,
  SearchBarComponent,
} from './component';

import {
  ConfirmEqualDirective,
  NoSpaceDirective,
  NumericDirective
} from './directive';

import {
  SearchFilterPipe
} from './pipe';


const elements = [
  AlertConfirmComponent,
  ModalSelectComponent,
  PaginatorComponent,
  PartnerComponent,
  SearchBarComponent,
  ConfirmEqualDirective,
  NoSpaceDirective,
  NumericDirective,
  SearchFilterPipe
];

@NgModule({
  declarations: elements,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule
  ],
  exports: elements
})
export class SharedModule { }
