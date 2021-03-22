import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { AuthService, CrudService } from 'src/app/service';
import { Region, Department, Establishment, User } from 'src/app/model';
import { ROLE, IDNUMBER_NATURE, GENDER, NATIONALITY, PHONE_TYPE, DIALOG_CONFIG } from 'src/app/constant';

import { ModalSelectComponent } from '../../shared/component';
import { Feature, Permission } from 'src/app/enum';

@Component({
  selector: 'app-user-dialog',
  template: `
  <div class='d-flex justify-content-start'>
    <mat-icon (click)='router.navigate([crud.route.path])'>keyboard_backspace</mat-icon>
  </div>

  <div *ngIf='crud.load' class='d-flex justify-content-center'><mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner></div>

  <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4'>
    <div class='d-flex flex-column'>
      <button *ngIf='auth.permission.create && !crud.load && !crud.route.id && crud.form.valid' (click)='create()' mat-mini-fab color='primary' class='mb-1'><mat-icon>save</mat-icon></button>
      <button *ngIf='auth.permission.update && !crud.load && crud.route.id && crud.form.valid' (click)='crud.update().subscribe()' mat-mini-fab color='primary' class='mb-1'><mat-icon>edit</mat-icon></button>
      <button *ngIf='auth.permission.delete && !crud.load && crud.route.id' (click)='crud.delete().subscribe()' mat-mini-fab color='warn' class='mb-1'><mat-icon>delete_outline</mat-icon></button>
    </div>
  </div>

  <br>

  <form [formGroup]='crud.form'>
    <div class='mb-2'><mat-slide-toggle formControlName='active'></mat-slide-toggle> &nbsp; {{ 'active'|translate }}</div>

    <h3 class='border-bottom'>{{ 'person_information'|translate }}</h3>
    <div class='row'>
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
            <mat-option *ngFor='let p of gender' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <div class='row'>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'idnumberNature'|translate }}</mat-label>
          <mat-select formControlName='idnumberNature'>
            <mat-option *ngFor='let p of idnumberNature' [value]='p.id'>{{ p.name }}</mat-option>
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
          <mat-label>{{ 'phoneType'|translate }}</mat-label>
          <mat-select formControlName='phoneType'>
            <mat-option *ngFor='let p of phoneType' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'phone'|translate }}</mat-label>
          <input matInput formControlName='phone'>
        </mat-form-field>
      </div>
    </div>
    <div class='row'>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'nationality'|translate }}</mat-label>
          <mat-select formControlName='nationality'>
            <mat-option></mat-option>
            <mat-option [value]='p.id' *ngFor='let p of nationality'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <br>

    <h3 class='border-bottom'>{{ 'account_information'|translate }}</h3>
    <div class='row'>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'username'|translate }}</mat-label>
          <input matInput formControlName='username'>
          <mat-error *ngIf="crud.form.controls['username'].hasError('minLength')">{{ 'min_length'|translate }} 5</mat-error>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'email'|translate }}</mat-label>
          <input matInput type='email' formControlName='email'>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'password'|translate }}</mat-label>
          <input matInput [type]="hide ? 'password' : 'text'" formControlName='password' #password>
          <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
          <mat-error *ngIf="crud.form.controls['password'].hasError('minLength')">{{ 'min_length'|translate }} 5</mat-error>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'confirm_password'|translate }}</mat-label>
          <input matInput [type]="hide ? 'password' : 'text'" formControlName='confirmPassword' appConfirmEqual='password'>
          <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
          <mat-error *ngIf='crud.form.controls["confirmPassword"].errors?.notEqual'>{{ 'password_confirm_match'|translate }}</mat-error>
        </mat-form-field>
      </div>
    </div>

    <div class='row'>
      <div class='col-md-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'role'|translate }}</mat-label>
          <mat-select formControlName='role'>
            <mat-option *ngFor='let p of role' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-6'>
        <div *ngIf='["DRMT","DDMT","PP","REH","GEH"].includes(crud.form.controls["role"].value)'>
          <button (click)='modalRelate()' mat-stroked-button><mat-icon>edit</mat-icon></button>
        </div>
      </div>
    </div>

    <div class='row'>
      <div class='col-md-12'>
        <div *ngIf='["DRMT"].includes(crud.form.controls["role"].value)'>
          <mat-chip-list>
            <mat-chip *ngFor='let p of crud.form.controls["regions"].value'>{{ p.name }}</mat-chip>
          </mat-chip-list>
        </div>
        <div *ngIf='["DDMT","PP"].includes(crud.form.controls["role"].value)'>
          <mat-chip-list>
            <mat-chip *ngFor='let p of crud.form.controls["departments"].value'>{{ p.name }}</mat-chip>
          </mat-chip-list>
        </div>
        <div *ngIf='["REH","GEH"].includes(crud.form.controls["role"].value)'>
          <mat-chip-list>
            <mat-chip *ngFor='let p of crud.form.controls["establishments"].value'>{{ p.name }}</mat-chip>
          </mat-chip-list>
        </div>
      </div>
    </div>
  </form>

  <br>
  `
})
export class UserDialogComponent implements OnInit {

