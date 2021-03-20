import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { AuthService, CrudService } from 'src/app/service';
import { City } from 'src/app/model';
import { ESTABLISHMENT_NATURE } from 'src/app/shared/constant';

@Component({
  selector: 'app-establishment-dialog',
  template: `
  <app-form-option [ability]='auth.ability()' [route]='crud.route' [form]='crud.form' [load]='crud.load' 
  (create)='crud.create().subscribe()' (update)='crud.update().subscribe()' (delete)='crud.delete().subscribe()'></app-form-option>

  <form [formGroup]='crud.form' *ngIf='crud.form'>
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
            <mat-option *ngFor='let p of establishment_nature' [value]='p.id'>{{ p.name }}</mat-option>
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

  cities: City[] = null;
  readonly establishment_nature = ESTABLISHMENT_NATURE;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'establishment';
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
    this.crud.defaultForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      nature: ['', Validators.compose([Validators.required])],
      cityId: [''],
      municipality: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    forkJoin({
      cities: this.crud.readAll('city')
    }).pipe(first()).subscribe(res => this.cities = res.cities);

    this.crud.createForm();
    if (this.crud.route.id) this.crud.readOne().subscribe();
  }

}
