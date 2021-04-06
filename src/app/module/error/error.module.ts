import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { Error403Component } from './403/error403.component';
import { Error404Component } from './404/error404.component';
import { Error500Component } from './500/error500.component';

@NgModule({
  declarations: [
    Error403Component,
    Error404Component,
    Error500Component
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule
  ]
})
export class ErrorModule { }
