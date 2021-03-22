import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ErrorRoutingModule } from './error-routing.module';
import { Error403Component } from './error403.component';
import { Error404Component } from './error404.component';
import { Error500Component } from './error500.component';

@NgModule({
  declarations: [
    Error403Component,
    Error404Component,
    Error500Component
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ErrorRoutingModule
  ]
})
export class ErrorModule { }
