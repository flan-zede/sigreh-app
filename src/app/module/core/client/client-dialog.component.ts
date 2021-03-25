import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AlertService, AuthService } from 'src/app/service';
import { Client, Partner, User } from 'src/app/model';
import { Feature } from 'src/app/enum';
import { IDNUMBER_NATURE, BEDROOM_TYPE, OCCUPATION_TYPE, GENDER, NATIONALITY, PHONE_TYPE, DIALOG_CONFIG } from 'src/app/constant';
import { AlertConfirmComponent, PartnerComponent } from '../../shared/component';
import { RouteInterface } from 'src/app/interface';

@Component({
  selector: 'app-client-dialog',
  template: `
  <div class='d-flex justify-content-start'>
    <mat-icon (click)='router.navigate([route.path])'>keyboard_backspace</mat-icon>
  </div>

  <div *ngIf='load' class='d-flex justify-content-center'><mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner></div>

  <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4 mb-4'>
    <div class='d-flex flex-column'>
      <button *ngIf='auth.permission.create && !route.id' [disabled]='load' (click)='create()' mat-fab color='primary'><mat-icon>save</mat-icon></button>
      <button *ngIf='auth.permission.update && route.id' [disabled]='load || !form.valid' (click)='update()' mat-fab color='primary' class='mt-2 mb-2'><mat-icon>edit</mat-icon></button>
      <button *ngIf='auth.permission.delete && route.id' [disabled]='load' (click)='delete()' mat-fab color='warn'><mat-icon>delete_outline</mat-icon></button>
    </div>
  </div>

  <br>

  <form [formGroup]='form'>
    <h3 class='border-bottom'>{{ 'personInformation'|translate }}</h3>
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
          <mat-error *ngIf="form.controls['phone'].hasError('minLength')">{{ 'min_length'|translate }} 10</mat-error>
        </mat-form-field>
      </div>
    </div>

    <h3 class='border-bottom'>{{ 'clientInformation'|translate }}</h3>
    <div class='row'>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'occupationType'|translate }}</mat-label>
          <mat-select formControlName='occupationType'>
            <mat-option *ngFor='let p of occupationType' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6' *ngIf='form.controls["occupationType"].value =="NU"'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'numberOfNights'|translate }}</mat-label>
          <input matInput type='number' min='1' formControlName='numberOfNights'>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6' *ngIf='form.controls["occupationType"].value =="PA"'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'numberOfHours'|translate }}</mat-label>
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
          <mat-label>{{ 'bedroomNumber'|translate }}</mat-label>
          <input matInput formControlName='bedroomNumber'>
        </mat-form-field>
      </div>
    </div>

    <div class='row'>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'enterDate'|translate }}</mat-label>
          <input matInput [matDatepicker]='enterdate' [min]='minEnterdate' readonly formControlName='enterDate'>
          <mat-datepicker-toggle matSuffix [for]='enterdate'></mat-datepicker-toggle>
          <mat-datepicker touchUi #enterdate startView='year'></mat-datepicker>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'enterTime'|translate }}</mat-label>
          <input matInput type='time' formControlName='enterTime'>
        </mat-form-field>
      </div>
    </div>

    <h3 class='border-bottom'><button (click)='partner()' mat-stroked-button><mat-icon>add</mat-icon></button> {{ 'partner'|translate }}</h3>
    <table class='w-100 mt-2 mb-3'>
      <thead>
        <tr>
          <th></th>
          <th>{{ 'gender'|translate }}</th>
          <th>{{ 'name'|translate }}</th>
          <th>{{ 'age'|translate }}</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor='let p of form.controls["partners"].value; let index = index;'>
          <td>{{ index }}</td>
          <td><span *ngFor='let e of gender'><span *ngIf='e.id == p.gender'>{{ p.name }}</span></span></td>
          <td>{{ p.name }}</td>
          <td>{{ p.age }}</td>
          <td><button mat-stroked-button (click)='partner(index)'><mat-icon>close</mat-icon></button></td>
        </tr>
      </tbody>
    </table>

  </form>
  `
})
export class ClientDialogComponent implements OnInit {

  load = false;
  route: RouteInterface;
  form: FormGroup;
  defaultForm: FormGroup;
  readonly dialogConfig = DIALOG_CONFIG;

  user: User;
  minEnterdate: Date = new Date();
  maxBirthdate: Date = new Date(new Date().getFullYear() - 20, 0, 1);

  readonly idnumberNature = IDNUMBER_NATURE;
  readonly bedroomType = BEDROOM_TYPE;
  readonly occupationType = OCCUPATION_TYPE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phoneType = PHONE_TYPE;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    protected dialog: MatDialog,
    private http: HttpClient,
    private trans: TranslateService,
    private alert: AlertService,
    public auth: AuthService
  ) {
    this.route = { path: Feature.Client, id: this.activatedRoute.snapshot.params?.id };
    this.user = this.auth.getCredential()?.user;
    this.defaultForm = this.fb.group({
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
    if (this.route.id) {
      this.http.get(`${environment.api}/${this.route.path}/${this.route.id}`)
        .pipe(
          first(),
          tap(() => this.load = true),
          finalize(() => this.load = false),
          catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
        )
        .subscribe((item: Client) => this.form.patchValue(item));
    }
    this.form = this.defaultForm;
    this.auth.permissions(Feature.Client);
  }

  create(): void {
    this.http.post(`${environment.api}/${this.route.path}`, this.form.value)
      .pipe(
        first(),
        tap(() => this.load = true),
        finalize(() => this.load = false),
        catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
      )
      .subscribe((item: Client) => {
        this.relate(item);
        this.alert.success();
        this.form = this.defaultForm;
      });
  }

  update(): void {
    this.http.put(`${environment.api}/${this.route.path}/${this.route.id}`, this.form.value)
      .pipe(
        first(),
        tap(() => this.load = true),
        finalize(() => this.load = false),
        catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
      )
      .subscribe((item: Client) => { this.relate(item); this.alert.success(); });
  }

  delete(): void {
    this.trans.stream('alertMessage.delete')
      .subscribe(text =>
        this.dialog.open(AlertConfirmComponent, { data: { text } }).afterClosed()
          .subscribe(res => {
            if (res) {
              this.http.delete(`${environment.api}/${this.route.path}/${this.route.id}`)
                .pipe(
                  first(),
                  tap(() => this.load = true),
                  finalize(() => this.load = false),
                  catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
                )
                .subscribe(() => this.router.navigate([this.route.path]));
            }
          }
          )
      );
  }

  relate(item: Client): void {
    this.form.value.partners.forEach((p: Partner) => {
      if (!p.id) { this.http.post(`${environment.api}/partner`, { ...p, clientId: item.id }).subscribe(); }
    });
  }

  partner(index?: number): void {
    if (index) {
      const partner = this.form.value.partners[index];
      if (partner.id) {
        this.trans.stream('alertMessage.delete')
          .subscribe(text =>
            this.dialog.open(AlertConfirmComponent, { data: { text } }).afterClosed()
              .subscribe(res => {
                if (res) {
                  this.http.delete(`${environment.api}/partner/${partner.id}`)
                    .pipe(first())
                    .subscribe(() => this.form.value.partners.splice(index, 1));
                }
              }
              )
          );
      }
      else { this.form.value.partners.splice(index, 1); }
    }
    else {
      this.dialog.open(PartnerComponent, { ...this.dialogConfig, data: {} }).afterClosed()
        .subscribe((p: any) => { if (p) { this.form.value.partners.concat(p); } });
    }
  }

}
