import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from 'src/app/service/api.service';
import { AlertService } from 'src/app/service/alert.service';

import { AlertConfirmComponent } from 'src/app/shared/component/alert-confirm.component';

import { Client } from 'src/app/model/client.model';

import { ROUTE } from 'src/app/shared/constant/route.constant';
import { DIALOG_CONFIG } from 'src/app/shared/constant/dialog-config.constant';

@Component({
  selector: 'app-client-show',
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

    <div class='row'>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'firstname'|translate }}</mat-label>
          {{ item.firstname }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'name'|translate }}</mat-label>
          {{ item.name }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'birthdate'|translate }}</mat-label>
          {{ item.birthdate }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'gender'|translate }}</mat-label>
          {{ item.gender }}
      </div>
    </div>

    <div class='row'>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'phone'|translate }}</mat-label>
          {{ item.phone }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'nationality'|translate }}</mat-label>
          {{ item.nationality }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'idnumber'|translate }}</mat-label>
          {{ item.idnumber }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'idnumber_nature'|translate }}</mat-label>
          {{ item.idnumberNature }}
      </div>
    </div>

    <div class='row'>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'enter_date'|translate }}</mat-label>
          {{ item.enterDate }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'number_of_nights'|translate }}</mat-label>
          {{ item.numberOfNights }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'number_of_hours'|translate }}</mat-label>
          {{ item.numberOfHours }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'occupation_type'|translate }}</mat-label>
          {{ item.occupationType }}
      </div>
    </div>

    <div class='row'>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'bedroom_number'|translate }}</mat-label>
          {{ item.bedroomNumber }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'bedroom_type'|translate }}</mat-label>
          {{ item.bedroomType }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'number_of_visitors'|translate }}</mat-label>
          {{ item.numberOfVisitors }}
      </div>
      <div class='col-lg-3 col-md-6'>
        <mat-label>{{ 'partner_gender'|translate }}</mat-label>
          {{ item.partnerGender }}
      </div>
    </div>

    <div class='row'>
      <div class='col-md-6'>
        <mat-label>{{ 'release_date'|translate }}</mat-label>
          {{ item.releaseDate }}
      </div>
      <div class='col-md-6'>
        <mat-label>{{ 'signature'|translate }}</mat-label>
          {{ item.signature }}
      </div>
    </div>
  `
})
export class ClientShowComponent implements OnInit {

  item = new Client();
  loader: boolean;
  route = ROUTE;
  readonly dialog_config = DIALOG_CONFIG;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    public trans: TranslateService,
    private api: ApiService,
    private alert: AlertService
  ) {
    this.route.path = 'client';
    this.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    if (this.route.id) {
      this.loader = true;
      this.api.findOne(this.route).pipe(first())
        .subscribe(
          (item: Client) => { this.item = item; this.loader = false; },
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
