import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from 'src/app/service/api.service';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';

import { AlertConfirmComponent } from 'src/app/shared/component/alert-confirm.component';

import { Client } from 'src/app/model/client.model';
import { User } from 'src/app/model/user.model';

import { ROUTE } from 'src/app/shared/constant/route.constant';
import { IDNUMBER_NATURE } from 'src/app/shared/constant/idnumber-nature.constant';
import { BEDROOM_TYPE } from 'src/app/shared/constant/bedroom-type.constant';
import { OCCUPATION_TYPE } from 'src/app/shared/constant/occupation-type.constant';
import { DIALOG_CONFIG } from 'src/app/shared/constant/dialog-config.constant';

@Component({
  selector: 'app-client-dialog',
  template: `
  <div class='d-flex justify-content-start mr-4 mb-2'>
    <button (click)='router.navigate([route.path])' mat-icon-button><mat-icon >keyboard_backspace</mat-icon></button>
  </div>
  <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4'>
    <div class='d-flex flex-column'>
      <button *ngIf='activeButton("create")' (click)='create()' mat-mini-fab color='primary' class='mb-1'><mat-icon>save</mat-icon></button>
      <button *ngIf='activeButton("update")' (click)='update()' mat-mini-fab color='primary' class='mb-1'><mat-icon>edit</mat-icon></button>
      <button *ngIf='activeButton("delete")' (click)='delete()' mat-mini-fab color='primary' class='mb-1'><mat-icon>delete_outline</mat-icon></button>
    </div>
  </div>
  <div class='d-flex justify-content-center position-fixed fixed-top mr-4 mb-2'>
    <mat-progress-spinner *ngIf='loader' mode='indeterminate' [diameter]='20'></mat-progress-spinner>
  </div>

  <mat-vertical-stepper linear>
    <mat-step [stepControl]='formPerson'>
      <form [formGroup]='formPerson'>
        <ng-template matStepLabel>{{ 'user_information'|translate }}</ng-template>
          <div class='row mt-1'>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'firstname'|translate }}</mat-label>
                <input matInput formControlName='firstname'>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'name'|translate }}</mat-label>
                <input matInput formControlName='name'>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'birthdate'|translate }}</mat-label>
                <input matInput formControlName='birthdate' [matDatepicker]='birthdate' readonly>
                <mat-datepicker-toggle matSuffix [for]='birthdate'></mat-datepicker-toggle>
                <mat-datepicker #birthdate disabled='false'></mat-datepicker>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'gender'|translate }}</mat-label>
                <mat-select formControlName='gender'>
                  <mat-option value='M'>{{ 'man'|translate }}</mat-option>
                  <mat-option value='W'>{{ 'woman'|translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div class='row'>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'nationality'|translate }}</mat-label>
                <input matInput formControlName='nationality'>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'idnumber'|translate }}</mat-label>
                <input matInput formControlName='idnumber'>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'idnumber_nature'|translate }}</mat-label>
                <mat-select formControlName='idnumberNature'>
                  <mat-option *ngFor='let el of idnumber_nature' [value]='el.value'>{{ el.text }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'phone'|translate }}</mat-label>
                <input matInput formControlName='phone' appNumeric>
              </mat-form-field>
            </div>
          </div>
          <button mat-stroked-button color='primary' class='mt-1' matStepperNext>{{ 'next'|translate }}</button>
        </form>
      </mat-step>


      <mat-step [stepControl]='formClient'>
        <form [formGroup]='formClient'>
          <ng-template matStepLabel>{{ 'client_information'|translate }}</ng-template>
          <div class='row mt-1'>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'enter_date'|translate }}</mat-label>
                <input matInput formControlName='enterDate' [matDatepicker]='enterdate' readonly>
                <mat-datepicker-toggle matSuffix [for]='enterdate'></mat-datepicker-toggle>
                <mat-datepicker #enterdate disabled='false'></mat-datepicker>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'number_of_nights'|translate }}</mat-label>
                <input matInput formControlName='numberOfNights' appNumeric>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'number_of_hours'|translate }}</mat-label>
                <input matInput formControlName='numberOfHours' appNumeric>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'occupation_type'|translate }}</mat-label>
                <mat-select formControlName='occupationType'>
                  <mat-option *ngFor='let el of occupation_type' [value]='el.value'>{{ el.text }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div class='row'>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'bedroom_number'|translate }}</mat-label>
                <input matInput formControlName='bedroomNumber'>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'bedroom_type'|translate }}</mat-label>
                <mat-select formControlName='bedroomType'>
                  <mat-option *ngFor='let el of bedroom_type' [value]='el.value'>{{ el.text }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'number_of_visitors'|translate }}</mat-label>
                <input matInput formControlName='numberOfVisitors' appNumeric>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'partner_gender'|translate }}</mat-label>
                <mat-select formControlName='partnerGender'>
                  <mat-option value='M'>{{ 'man'|translate }}</mat-option>
                  <mat-option value='W'>{{ 'woman'|translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div class='row'>
            <div class='col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'release_date'|translate }}</mat-label>
                <input matInput formControlName='releaseDate' [matDatepicker]='releasedate' readonly>
                <mat-datepicker-toggle matSuffix [for]='releasedate'></mat-datepicker-toggle>
                <mat-datepicker #releasedate disabled='false'></mat-datepicker>
              </mat-form-field>
            </div>
            <div class='col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'signature'|translate }}</mat-label>
                <input matInput formControlName='signature'>
              </mat-form-field>
            </div>
          </div>
        </form>
      </mat-step>

    </mat-vertical-stepper>
  `
})
export class ClientDialogComponent implements OnInit {