  hide = true;
  readonly role = ROLE;
  readonly idnumberNature = IDNUMBER_NATURE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phoneType = PHONE_TYPE;
  readonly dialogConfig = DIALOG_CONFIG;

  regions: Region[] = [];
  departments: Department[] = [];
  establishments: Establishment[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    protected dialog: MatDialog,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = Feature.User;
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
    this.crud.defaultForm = this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      birthdate: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      nationality: ['', Validators.compose([Validators.required])],
      idnumber: ['', Validators.compose([Validators.required])],
      idnumberNature: ['', Validators.compose([Validators.required])],
      phoneType: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])],
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      active: [true],
      role: ['', Validators.compose([Validators.required])],
      regions: [[]],
      departments: [[]],
      establishments: [[]],
    });
  }

  ngOnInit(): void {
    forkJoin({
      regions: this.crud.readAll('region'),
      departments: this.crud.readAll('department'),
      establishments: this.crud.readAll('establishment')
    }).pipe(first()).subscribe((res: any) => {
      this.regions = res.regions;
      this.departments = res.departments;
      this.establishments = res.establishments;
    });
    this.crud.createForm();
    if (this.crud.route.id) { this.crud.readOne().pipe(first()).subscribe(); }
    this.auth.permissions(Feature.User);
  }

  create(): void{
    this.crud.create().subscribe((item: User) => this.router.navigate([this.crud.route.path + '/update/' + this.crud.route.id]));
  }

  modalRelate(): void {
    let select = [];
    switch (this.crud.form.value.role) {
      case 'DRMT': {
        select = this.crud.form.value.regions;
        this.dialog.open(ModalSelectComponent, { ...this.dialogConfig, data: { list: this.regions, select, multiple: true } })
          .afterClosed()
          .subscribe((p: any) => {
            this.crud.pepare('many', 'region', p, select);
            this.crud.form.patchValue({ regions: p });
          });
      }
                   break;
      case 'DDMT':
      case 'PP': {
        select = this.crud.form.value.departments;
        this.dialog.open(ModalSelectComponent, { ...this.dialogConfig, data: { list: this.departments, select, multiple: true } })
          .afterClosed()
          .subscribe((p: any) => {
            this.crud.pepare('many', 'department', p, select);
            this.crud.form.patchValue({ departments: p });
          });
      }          break;
      case 'REH':
      case 'GEH': {
        select = this.crud.form.value.establishments;
        this.dialog.open(ModalSelectComponent, { ...this.dialogConfig, data: { list: this.establishments, select, multiple: false } })
          .afterClosed()
          .subscribe((p: any) => {
            this.crud.pepare('many', 'establishment', p, select);
            this.crud.form.patchValue({ establishments: p });
          });
      }           break;
      default: break;
    }
  }

}
