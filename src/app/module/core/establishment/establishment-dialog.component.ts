import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { AuthService, CrudService } from 'src/app/service';
import { City, Establishment } from 'src/app/model';
import { ESTABLISHMENT_NATURE } from 'src/app/constant';
import { Feature, Permission } from 'src/app/enum';

@Component({
  selector: 'app-establishment-dialog',
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

  cities: City[] = null;
  readonly establishmentNature = ESTABLISHMENT_NATURE;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = Feature.Establishment;
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
    this.crud.defaultForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      nature: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      municipality: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    forkJoin({
      cities: this.crud.readAll('city')
    }).pipe(first()).subscribe((res: any) => this.cities = res.cities);

    this.crud.createForm();
    if (this.crud.route.id) { this.crud.readOne().subscribe(); }
    this.auth.permissions(Feature.Establishment);
  }

  create(): void{
    this.crud.create().subscribe((item: Establishment) => this.router.navigate([this.crud.route.path + '/update/' + this.crud.route.id]));
  }

}
