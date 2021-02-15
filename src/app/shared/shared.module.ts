import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'src/app/material.module';

import { AlertConfirmComponent } from './component/alert-confirm.component';
import { SearchBarComponent } from './component/search-bar.component';

import { SearchFilterPipe } from './filter/search-filter.pipe';
import { NoSpaceDirective } from './directive/no-space.directive';
import { NumericDirective } from './directive/numeric.directive';
import { ConfirmEqualDirective } from './directive/confirm-equal.directive';

const elements = [
  AlertConfirmComponent,
  SearchBarComponent,
  SearchFilterPipe,
  NoSpaceDirective,
  NumericDirective,
  ConfirmEqualDirective
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
