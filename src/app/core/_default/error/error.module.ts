import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ErrorRoutingModule } from './error-routing.module';
import { Error404Component } from './error404.component';
import { Error500Component } from './error500.component';

@NgModule({
  declarations: [Error404Component, Error500Component],
  imports: [
    CommonModule,
    TranslateModule,
    ErrorRoutingModule
  ]
})
export class ErrorModule { }