import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { CrudService } from 'src/app/service';

@Component({
  selector: 'app-auth',
  template: `
  <div class='d-flex justify-content-center align-items-center h-100'>
    <div class='d-flex flex-column' width='360'>
      <mat-card>
        <div class='d-flex justify-content-center mb-2'>
            <img src='assets/icons/icon-72x72.png' />
        </div>
        <div class='text-center'>
          <h3 class='mb-2'>SIGREH</h3>
          <p>{{ 'enter_to'|translate }}</p>
        </div>
        <form [formGroup]='crud.form' *ngIf='crud.form'>
          <mat-form-field appearance='outline' floatLabel='never'>
            <input matInput placeholder="{{ 'username'|translate }}" formControlName='username'>
            <mat-error *ngIf="crud.form.controls['username'].hasError('required')">{{ 'required'|translate }}</mat-error>
            <mat-error *ngIf="crud.form.controls['password'].hasError('minLength')">{{ 'min_length'|translate }} 5</mat-error>
          </mat-form-field>
          <mat-form-field appearance='outline' floatLabel='never'>
            <input matInput placeholder="{{ 'password'|translate }}" [type]="hide ? 'password' : 'text'" formControlName='password'>
            <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
            <mat-error *ngIf="crud.form.controls['password'].hasError('required')">{{ 'required'|translate }}</mat-error>
            <mat-error *ngIf="crud.form.controls['password'].hasError('minLength')">{{ 'min_length'|translate }} 5</mat-error>
          </mat-form-field>
          <div class='d-flex justify-content-center'>
            <button mat-raised-button color='primary' [class.spinner]='crud.load' [disabled]='crud.form.invalid || crud.load' (click)='login()'>
              {{ 'signin'|translate }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  </div>
  `
})
export class AuthComponent implements OnInit {

  hide = true;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public crud: CrudService
  ) {
    this.crud.defaultForm = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])]
    });
  }

  ngOnInit(): void {
    this.crud.createForm();
  }

  login(): void {
    this.crud.login().pipe(first()).subscribe(() => this.router.navigate(['client']));
  }

}
