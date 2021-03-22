import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { AuthService, CrudService } from 'src/app/service';
import { City, Department } from 'src/app/model';
import { Feature, Permission } from 'src/app/enum';

@Component({
  selector: 'app-city-dialog',
  template: `
  <div class='d-flex justify-content-start'>
    <mat-icon (click)='router.navigate([crud.route.path])'>keyboard_backspace</mat-icon>
  </div>

  <div *ngIf='crud.load' class='d-flex justify-content-center'><mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner></div>

  <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4'>
    <div class='d-flex flex-column'>
      <button *ngIf='permissions.create && !crud.load && !crud.route.id && crud.form.valid' (click)='create()' mat-mini-fab color='primary' class='mb-1'><mat-icon>save</mat-icon></button>
      <button *ngIf='permissions.update && !crud.load && crud.route.id && crud.form.valid' (click)='crud.update().subscribe()' mat-mini-fab color='primary' class='mb-1'><mat-icon>edit</mat-icon></button>
      <button *ngIf='permissions.delete && !crud.load && crud.route.id' (click)='crud.delete().subscribe()' mat-mini-fab color='warn' class='mb-1'><mat-icon>delete_outline</mat-icon></button>
    </div>
  </div>

  <br>

  <form [formGroup]='crud.form' *ngIf='crud.form'>
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

  departments: Department[] = null;
  permissions = {
    create: false,
    update: false,
    delete: false
  };

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = Feature.City;
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
    this.crud.defaultForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      departmentId: ['', Validators.compose([Validators.required])]
    });
    this.permissions.create = this.auth.checkPermission(Feature.City, Permission.Create);
    this.permissions.update = this.auth.checkPermission(Feature.City, Permission.Update);
    this.permissions.delete = this.auth.checkPermission(Feature.City, Permission.Delete);
  }

  ngOnInit(): void {
    forkJoin({
      departments: this.crud.readAll('department')
    }).pipe(first()).subscribe((res: any) => this.departments = res.departments);

    this.crud.createForm();
    if (this.crud.route.id) { this.crud.readOne().subscribe(); }
  }

  create(): void{
    this.crud.create().subscribe((item: City) => this.router.navigate([this.crud.route.path + '/update/' + this.crud.route.id]));
  }

}
