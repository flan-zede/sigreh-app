import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { AuthService, CrudService } from 'src/app/service';
import { Region, Department, Establishment } from 'src/app/model';
import { USER_ROLE, IDNUMBER_NATURE, GENDER, NATIONALITY, PHONE_TYPE, DIALOG_CONFIG } from 'src/app/shared/constant';
import { MatDialog } from '@angular/material/dialog';
import { ModalSelectComponent } from 'src/app/shared/component';
import { RelationshipInterface } from 'src/app/shared/interface';

@Component({
  selector: 'app-user-dialog',
  template: `
  <app-form-option [ability]='auth.ability()' [route]='crud.route' [form]='crud.form' [load]='crud.load' 
  (create)='crud.create().subscribe()' (update)='crud.update().subscribe()' (delete)='crud.delete().subscribe()'></app-form-option>

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
          <mat-label>{{ 'idnumber_nature'|translate }}</mat-label>
          <mat-select formControlName='idnumberNature'>
            <mat-option *ngFor='let p of idnumber_nature' [value]='p.id'>{{ p.name }}</mat-option>
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
            <mat-option *ngFor='let p of phone_type' [value]='p.id'>{{ p.name }}</mat-option>
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
            <mat-option *ngFor='let p of user_role' [value]='p.id'>{{ p.name }}</mat-option>
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

  hide: boolean = true;
  readonly user_role = USER_ROLE;
  readonly idnumber_nature = IDNUMBER_NATURE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phone_type = PHONE_TYPE;
  readonly dialogConfig = DIALOG_CONFIG;

  regions: Region[] = [];
  departments: Department[] = [];
  establishments: Establishment[] = [];

  relates: RelationshipInterface[];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    protected dialog: MatDialog,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'user';
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
    }).pipe(first()).subscribe(res => {
      this.regions = res.regions;
      this.departments = res.departments;
      this.establishments = res.establishments;
    });
    this.crud.createForm();
    if (this.crud.route.id) this.crud.readOne().pipe(first()).subscribe();
  }

  modalRelate() {
    var select = [];
    switch (this.crud.form.value.role) {
      case 'DRMT': {
        select = this.crud.form.value.regions;
        this.dialog.open(ModalSelectComponent, { ...this.dialogConfig, data: { list: this.regions, select, multiple: true } })
          .afterClosed().subscribe(p => { this.relate(select, p, 'region'); this.crud.form.patchValue({ regions: p }); });
      } break;
      case 'DDMT': case 'PP': {
        select = this.crud.form.value.departments;
        this.dialog.open(ModalSelectComponent, { ...this.dialogConfig, data: { list: this.departments, select, multiple: true } })
          .afterClosed().subscribe(p => { this.relate(select, p, 'department'); this.crud.form.patchValue({ departments: p }); });
      } break;
      case 'REH': case 'GEH': {
        select = this.crud.form.value.establishments;
        this.dialog.open(ModalSelectComponent, { ...this.dialogConfig, data: { list: this.establishments, select, multiple: true } })
          .afterClosed().subscribe(p => { this.relate(select, p, 'establishment'); this.crud.form.patchValue({ establishments: p }); });
      } break;
      default: break;
    }
  }

  relate(old: any, next: any, table: string) {
    this.crud.route.relates = [];
    var exist: boolean = false;

    old.forEach((o: any) => {
      exist = false;
      next.forEach((n: any) => { if (o.id == n.id) exist = true; });
      if (exist == false) this.crud.route.relates.push({ table, id: o.id, add: false });
    });

    next.forEach((n: any) => {
      exist = false;
      old.forEach((o: any) => { if (o.id == n.id) exist = true; });
      if (exist == false) this.crud.route.relates.push({ table, id: n.id, add: true });
    });

    console.log(this.crud.route.relates);
  }

}
