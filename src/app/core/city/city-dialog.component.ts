import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { AuthService, CrudService } from 'src/app/service';
import { Department } from 'src/app/model';

@Component({
  selector: 'app-city-dialog',
  template: `
  <app-form-option [ability]='auth.ability()' [route]='crud.route' [form]='crud.form' [load]='crud.load' 
  (create)='crud.create().subscribe()' (update)='crud.update().subscribe()' (delete)='crud.delete().subscribe()'></app-form-option>

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

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'city';
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
    this.crud.defaultForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      departmentId: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
    forkJoin({
      departments: this.crud.readAll('department')
    }).pipe(first()).subscribe(res => this.departments = res.departments);

    this.crud.createForm();
    if (this.crud.route.id) this.crud.readOne().subscribe();
  }
}
