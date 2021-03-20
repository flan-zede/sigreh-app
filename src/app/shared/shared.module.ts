import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';

import {
  AlertConfirmComponent,
  FormOptionComponent,
  ModalSelectComponent,
  PaginatorComponent,
  SearchBarComponent,
  ViewOptionComponent
} from './component';

import {
  ConfirmEqualDirective,
  NoSpaceDirective,
  NumericDirective
} from './directive';

import { SearchFilterPipe } from './pipe';

const elements = [
  AlertConfirmComponent,
  FormOptionComponent,
  ModalSelectComponent,
  PaginatorComponent,
  SearchBarComponent,
  ViewOptionComponent,
  ConfirmEqualDirective,
  NoSpaceDirective,
  NumericDirective
];

@NgModule({
  declarations: elements,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    SearchFilterPipe
  ],
  exports: elements
})
export class SharedModule { }
