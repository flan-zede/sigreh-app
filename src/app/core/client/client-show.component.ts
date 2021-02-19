import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from 'src/app/service/api.service';
import { AlertService } from 'src/app/service/alert.service';

import { AlertConfirmComponent } from 'src/app/shared/component/alert-confirm.component';

import { Client } from 'src/app/model/client.model';

import { ROUTE, DIALOG_CONFIG } from 'src/app/shared/constant/app.constant';
import { IDNUMBER_NATURE, BEDROOM_TYPE, OCCUPATION_TYPE, GENDER, NATIONALITY, PHONE_TYPE } from 'src/app/shared/constant/form.constant';

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

    <mat-card class='mb-2'>
      <mat-card-header class='border-bottom border-secondary mb-2'>
        <mat-card-title>{{ 'person_information'|translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class='row'>
          <div class='col-sm-6'>
            <div class='mb-1'> <b>{{ 'firstname'|translate }}</b> <br> {{ item.firstname }} </div>
            <div class='mb-1'> <b>{{ 'name'|translate }}</b> <br> {{ item.name }} </div>
            <div class='mb-1'> <b>{{ 'birthdate'|translate }}</b> <br> {{ item.birthdate | date:'mediumDate':'UTC' }} </div>
            <div class='mb-1'> <b>{{ 'gender'|translate }}</b> <br> {{ gender[item.gender] }} </div>
          </div>
          <div class='col-sm-6'>
            <div class='mb-1'> <b>{{ 'nationality'|translate }}</b> <br> {{ nationality[item.nationality] }} </div>
            <div class='mb-1'> <b>{{ 'idnumber_nature'|translate }}</b> <br> {{ idnumber_nature[item.idnumberNature] }} </div>
            <div class='mb-1'> <b>{{ 'idnumber'|translate }}</b> <br> {{ item.idnumber }} </div>
            <div class='mb-1'> <b>{{ 'phone'|translate }}</b> <br> {{ phone_type[item.phoneType] }} : {{ item.phone }}</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
    
    <mat-card>
      <mat-card-header class='border-bottom border-secondary mb-2'>
        <mat-card-title>{{ 'client_information'|translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class='row'>
          <div class='col-sm-6'>
            <div class='mb-1'><b>{{ 'enter_date'|translate }}</b> <br> {{ item.enterDate }}</div>
            <div class='mb-1'><b>{{ 'occupation_type'|translate }}</b> <br>  {{ occupation_type[item.occupationType] }}</div>
            <div class='mb-1' *ngIf='item.occupationType=="n"'><b>{{ 'number_of_nights'|translate }}</b> <br> {{ item.numberOfNights }}</div>
            <div class='mb-1' *ngIf='item.occupationType=="p"'><b>{{ 'number_of_hours'|translate }}</b> <br> {{ item.numberOfHours }}</div>
          </div>
          <div class='col-sm-6'>
            <div class='mb-1'><b>{{ 'bedroom_type'|translate }}</b> <br> {{ bedroom_type[item.bedroomType] }}</div>
            <div class='mb-1'><b>{{ 'bedroom_number'|translate }}</b> <br> {{ item.bedroomNumber }}</div>
            <div class='mb-1'> <b>{{ 'created_at'|translate }}</b> <br> {{ item.createdAt | date:'mediumDate':'UTC' }} </div>
          </div>
        </div>
        <div class='row'>
          <div class='col-sm-12'>
            <div class='mb-1'><b>{{ 'partner'|translate }}</b></div>
            <div class='mb-1' *ngFor='let el of item.partners'>{{ gender[el.gender] }} : {{ el.name }} : {{ el.age }}</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class ClientShowComponent implements OnInit {

  item = new Client();
  loader: boolean;
  route = ROUTE;
  readonly idnumber_nature = IDNUMBER_NATURE;
  readonly bedroom_type = BEDROOM_TYPE;
  readonly occupation_type = OCCUPATION_TYPE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phone_type = PHONE_TYPE;
  readonly dialog_config = DIALOG_CONFIG;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    public trans: TranslateService,
    private api: ApiService,
    private alert: AlertService
  ) {
    this.route = { path: 'client', id: this.activatedRoute.snapshot.params?.id };
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
