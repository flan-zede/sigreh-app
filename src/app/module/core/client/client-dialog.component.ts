import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { Client, Partner, User } from 'src/app/model';
import { IDNUMBER_NATURE, BEDROOM_TYPE, OCCUPATION_TYPE, GENDER, NATIONALITY, PHONE_TYPE, DIALOG_CONFIG } from 'src/app/constant';
import { PartnerComponent } from '../../shared/component';
import { Feature } from 'src/app/enum';

@Component({
  selector: 'app-client-dialog',
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
          <input matInput type='tel' formControlName='phone'>
          <mat-error *ngIf="crud.form.controls['phone'].hasError('minLength')">{{ 'min_length'|translate }} 10</mat-error>
        </mat-form-field>
      </div>
    </div>

    <h3 class='border-bottom'>{{ 'client_information'|translate }}</h3>
    <div class='row'>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'occupationType'|translate }}</mat-label>
          <mat-select formControlName='occupationType'>
            <mat-option *ngFor='let p of occupationType' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6' *ngIf='crud.form.controls["occupationType"].value =="NU"'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'number_of_nights'|translate }}</mat-label>
          <input matInput type='number' min='1' formControlName='numberOfNights'>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6' *ngIf='crud.form.controls["occupationType"].value =="PA"'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'number_of_hours'|translate }}</mat-label>
          <input matInput type='number' min='1' formControlName='numberOfHours'>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'bedroomType'|translate }}</mat-label>
          <mat-select formControlName='bedroomType'>
            <mat-option *ngFor='let p of bedroomType' [value]='p.id'>{{ p.name }}</mat-option>
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
    <button (click)='modalPartner()' mat-stroked-button><mat-icon>add</mat-icon></button>

    <div>
      <table mat-table [dataSource]='crud.form.controls["partners"].value' class='mat-elevation-z8 w-100 mt-2 mb-3'>
        <ng-container matColumnDef='gender'>
          <th mat-header-cell *matHeaderCellDef>{{ 'gender'|translate }}</th>
          <td mat-cell *matCellDef='let p'> <span *ngFor='let e of gender'><span *ngIf='e.id == p.gender'>{{ p.name }}</span></span> </td>
        </ng-container>
        <ng-container matColumnDef='name'>
          <th mat-header-cell *matHeaderCellDef>{{ 'name'|translate }}</th>
          <td mat-cell *matCellDef='let p'> {{ p.name }} </td>
        </ng-container>
        <ng-container matColumnDef='age'>
          <th mat-header-cell *matHeaderCellDef>{{ 'age'|translate }}</th>
          <td mat-cell *matCellDef='let p'> {{ p.age }} </td>
        </ng-container>
        <ng-container matColumnDef='action'>
          <th mat-header-cell *matHeaderCellDef> </th>
          <td mat-cell *matCellDef='let p'> <button mat-stroked-button (click)='deletePartner(p.id)'><mat-icon>close</mat-icon></button> </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef='partnerColumns'></tr>
        <tr mat-row *matRowDef='let row; columns: partnerColumns;'></tr>
      </table>
    </div>

  </form>
  `
})
export class ClientDialogComponent implements OnInit {

  user: User;
  readonly idnumberNature = IDNUMBER_NATURE;
  readonly bedroomType = BEDROOM_TYPE;
  readonly occupationType = OCCUPATION_TYPE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phoneType = PHONE_TYPE;
  readonly dialogConfig = DIALOG_CONFIG;
  maxBirthdate: Date = new Date(new Date().getFullYear() - 20, 0, 1);
  minEnterdate: Date = new Date();
  partnerColumns: string[] = ['gender', 'name', 'age', 'action'];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    protected dialog: MatDialog,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = Feature.Client;
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
    this.user = this.auth.getCredential()?.user;
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
      occupationType: ['', Validators.compose([Validators.required])],
      numberOfNights: [1, Validators.compose([Validators.required, Validators.min(1)])],
      numberOfHours: [1, Validators.compose([Validators.required, Validators.min(1)])],
      bedroomNumber: ['', Validators.compose([Validators.required])],
      bedroomType: ['', Validators.compose([Validators.required])],
      enterDate: ['', Validators.compose([Validators.required])],
      enterTime: ['', Validators.compose([Validators.required])],
      partners: [[]],
      establishmentId: [this.user?.establishments[0]?.id],
      userId: [this.user?.id]
    });
  }

  ngOnInit(): void {
    this.crud.createForm();
    if (this.crud.route.id) { this.crud.readOne().pipe(first()).subscribe(); }
    this.auth.permissions(Feature.Client);
  }

  create(): void{
    this.crud.create().subscribe((item: Client) => this.router.navigate([this.crud.route.path + '/update/' + this.crud.route.id]));
  }

  modalPartner(): void {
    this.dialog.open(PartnerComponent, { ...this.dialogConfig, data: {} }).afterClosed().subscribe((p: any) => {
      if (p) {
        this.crud.pepare('one', 'partner', p);
        this.crud.form.patchValue({ partners: this.crud.form.value.partners.concat(p) });
      }
    });
  }

  deletePartner(id: number): void {
    const partners = this.crud.form.value.partners.filter((p: Partner) => p.id !== id);
    this.crud.form.patchValue({ partners });
    const partner = this.crud.form.value.partners.find((p: Partner) => p.id === id);
    this.crud.pepare('one', 'partner', partner);
  }

}
