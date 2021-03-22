import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'src/app/module/material/material.module';

import { HeaderComponent } from './header.component';
import { SideNavigationComponent } from './side-navigation.component';
import { TopNavigationComponent } from './top-navigation.component';
import { BaseComponent } from './base.component';
import { BaseAuthComponent } from './base-auth.component';

@NgModule({
  declarations: [
    BaseAuthComponent,
    BaseComponent,
    HeaderComponent,
    SideNavigationComponent,
    TopNavigationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    TranslateModule,
    MaterialModule
  ],
  exports: [
    BaseAuthComponent,
    BaseComponent
  ]
})
export class LayoutModule { }
