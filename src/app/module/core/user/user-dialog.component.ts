import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AlertService, AuthService } from 'src/app/service';
import { Department, Establishment, Region, User } from 'src/app/model';
import { ManyToManyInterface, RouteInterface } from 'src/app/interface';
import { Feature } from 'src/app/enum';
import { IDNUMBER_NATURE, GENDER, NATIONALITY, PHONE_TYPE, DIALOG_CONFIG, ROLE } from 'src/app/constant';
import { AlertConfirmComponent, ModalSelectComponent } from '../../shared/component';

@Component({
  selector: 'app-user-dialog',
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
    <div class='mb-2'><mat-slide-toggle formControlName='active'></mat-slide-toggle> &nbsp; {{ 'active'|translate }}</div>

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

    <h3 class='border-bottom'>{{ 'accountInformation'|translate }}</h3>
    <div class='row'>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'username'|translate }}</mat-label>
          <input matInput formControlName='username'>
          <mat-error *ngIf="form.controls['username'].hasError('minLength')">{{ 'min_length'|translate }} 5</mat-error>
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
          <mat-error *ngIf="form.controls['password'].hasError('minLength')">{{ 'min_length'|translate }} 5</mat-error>
        </mat-form-field>
      </div>
      <div class='col-md-3 col-sm-6'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'confirmPassword'|translate }}</mat-label>
          <input matInput [type]="hide ? 'password' : 'text'" formControlName='confirmPassword' appConfirmEqual='password'>
          <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
          <mat-error *ngIf='form.controls["confirmPassword"].errors?.notEqual'>{{ 'passwordConfirmMatch'|translate }}</mat-error>
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
      <div class='col-md-6'></div>
    </div>

    <div class='row'>
      <div class='col-md-12'>
        <div *ngIf='["DRMT"].includes(form.controls["role"].value)'>
          <h3 class='border-bottom'><button (click)='region()' mat-stroked-button><mat-icon>add</mat-icon></button> {{ 'region'|translate }}</h3>
          <mat-chip-list>
            <mat-chip *ngFor='let p of form.controls["regions"].value'>{{ p.name }}</mat-chip>
          </mat-chip-list>
        </div>
        <div *ngIf='["DDMT","PP"].includes(form.controls["role"].value)'>
          <h3 class='border-bottom'><button (click)='department()' mat-stroked-button><mat-icon>add</mat-icon></button> {{ 'department'|translate }}</h3>
          <mat-chip-list>
            <mat-chip *ngFor='let p of form.controls["departments"].value'>{{ p.name }}</mat-chip>
          </mat-chip-list>
        </div>
        <div *ngIf='["REH","GEH"].includes(form.controls["role"].value)'>
          <h3 class='border-bottom'><button (click)='establishment()' mat-stroked-button><mat-icon>add</mat-icon></button> {{ 'establishment'|translate }}</h3>
          <mat-chip-list>
            <mat-chip *ngFor='let p of form.controls["establishments"].value'>{{ p.name }}</mat-chip>
          </mat-chip-list>
        </div>
      </div>
    </div>
  </form>

  <br>
  `
})
export class UserDialogComponent implements OnInit {

  load = false;
  route: RouteInterface;
  form: FormGroup;
  defaultForm: FormGroup;
  readonly dialogConfig = DIALOG_CONFIG;

  hide = true;
  readonly role = ROLE;
  readonly idnumberNature = IDNUMBER_NATURE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phoneType = PHONE_TYPE;

  regions: Region[] = [];
  regionsTemp: Region[] = [];

  departments: Department[] = [];
  departmentsTemp: Department[] = [];

  establishments: Establishment[] = [];
  establishmentsTemp: Establishment[] = [];

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
    this.route = { path: Feature.User, id: this.activatedRoute.snapshot.params?.id };
    this.defaultForm = this.fb.group({
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
      regions: this.http.get(`${environment.api}/region?sort=asc`),
      departments: this.http.get(`${environment.api}/department?sort=asc`),
      establishments: this.http.get(`${environment.api}/establishment?sort=asc`)
    }).pipe(first())
      .subscribe((res: any) => {
        this.regions = res.regions;
        this.departments = res.departments;
        this.establishments = res.establishments;
      });
    if (this.route.id) {
      this.http.get(`${environment.api}/${this.route.path}/${this.route.id}`)
        .pipe(
          first(),
          tap(() => this.load = true),
          finalize(() => this.load = false),
          catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
        )
        .subscribe((item: User) => {
          this.regionsTemp = item.regions;
          this.departmentsTemp = item.departments;
          this.establishmentsTemp = item.establishments;
          this.form.patchValue(item);
        });
    }
    this.form = this.defaultForm;
    this.auth.permissions(Feature.User);
  }

  create(): void {
    this.http.post(`${environment.api}/${this.route.path}`, this.form.value)
      .pipe(
        first(),
        tap(() => this.load = true),
        finalize(() => this.load = false),
        catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
      )
      .subscribe((item: User) => {
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
      .subscribe((item: User) => { this.relate(item); this.alert.success(); });
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

  relate(item: User): void {
    this.diff('region', this.regionsTemp, this.form.value.regions).forEach((data: ManyToManyInterface) =>
      this.http.post(`${environment.api}/${this.route.path}/${item.id}/relate`, data)
        .pipe(first())
        .subscribe()
    );
    this.diff('department', this.departmentsTemp, this.form.value.departments).forEach((data: ManyToManyInterface) =>
      this.http.post(`${environment.api}/${this.route.path}/${item.id}/relate`, data)
        .pipe(first())
        .subscribe()
    );
    this.diff('establishment', this.establishmentsTemp, this.form.value.establishments).forEach((data: ManyToManyInterface) =>
      this.http.post(`${environment.api}/${this.route.path}/${item.id}/relate`, data)
        .pipe(first())
        .subscribe()
    );
  }

  region(): void {
    const c = { ...this.dialogConfig, data: { list: this.regions, select: this.form.value.regions, multiple: true } };
    this.dialog.open(ModalSelectComponent, c).afterClosed()
      .subscribe((p: any) => this.form.patchValue({ regions: p }));
  }

  department(): void {
    const c = { ...this.dialogConfig, data: { list: this.departments, select: this.form.value.departments, multiple: true } };
    this.dialog.open(ModalSelectComponent, c).afterClosed()
      .subscribe((p: any) => this.form.patchValue({ departments: p }));
  }

  establishment(): void {
    const c = { ...this.dialogConfig, data: { list: this.establishments, select: this.form.value.establishments, multiple: false } };
    this.dialog.open(ModalSelectComponent, c).afterClosed()
      .subscribe((p: any) => this.form.patchValue({ establishments: p }));
  }

  diff(table: string, old: any, next: any): ManyToManyInterface[] {
    const diff: ManyToManyInterface[] = [];
    let exist = false;
    next.forEach((n: any) => {
      exist = false;
      old.forEach((o: any) => { if (o.id === n.id) { exist = true; } });
      if (exist === false) { diff.push({ table, id: n.id, add: true }); }
    });
    old.forEach((o: any) => {
      exist = false;
      next.forEach((n: any) => { if (o.id === n.id) { exist = true; } });
      if (exist === false) { diff.push({ table, id: o.id, add: false }); }
    });
    return diff;
  }

}
