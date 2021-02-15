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

import { City } from 'src/app/model/city.model';
import { Subprefecture } from 'src/app/model/subprefecture.model';

import { ROUTE } from 'src/app/shared/constant/route.constant';
import { DIALOG_CONFIG } from 'src/app/shared/constant/dialog-config.constant';

@Component({
  selector: 'app-city-dialog',
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

  <form [formGroup]='form' *ngIf='form'>
    <div class='row'>
      <div class='col-lg-3 col-md-12'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'name'|translate }}</mat-label>
          <input matInput formControlName='name'>
        </mat-form-field>
      </div>
    </div>

    <div class='row'>
      <div class='col-lg-2 col-xs-12'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'subprefecture'|translate }}</mat-label>
          <mat-select formControlName='subprefectureID'>
            <mat-option *ngFor='let el of subprefectures' [value]='el.id'>{{el.name}}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-lg-2 col-xs-12'>
        <mat-slide-toggle formControlName='districtCapital'></mat-slide-toggle>&nbsp;{{ 'district_capital'|translate }}
      </div>
      <div class='col-lg-2 col-xs-12'>
        <mat-slide-toggle formControlName='regionCapital'></mat-slide-toggle>&nbsp;{{ 'region_capital'|translate }}
      </div>
      <div class='col-lg-2 col-xs-12'>
        <mat-slide-toggle formControlName='departmentCapital'></mat-slide-toggle>&nbsp;{{ 'department_capital'|translate }}
      </div>
      <div class='col-lg-2 col-xs-12'>
        <mat-slide-toggle formControlName='subprefectureCapital'></mat-slide-toggle>&nbsp;{{ 'subprefecture_capital'|translate }}
      </div>
    </div>
  </form>
  `
})
export class CityDialogComponent implements OnInit {

  form: FormGroup;
  loader: boolean;
  route = ROUTE;
  readonly dialog_config = DIALOG_CONFIG;
  subprefectures: Subprefecture[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    public trans: TranslateService,
    private api: ApiService,
    private alert: AlertService
  ) {
    this.route.path = 'city';
    this.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    forkJoin({
      subprefectures: this.api.findAll({ ...this.route, path: 'subprefecture' })
    }).pipe(first())
      .subscribe(res => { this.subprefectures = res.subprefectures; });

    this.createForm();
    if (this.route.id) {
      this.loader = true;
      this.api.findOne(this.route).pipe(first())
        .subscribe(
          (item: City) => { this.form.patchValue(item); this.loader = false; },
          err => { this.alert.error(err); this.loader = false; }
        );
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      subprefectureID: ['', Validators.compose([Validators.required])],
      districtCapital: [false, Validators.compose([Validators.required])],
      regionCapital: [false, Validators.compose([Validators.required])],
      departmentCapital: [false, Validators.compose([Validators.required])],
      subprefectureCapital: [false, Validators.compose([Validators.required])],
    });
  }

  create(): void {
    this.loader = true;
    this.form.value.subprefectureID = parseInt(this.form.value.subprefectureID);
    this.api.create(this.route, this.form.value).pipe(first())
      .subscribe(
        () => { this.alert.success(); this.createForm(); this.loader = false; },
        err => { this.alert.error(err); this.loader = false; }
      );
  }

  update(): void {
    this.loader = true;
    this.api.update(this.route, this.form.value).pipe(first())
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
        return !this.route.id && this.form.valid && !this.loader;
      case 'update':
        return this.route.id && this.form.valid && !this.loader;
      case 'delete':
        return this.route.id && !this.loader;
      default:
        return false;
    }
  }

}
