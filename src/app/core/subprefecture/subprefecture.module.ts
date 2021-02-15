import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { SubprefectureRoutingModule } from './subprefecture-routing.module';
import { SubprefectureComponent } from './subprefecture.component';
import { SubprefectureDialogComponent } from './subprefecture-dialog.component';
import { SubprefectureShowComponent } from './subprefecture-show.component';

@NgModule({
  declarations: [SubprefectureComponent, SubprefectureShowComponent, SubprefectureDialogComponent],
  imports: [
    CommonModule,
    SubprefectureRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    SharedModule
  ]
})
export class SubprefectureModule { }
