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
import { City, Department } from 'src/app/model';
import { Feature } from 'src/app/enum';
import { DIALOG_CONFIG } from 'src/app/constant';
import { AlertConfirmComponent } from '../../shared/component';
import { RouteInterface } from 'src/app/interface';

@Component({
  selector: 'app-city-dialog',
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
      <div class='col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'name'|translate }}</mat-label>
          <input autocomplete='off' matInput formControlName='name'>
        </mat-form-field>
      </div>
      <div class='col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'department'|translate }}</mat-label>
          <mat-select formControlName='departmentId'>
            <mat-option *ngFor='let p of departments' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>
  </form>
  `
})
export class CityDialogComponent implements OnInit {

  load = false;
  route: RouteInterface;
  form: FormGroup;
  defaultForm: FormGroup;
  readonly dialogConfig = DIALOG_CONFIG;

  departments: Department[] = [];

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
    this.route = { path: Feature.City, id: this.activatedRoute.snapshot.params?.id };
    this.defaultForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      departmentId: ['', Validators.compose([Validators.required])]
    });
  }

    ngOnInit(): void {
      forkJoin({
        departments: this.http.get(`${environment.api}/department?sort=asc`)
      }).pipe(first())
        .subscribe((res: any) => {
          this.departments = res.departments;
        });
      if (this.route.id) {
        this.http.get(`${environment.api}/${this.route.path}/${this.route.id}`)
          .pipe(
            first(),
            tap(() => this.load = true),
            finalize(() => this.load = false),
            catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
          )
          .subscribe((item: City) => this.form.patchValue(item));
      }
      this.form = this.defaultForm;
      this.auth.permissions(Feature.City);
    }

    create(): void {
      this.http.post(`${environment.api}/${this.route.path}`, this.form.value)
        .pipe(
          first(),
          tap(() => this.load = true),
          finalize(() => this.load = false),
          catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
        )
        .subscribe((item: City) => {
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
        .subscribe((item: City) => { this.relate(item); this.alert.success(); });
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

    relate(item: City): void {
    }

}
