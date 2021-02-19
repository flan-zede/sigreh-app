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
import { Region } from 'src/app/model/region.model';
import { Department } from 'src/app/model/department.model';
import { Establishment } from 'src/app/model/establishment.model';

import { ROUTE, USER_ROLE, DIALOG_CONFIG } from 'src/app/shared/constant/app.constant';
import { IDNUMBER_NATURE, GENDER, NATIONALITY, PHONE_TYPE } from 'src/app/shared/constant/form.constant';
import { RelationInterface, RouteInterface } from 'src/app/shared/interface/app.interface';

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
  <div class='d-flex justify-content-center mr-4 mb-2'>
    <mat-progress-spinner *ngIf='loader' mode='indeterminate' [diameter]='20'></mat-progress-spinner>
  </div>

  <mat-vertical-stepper linear>
    <mat-step [stepControl]='formPerson'>
      <form [formGroup]='formPerson'>
        <ng-template matStepLabel>{{ 'person_information'|translate }}</ng-template>
          <div class='row mt-2'>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'firstname'|translate }}</mat-label>
                <input matInput formControlName='firstname'>
              </mat-form-field>
            </div>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'name'|translate }}</mat-label>
                <input matInput formControlName='name'>
              </mat-form-field>
            </div>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'birthdate'|translate }}</mat-label>
                <input matInput formControlName='birthdate' [matDatepicker]='birthdate' readonly>
                <mat-datepicker-toggle matSuffix [for]='birthdate'></mat-datepicker-toggle>
                <mat-datepicker #birthdate disabled='false'></mat-datepicker>
              </mat-form-field>
            </div>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'gender'|translate }}</mat-label>
                <mat-select formControlName='gender'>
                  <mat-option *ngFor='let el of gender | keyvalue' [value]='el.key'>{{ el.value }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div class='row'>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'nationality'|translate }}</mat-label>
                <mat-select formControlName='nationality'>
                  <mat-option *ngFor='let el of nationality | keyvalue' [value]='el.key'>{{ el.value }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'idnumber_nature'|translate }}</mat-label>
                <mat-select formControlName='idnumberNature'>
                  <mat-option *ngFor='let el of idnumber_nature | keyvalue' [value]='el.key'>{{ el.value }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'idnumber'|translate }}</mat-label>
                <input matInput formControlName='idnumber'>
              </mat-form-field>
            </div>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'phone_type'|translate }}</mat-label>
                <mat-select formControlName='phoneType'>
                  <mat-option *ngFor='let el of phone_type | keyvalue' [value]='el.key'>{{ el.value }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'phone'|translate }}</mat-label>
                <input matInput formControlName='phone'>
              </mat-form-field>
            </div>
          </div>
          <button mat-stroked-button color='primary' class='mt-1' matStepperNext>{{ 'next'|translate }}</button>
        </form>
      </mat-step>


      <mat-step [stepControl]='formAccount'>
        <form [formGroup]='formAccount'>
          <ng-template matStepLabel>{{ 'account_information'|translate }}</ng-template>
          <div class='row mt-2'>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'username'|translate }}</mat-label>
                <input matInput formControlName='username'>
              </mat-form-field>
            </div>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'email'|translate }}</mat-label>
                <input matInput formControlName='email'>
              </mat-form-field>
            </div>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'password'|translate }}</mat-label>
                <input matInput [type]="hide ? 'password' : 'text'" formControlName='password' #password>
                <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
              </mat-form-field>
            </div>
            <div class='col-md-3 col-sm-6'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'confirm_password'|translate }}</mat-label>
                <input matInput [type]="hide ? 'password' : 'text'" formControlName='confirmPassword' appConfirmEqual='password'>
                <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
                <mat-error *ngIf='formAccount.controls["confirmPassword"].errors?.notEqual'>{{ 'password_confirm_match'|translate }}</mat-error>
              </mat-form-field>
            </div>
          </div>

          <div class='row'>
            <div class='col-md-4'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'role'|translate }}</mat-label>
                <mat-select formControlName='role'>
                  <mat-option *ngFor='let el of user_role | keyvalue' [value]='el.key'>{{ el.value }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-md-4' *ngIf='formAccount.controls["role"].value == "drmt"' >
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'region'|translate }}</mat-label>
                <mat-select [(value)]='selectedR' multiple required>
                  <mat-option *ngFor='let el of regions' [value]='el.id'>{{ el.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-md-4' *ngIf='formAccount.controls["role"].value == "ddmt" || formAccount.controls["role"].value == "pp"'>
              <mat-form-field appearance='outline'>
                <mat-label>{{ 'department'|translate }}</mat-label>
                <mat-select [(value)]='selectedD' multiple required>
                  <mat-option *ngFor='let el of departments' [value]='el.id'>{{ el.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-md-4' *ngIf='formAccount.controls["role"].value == "reh" || formAccount.controls["role"].value == "geh"'>
              <mat-form-field appearance='outline' >
                <mat-label>{{ 'establishment'|translate }}</mat-label>
                <mat-select [(value)]='selectedE' required>
                  <mat-option *ngFor='let el of establishments' [value]='el.id'>{{ el.name }} . {{ el.city?.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class='col-md-4'>
              <mat-slide-toggle formControlName='blocked'></mat-slide-toggle>&nbsp;{{ 'blocked'|translate }}
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
  loader: boolean;
  hide: boolean = true;

  route: RouteInterface = ROUTE;
  relation: RelationInterface;

  readonly user_role = USER_ROLE;
  readonly idnumber_nature = IDNUMBER_NATURE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phone_type = PHONE_TYPE;
  readonly dialog_config = DIALOG_CONFIG;

  regions: Region[] = null;
  departments: Department[] = null;
  establishments: Establishment[] = null;

  selectedR: number[] = null;
  selectedD: number[] = null;
  selectedE: number = null;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    public trans: TranslateService,
    private api: ApiService,
    private alert: AlertService
  ) {
    this.route = { path: 'user', id: this.activatedRoute.snapshot.params?.id };
    this.relation = { id: this.route.id, action: 'add' };
  }

  ngOnInit(): void {
    forkJoin({
      regions: this.api.findAll({ ...this.route, path: 'region' }),
      departments: this.api.findAll({ ...this.route, path: 'department' }),
      establishments: this.api.findAll({ ...this.route, path: 'establishment' })
    }).pipe(first())
      .subscribe(
        res => {
          this.regions = res.regions;
          this.departments = res.departments;
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
      phoneType: ['', Validators.compose([Validators.required])],
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
  }

  create() {
    this.loader = true;
    this.api.create(this.route, { ...this.formPerson.value, ...this.formAccount.value })
    .pipe(first())
      .subscribe(
        (item: User) => { 
          this.setRelations(item.id);
          this.alert.success(); 
          this.createForm(); 
          this.loader = false; 
        },
        err => { this.alert.error(err); this.loader = false; }
      );
  }

  update(): void {
    this.loader = true;
    this.api.update(this.route, { ...this.formPerson.value, ...this.formAccount.value })
    .pipe(first())
      .subscribe(
        () => { 
          this.setRelations();
          this.alert.success(); 
          this.loader = false; 
        },
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
        return !this.route.id && this.formPerson.valid && this.formAccount.valid && !this.loader;
      case 'update':
        return this.route.id && this.formPerson.valid && this.formAccount.valid  && !this.loader;
      case 'delete':
        return this.route.id && !this.loader;
      default:
        return false;
    }
  }

  setRelations(id?: number){
    let object: number[];
    if(this.selectedR != null) { this.relation.path = 'region'; object = this.selectedR; }
    if(this.selectedD != null) { this.relation.path = 'department'; object = this.selectedD; }
    if(this.selectedE != null) { this.relation.path = 'establishment'; object = [this.selectedE]; }
    if(id) this.relation.id = id;
    object.forEach(relatedId => {
      this.api.related(this.route, { ...this.relation, relatedId }).pipe(first()).subscribe(() => {});
    });
  }

}
