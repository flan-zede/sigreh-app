import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from 'src/app/module/material/material.module';

import { LayoutDefaultComponent } from './default/layout-default.component';
import { LayoutHeaderComponent } from './header/layout-header.component';
import { LayoutSidenavComponent } from './sidenav/layout-sidenav.component';

@NgModule({
  declarations: [
    LayoutDefaultComponent,
    LayoutHeaderComponent,
    LayoutSidenavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    LayoutDefaultComponent
  ]
})
export class LayoutModule { }
