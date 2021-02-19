import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map, startWith } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from 'src/app/service/api.service';
import { AlertService } from 'src/app/service/alert.service';

import { AlertConfirmComponent } from 'src/app/shared/component/alert-confirm.component';

import { City } from 'src/app/model/city.model';
import { Department } from 'src/app/model/department.model';

import { ROUTE, DIALOG_CONFIG } from 'src/app/shared/constant/app.constant';

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
  <div class='d-flex justify-content-center mr-4 mb-2'>
    <mat-progress-spinner *ngIf='loader' mode='indeterminate' [diameter]='20'></mat-progress-spinner>
  </div>

  <form [formGroup]='form' *ngIf='form'>
    <div class='row'>
      <div class='col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'name'|translate }}</mat-label>
          <input matInput formControlName='name'>
        </mat-form-field>
      </div>
      <div class='col-sm-6'>
        <mat-form-field appearance='outline' >
          <mat-label>{{ 'department'|translate }}</mat-label>
          <input matInput matInput formControlName='department' [matAutocomplete]='auto'>
          <mat-autocomplete #auto='matAutocomplete' [displayWith]='displayFn'>
            <mat-option *ngFor='let el of filteredDepartments | async' [value]='el'>{{ el.name }}</mat-option>
          </mat-autocomplete>
        </mat-form-field>
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
  departments: Department[] = [];
  filteredDepartments: Observable<Department[]>;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    public trans: TranslateService,
    private api: ApiService,
    private alert: AlertService
  ) {
    this.route = { path: 'city', id: this.activatedRoute.snapshot.params?.id };
  }

  ngOnInit(): void {
    forkJoin({
      departments: this.api.findAll({ ...this.route, path: 'department' })
    }).pipe(first()).subscribe(res => { this.departments = res.departments;  this.filteredDepartments = of(res.departments); });

    this.createForm();
    if (this.route.id) {
      this.loader = true;
      this.api.findOne(this.route).pipe(first())
        .subscribe(
          (item: City) => { this.form.patchValue(item); this.loader = false; },
          err => { this.alert.error(err); this.loader = false; }
        );
    }

    this.form.controls.departmentId.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.name), map(name => this.filterDepartment(name))).subscribe();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      department: ['', Validators.compose([Validators.required])],
      departmentId: ['']
    });
  }

  create(): void {
    this.loader = true;
    this.form.value.departmentId = this.form.value.department.id;
    this.api.create(this.route, this.form.value).pipe(first())
      .subscribe(
        () => { this.alert.success(); this.createForm(); this.loader = false; },
        err => { this.alert.error(err); this.loader = false; }
      );
  }

  update(): void {
    this.loader = true;
    this.form.value.departmentId = this.form.value.department.id;
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
      case 'create': return !this.route.id && this.form.valid && !this.loader;
      case 'update': return this.route.id && this.form.valid && !this.loader;
      case 'delete': return this.route.id && !this.loader;
      default: return false;
    }
  }

  displayFn(item: Department): string { return item && item.name ? item.name : ''; }
  
  filterDepartment(name: string) {
    if(name == '' || name == null) this.filteredDepartments = of(this.departments.slice());
    else this.filteredDepartments = of(this.departments.filter(p => p.name.toLowerCase().indexOf(name.toLowerCase()) === 0));
  }

}
