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
import { Establishment } from 'src/app/model';
import { Feature } from 'src/app/enum';
import { DIALOG_CONFIG, ESTABLISHMENT_NATURE } from 'src/app/constant';
import { AlertConfirmComponent } from '../../shared/component';
import { RouteInterface } from 'src/app/interface';

@Component({
  selector: 'app-establishment-dialog',
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

  <form [formGroup]='form' *ngIf='form'>
    <div class='row'>
      <div class='col-sm-4'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'name'|translate }}</mat-label>
          <input matInput formControlName='name'>
        </mat-form-field>
      </div>
      <div class='col-sm-4'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'nature'|translate }}</mat-label>
          <mat-select formControlName='nature'>
            <mat-option *ngFor='let p of establishmentNature' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-sm-4'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'city'|translate }}</mat-label>
          <mat-select formControlName='cityId'>
            <mat-option></mat-option>
            <mat-option [value]='p.id' *ngFor='let p of cities'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <div class='row'>
      <div class='col-sm-4'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'municipality'|translate }}</mat-label>
          <input matInput formControlName='municipality'>
        </mat-form-field>
      </div>
      <div class='col-sm-4'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'location'|translate }}</mat-label>
          <input matInput formControlName='location'>
        </mat-form-field>
      </div>
    </div>
  </form>
  `
})
export class EstablishmentDialogComponent implements OnInit {

  load = false;
  route: RouteInterface;
  form: FormGroup;
  defaultForm: FormGroup;
  readonly dialogConfig = DIALOG_CONFIG;
  readonly establishmentNature = ESTABLISHMENT_NATURE;

  cities: Establishment[] = [];

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
    this.route = { path: Feature.Establishment, id: this.activatedRoute.snapshot.params?.id };
    this.defaultForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      nature: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      municipality: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    forkJoin({
      cities: this.http.get(`${environment.api}/city?sort=asc`)
    }).pipe(first())
      .subscribe((res: any) => this.cities = res.cities);
    if (this.route.id) {
      this.http.get(`${environment.api}/${this.route.path}/${this.route.id}`)
        .pipe(
          first(),
          tap(() => this.load = true),
          finalize(() => this.load = false),
          catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
        )
        .subscribe((item: Establishment) => this.form.patchValue(item));
    }
    this.form = this.defaultForm;
    this.auth.permissions(Feature.Establishment);
  }

  create(): void {
    this.http.post(`${environment.api}/${this.route.path}`, this.form.value)
      .pipe(
        first(),
        tap(() => this.load = true),
        finalize(() => this.load = false),
        catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
      )
      .subscribe(() => {
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
      .subscribe(() => this.alert.success());
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

}
