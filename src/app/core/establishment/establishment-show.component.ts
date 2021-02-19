import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from 'src/app/service/api.service';
import { AlertService } from 'src/app/service/alert.service';

import { AlertConfirmComponent } from 'src/app/shared/component/alert-confirm.component';

import { Establishment } from 'src/app/model/establishment.model';

import { ROUTE, DIALOG_CONFIG } from 'src/app/shared/constant/app.constant';
import { ESTABLISHMENT_NATURE } from 'src/app/shared/constant/form.constant';

@Component({
  selector: 'app-establishment-show',
  template: `
    <div class='d-flex justify-content-start mr-4 mb-2'>
      <button (click)='router.navigate([route.path])' mat-icon-button><mat-icon >keyboard_backspace</mat-icon></button>
    </div>
    <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4'>
      <div class='d-flex flex-column'>
        <button (click)='router.navigate([route.path, "new"])' mat-mini-fab color='primary' class='mb-1'><mat-icon>add</mat-icon></button>
        <button (click)='router.navigate([route.path + "/edit", route.id])' mat-mini-fab color='primary' class='mb-1'><mat-icon>edit</mat-icon></button>
        <button (click)='delete()' mat-mini-fab color='primary' class='mb-1'><mat-icon>delete_outline</mat-icon></button>
      </div>
    </div>
    <div class='d-flex justify-content-center mr-4 mb-2'>
      <mat-progress-spinner *ngIf='loader' mode='indeterminate' [diameter]='20'></mat-progress-spinner>
    </div>

    <mat-card>
      <mat-card-content>
        <div class='row'>
          <div class='col-sm-6'>
            <div class='mb-1'><b>{{ 'name'|translate }}</b> <br> {{ item.name }}</div>
            <div class='mb-1'><b>{{ 'nature'|translate }}</b> <br> {{ establishment_nature[item.nature] }}</div>
            <div class='mb-1'><b>{{ 'city'|translate }}</b> <br> {{ item.city?.name }}</div>
          </div>
          <div class='col-sm-6'>
            <div class='mb-1'><b>{{ 'municipality'|translate }}</b> <br> {{ item.municipality }}</div>
            <div class='mb-1'><b>{{ 'location'|translate }}</b> <br> {{ item.location }}</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class EstablishmentShowComponent implements OnInit {

  item = new Establishment();
  loader: boolean;
  route = ROUTE;
  readonly establishment_nature = ESTABLISHMENT_NATURE;
  readonly dialog_config = DIALOG_CONFIG;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    public trans: TranslateService,
    private api: ApiService,
    private alert: AlertService
  ) {
    this.route.path = 'establishment';
    this.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    if (this.route.id) {
      this.loader = true;
      this.api.findOne(this.route).pipe(first())
        .subscribe(
          (item: Establishment) => { this.item = item; this.loader = false; },
          err => { this.alert.error(err); this.loader = false; }
        );
    }
  }

  delete(): void {
    this.dialog.open(AlertConfirmComponent, { data: { message: this.trans.get('confirm.delete') } }).afterClosed()
      .subscribe(
        res => {
          if (res) {
            this.loader = true;
            this.api.delete(this.route, this.route.id).pipe(first())
              .subscribe(
                () => { this.alert.success(); this.router.navigate([this.route.path]); this.loader = false; },
                err => { this.alert.error(err); this.loader = false; }
              );
          }
        }
      );
  }

}
