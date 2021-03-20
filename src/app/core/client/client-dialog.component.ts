import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { Client, User } from 'src/app/model';
import { IDNUMBER_NATURE, BEDROOM_TYPE, OCCUPATION_TYPE, GENDER, NATIONALITY, PHONE_TYPE } from 'src/app/shared/constant';

@Component({
  selector: 'app-client-dialog',
  template: `
  <app-form-option [ability]='auth.ability()' [route]='crud.route' [form]='crud.form' [load]='crud.load' 
  (create)='create()' (update)='crud.update().subscribe()' (delete)='crud.delete().subscribe()'></app-form-option>

  <form [formGroup]='crud.form'>
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
          <input matInput [matDatepicker]='birthdate' [max]='maxBirthdate' readonly formControlName='birthdate'>
          <mat-datepicker-toggle matSuffix [for]='birthdate'></mat-datepicker-toggle>
          <mat-datepicker touchUi #birthdate></mat-datepicker>
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
          <mat-label>{{ 'nationality'|translate }}</mat-label>
          <mat-select formControlName='nationality'>
            <mat-option *ngFor='let p of nationality' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
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
          <input matInput type='tel' formControlName='phone'>
          <mat-error *ngIf="crud.form.controls['phone'].hasError('minLength')">{{ 'min_length'|translate }} 10</mat-error>
        </mat-form-field>
      </div>
    </div>

    <h3 class='border-bottom'>{{ 'client_information'|translate }}</h3>
    <div class='row'>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'occupation_type'|translate }}</mat-label>
          <mat-select formControlName='occupationType'>
            <mat-option *ngFor='let p of occupation_type' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6' *ngIf='crud.form.controls["occupationType"].value =="NU"'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'number_of_nights'|translate }}</mat-label>
          <input matInput type='number' min='0' formControlName='numberOfNights'>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6' *ngIf='crud.form.controls["occupationType"].value =="PA"'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'number_of_hours'|translate }}</mat-label>
          <input matInput type='number' min='0' formControlName='numberOfHours'>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'bedroom_type'|translate }}</mat-label>
          <mat-select formControlName='bedroomType'>
            <mat-option *ngFor='let p of bedroom_type' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'bedroom_number'|translate }}</mat-label>
          <input matInput formControlName='bedroomNumber'>
        </mat-form-field>
      </div>
    </div>

    <div class='row'>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'enter_date'|translate }}</mat-label>
          <input matInput [matDatepicker]='enterdate' [min]='minEnterdate' readonly formControlName='enterDate'>
          <mat-datepicker-toggle matSuffix [for]='enterdate'></mat-datepicker-toggle>
          <mat-datepicker touchUi #enterdate startView='year'></mat-datepicker>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'enter_time'|translate }}</mat-label>
          <input matInput type='time' formControlName='enterTime'>
        </mat-form-field>
      </div>
    </div>

    <h3 class='border-bottom'>{{ 'partner'|translate }}</h3>
    <button mat-stroked-button (click)='addPartner()'><mat-icon>add</mat-icon></button>
    <div class='mt-3' formArrayName='partners' *ngFor='let partner of crud.form.get("partners")["controls"]; let i = index;'>
      <div class='row' [formGroupName]='i'>
        <div class='col-sm-5'>
          <mat-form-field appearance='outline'>
            <mat-label>{{ 'gender'|translate }}</mat-label>
            <mat-select formControlName='gender'>
              <mat-option *ngFor='let p of gender' [value]='p.id'>{{ p.name }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class='col-sm-5'>
          <mat-form-field appearance='outline'>
            <mat-label>{{ 'age'|translate }}</mat-label>
            <input matInput type='number' formControlName='age'>
          </mat-form-field>
        </div>
        <div class='col-sm-2'><button mat-icon-button type='button' (click)='removePartner(i)'><mat-icon>close</mat-icon></button></div>
      </div>
    </div>
  </form>

  <br>
  `
})
export class ClientDialogComponent implements OnInit {

  user: User;
  readonly idnumber_nature = IDNUMBER_NATURE;
  readonly bedroom_type = BEDROOM_TYPE;
  readonly occupation_type = OCCUPATION_TYPE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phone_type = PHONE_TYPE;
  maxBirthdate: Date = new Date(new Date().getFullYear() - 20, 0, 1);
  minEnterdate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'client';
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
    this.user = this.auth.getCredential().user;
    this.crud.defaultForm = this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      birthdate: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      nationality: ['', Validators.compose([Validators.required])],
      idnumber: ['', Validators.compose([Validators.required])],
      idnumberNature: ['', Validators.compose([Validators.required])],
      phoneType: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      occupationType: ['NU', Validators.compose([Validators.required])],
      numberOfNights: ['', Validators.compose([Validators.required])],
      numberOfHours: ['', Validators.compose([Validators.required])],
      bedroomNumber: ['', Validators.compose([Validators.required])],
      bedroomType: ['', Validators.compose([Validators.required])],
      enterDate: ['', Validators.compose([Validators.required])],
      enterTime: ['', Validators.compose([Validators.required])],
      partners: this.fb.array([]),
      establishmentId: [this.user.establishments[0]?.id],
      userId: [this.user.id]
    });
  }

  ngOnInit(): void {
    this.crud.createForm();
    if (this.crud.route.id) this.crud.readOne().subscribe();
  }

  create() {
    const formArray = <FormArray>this.crud.form.get('partners');
    this.crud.create().pipe(first()).subscribe((item: Client) => {
      while (formArray.length !== 0) {
        this.crud.route.path = 'partner';
        this.crud.create({ ...formArray.value[0], clientId: item.id }).subscribe();;
        formArray.removeAt(0);
      }
      this.crud.route.path = 'client';
      this.crud.createForm();
    });
  }

  addPartner(): void { (<FormArray>this.crud.form.get('partners')).push(this.fb.group({ gender: [''], age: [''], clientId: [''] })); }
  removePartner(idx: number): void { (<FormArray>this.crud.form.get('partners')).removeAt(idx); }
}
