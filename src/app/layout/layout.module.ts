import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './header.component';
import { SideNavigationComponent } from './side-navigation.component';
import { TopNavigationComponent } from './top-navigation.component';
import { BaseComponent } from './base.component';
import { BaseAuthComponent } from './base-auth.component';

import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [HeaderComponent, SideNavigationComponent, TopNavigationComponent, BaseComponent, BaseAuthComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    TranslateModule,
    MaterialModule
  ],
  exports: [BaseComponent, BaseAuthComponent]
})
export class LayoutModule { }
