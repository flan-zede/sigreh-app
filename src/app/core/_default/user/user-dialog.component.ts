import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from 'src/app/service/api.service';
import { AlertService } from 'src/app/service/alert.service';

import { AlertConfirmComponent } from 'src/app/shared/component/alert-confirm.component';

import { User } from 'src/app/model/user.model';
import { District } from 'src/app/model/district.model';
import { Region } from 'src/app/model/region.model';
import { Department } from 'src/app/model/department.model';
import { Subprefecture } from 'src/app/model/subprefecture.model';
import { City } from 'src/app/model/city.model';
import { Establishment } from 'src/app/model/establishment.model';

import { ROUTE } from 'src/app/shared/constant/route.constant';
import { USER_ROLE } from 'src/app/shared/constant/user-role.constant';
import { IDNUMBER_NATURE } from 'src/app/shared/constant/idnumber-nature.constant';
import { DIALOG_CONFIG } from 'src/app/shared/constant/dialog-config.constant';

@Component({
  selector: 'app-user-dialog',
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
        <ng-template matStepLabel>{{ 'person_information'|translate }}</ng-template>
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


      <mat-step [stepControl]='formAccount'>
        <form [formGroup]='formAccount'>
          <ng-template matStepLabel>{{ 'account_information'|translate }}</ng-template>
          <div class='row mt-1'>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'username'|translate }}</mat-label>
                <input matInput formControlName='username'>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'email'|translate }}</mat-label>
                <input matInput formControlName='email'>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'password'|translate }}</mat-label>
                <input matInput [type]="hide ? 'password' : 'text'" formControlName='password' #password>
                <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'confirm_password'|translate }}</mat-label>
                <input matInput [type]="hide ? 'password' : 'text'" formControlName='confirmPassword' appConfirmEqual='password'>
                <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
                <mat-error *ngIf='formAccount.controls["confirmPassword"].errors?.notEqual'>{{ 'password_confirm_match'|translate }}</mat-error>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6 mb-1'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'role'|translate }}</mat-label>
                <mat-select formControlName='role'>
                  <mat-option *ngFor='let el of user_role' [value]='el.value'>{{ el.text }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div class='row'>
            <div class='col-lg-12'>
              <mat-slide-toggle formControlName='blocked'></mat-slide-toggle>&nbsp;{{ 'blocked'|translate }}
            </div>
          </div>
          <div class='mt-1'>
            <button mat-stroked-button color='primary' matStepperPrevious>{{ 'back'|translate }}</button>
            <button mat-stroked-button color='primary' matStepperNext>{{ 'next'|translate }}</button>
          </div>
        </form>
      </mat-step>


      <mat-step [stepControl]='formRelation'>
        <form [formGroup]='formRelation'>
          <ng-template matStepLabel>{{ 'relation_information'|translate }}</ng-template>
          <div class='row mt-1'>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'district'|translate }}</mat-label>
                <mat-select formControlName='districts'>
                  <mat-option *ngFor='let el of districts' [value]='el.id'>{{ el.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'region'|translate }}</mat-label>
                <mat-select formControlName='regions'>
                  <mat-option *ngFor='let el of regions' [value]='el.id'>{{ el.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'department'|translate }}</mat-label>
                <mat-select formControlName='departments'>
                  <mat-option *ngFor='let el of departments' [value]='el.id'>{{ el.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-lg-3 col-md-6'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'subprefecture'|translate }}</mat-label>
                <mat-select formControlName='subprefectures'>
                  <mat-option *ngFor='let el of subprefectures' [value]='el.id'>{{ el.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div class='row'>
            <div class='col-md-6'>
              <mat-form-field appearance='outline'>
                <mat-label> {{ 'city'|translate }}</mat-label>
                <mat-select formControlName='cities'>
                  <mat-option *ngFor='let el of cities' [value]='el.id'>{{ el.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-md-6'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'establishment'|translate }}</mat-label>
                <mat-select formControlName='establishments'>
                  <mat-option *ngFor='let el of establishments' [value]='el.id'>{{ el.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </form>
      </mat-step>

    </mat-vertical-stepper>
  `
})
export class UserDialogComponent implements OnInit {

  formPerson: FormGroup;
  formAccount: FormGroup;
  formRelation: FormGroup;
  loader: boolean;
  hide: boolean = true;
  route = ROUTE;
  readonly idnumber_nature = IDNUMBER_NATURE;
  readonly user_role = USER_ROLE;
  readonly dialog_config = DIALOG_CONFIG;
  districts: District[] = [];
  regions: Region[] = [];
  departments: Department[] = [];
  subprefectures: Subprefecture[] = [];
  cities: City[] = [];
  establishments: Establishment[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    public trans: TranslateService,
    private api: ApiService,
    private alert: AlertService
  ) {
    this.route.path = 'user';
    this.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    forkJoin({
      districts: this.api.findAll({ ...this.route, path: 'district' }),
      regions: this.api.findAll({ ...this.route, path: 'region' }),
      departments: this.api.findAll({ ...this.route, path: 'department' }),
      subprefectures: this.api.findAll({ ...this.route, path: 'subprefecture' }),
      cities: this.api.findAll({ ...this.route, path: 'city' }),
      establishments: this.api.findAll({ ...this.route, path: 'establishment' })
    }).pipe(first())
      .subscribe(
        res => {
          this.districts = res.districts;
          this.regions = res.regions;
          this.departments = res.departments;
          this.subprefectures = res.subprefectures;
          this.cities = res.cities;
          this.establishments = res.establishments;
        }
      );

    this.createForm();
    if (this.route.id) {
      this.loader = true;
      this.api.findOne(this.route).pipe(first())
        .subscribe(
          (item: User) => {
            this.formPerson.patchValue(item);
            this.formAccount.patchValue(item);
            this.formRelation.patchValue(item);
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
    this.formAccount = this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      blocked: [false, Validators.compose([Validators.required])],
      role: ['', Validators.compose([Validators.required])]
    });
    this.formRelation = this.fb.group({
      districts: [''],
      regions: [''],
      departments: [''],
      subprefectures: [''],
      cities: [''],
      establishments: ['']
    });
  }

  create(): void {
    this.loader = true;
    this.api.create(this.route, { ...this.formPerson.value, ...this.formAccount.value, ...this.formRelation.value })
    .pipe(first())
      .subscribe(
        () => { this.alert.success(); this.createForm(); this.loader = false; },
        err => { this.alert.error(err); this.loader = false; }
      );
  }

  update(): void {
    this.loader = true;
    this.api.update(this.route, { ...this.formPerson.value, ...this.formAccount.value, ...this.formRelation.value })
    .pipe(first())
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
        return !this.route.id && this.formPerson.valid && this.formAccount.valid && this.formRelation.valid && !this.loader;
      case 'update':
        return this.route.id && this.formPerson.valid && this.formAccount.valid && this.formRelation.valid && !this.loader;
      case 'delete':
        return this.route.id && !this.loader;
      default:
        return false;
    }
  }

}
