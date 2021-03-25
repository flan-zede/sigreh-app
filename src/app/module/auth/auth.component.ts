import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AlertService, AuthService } from 'src/app/service';
import { AuthResponseInterface } from 'src/app/interface';

@Component({
  selector: 'app-auth',
  template: `
  <div class='d-flex justify-content-center align-items-center h-100'>
    <div class='d-flex flex-column border' width='360'>
      <mat-card>
        <div class='d-flex justify-content-center mb-2'>
            <img src='assets/icons/icon-72x72.png' />
        </div>
        <div class='text-center'>
          <h3 class='mb-2'>SIGREH</h3>
          <p>{{ 'enterTo'|translate }}</p>
        </div>
        <form [formGroup]='form' *ngIf='form'>
          <mat-form-field appearance='outline' floatLabel='never'>
            <input matInput placeholder="{{ 'username'|translate }}" formControlName='username'>
            <mat-error *ngIf="form.controls['username'].hasError('required')">{{ 'required'|translate }}</mat-error>
            <mat-error *ngIf="form.controls['password'].hasError('minLength')">{{ 'minLength'|translate }} 5</mat-error>
          </mat-form-field>
          <mat-form-field appearance='outline' floatLabel='never'>
            <input matInput placeholder="{{ 'password'|translate }}" [type]="hide ? 'password' : 'text'" formControlName='password'>
            <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
            <mat-error *ngIf="form.controls['password'].hasError('required')">{{ 'required'|translate }}</mat-error>
            <mat-error *ngIf="form.controls['password'].hasError('minLength')">{{ 'minLength'|translate }} 5</mat-error>
          </mat-form-field>
          <div class='d-flex justify-content-center'>
            <button mat-raised-button color='primary' [class.spinner]='load' [disabled]='form.invalid || load' (click)='login()'>
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
  load = false;
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private http: HttpClient,
    private alert: AlertService,
    public auth: AuthService
  ) {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])]
    });
  }

  ngOnInit(): void {
  }

  login(): void {
    this.http.post(`${environment.api}/user/login`, this.form.value)
      .pipe(
        first(),
        tap(() => this.load = true),
        finalize(() => this.load = false),
        catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
      )
      .subscribe((p: AuthResponseInterface) => {
        this.auth.setCredential(p);
        this.router.navigate(['dashboard']);
      });
  }

}