  formPerson: FormGroup;
  formClient: FormGroup;
  loader: boolean;
  route = ROUTE;
  readonly idnumber_nature = IDNUMBER_NATURE;
  readonly bedroom_type = BEDROOM_TYPE;
  readonly occupation_type = OCCUPATION_TYPE;
  readonly dialog_config = DIALOG_CONFIG;
  user: User;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    public trans: TranslateService,
    private api: ApiService,
    private auth: AuthService,
    private alert: AlertService
  ) {
    this.route.path = 'client';
    this.route.id = this.activatedRoute.snapshot.params?.id;
    this.user = this.auth.getCredential().user;
  }

  ngOnInit(): void {
    this.createForm();
    if (this.route.id) {
      this.loader = true;
      this.api.findOne(this.route).pipe(first())
        .subscribe(
          (item: Client) => {
            this.formPerson.patchValue(item);
            this.formClient.patchValue(item);
            this.loader = false;
          },
          err => { this.alert.error(err); this.loader = false; }
        );
    }
  }

  createForm(): void {
    this.formPerson = this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      birthdate: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      nationality: ['', Validators.compose([Validators.required])],
      idnumber: ['', Validators.compose([Validators.required])],
      idnumberNature: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])]
    });

    this.formClient = this.fb.group({
      enterDate: ['', Validators.compose([Validators.required])],
      numberOfNights: ['', Validators.compose([Validators.required])],
      numberOfHours: ['', Validators.compose([Validators.required])],
      occupationType: ['', Validators.compose([Validators.required])],
      bedroomNumber: ['', Validators.compose([Validators.required])],
      bedroomType: ['', Validators.compose([Validators.required])],
      numberOfVisitors: ['', Validators.compose([Validators.required])],
      partnerGender: [''],
      releaseDate: ['', Validators.compose([Validators.required])],
      signature: [''],
      establishmentID: [this.user.establishments],
      userID: [this.user.id]
    });
  }

  create(): void {
    this.loader = true;
    this.api.create(this.route, { ...this.formPerson.value, ...this.formClient.value }).pipe(first())
      .subscribe(
        () => { this.alert.success(); this.createForm(); this.loader = false; },
        err => { this.alert.error(err); this.loader = false; }
      );
  }

  update(): void {
    this.loader = true;
    this.api.update(this.route, { ...this.formPerson.value, ...this.formClient.value }).pipe(first())
      .subscribe(
        () => { this.alert.success(); this.loader = false; },
        err => { this.alert.error(err); this.loader = false; }
      );
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

  activeButton(action: string): boolean {
    switch (action) {
      case 'create':
        return !this.route.id && this.formPerson.valid && this.formClient.valid && !this.loader;
      case 'update':
        return this.route.id && this.formPerson.valid && this.formClient.valid && !this.loader;
      case 'delete':
        return this.route.id && !this.loader;
      default:
        return false;
    }
  }

}
