import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/app/service/auth.service';
import { AlertService } from 'src/app/service/alert.service';

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
        <form [formGroup]='form' *ngIf='form'>
          <mat-form-field appearance='outline' floatLabel='never'>
            <input matInput placeholder="{{ 'username'|translate }}" formControlName='username'>
            <mat-error *ngIf="form.controls['username'].hasError('required')">{{ 'required'|translate }}</mat-error>
            <mat-error *ngIf="form.controls['password'].hasError('minLength')">{{ 'min_length'|translate }} 6</mat-error>
          </mat-form-field>
          <mat-form-field appearance='outline' floatLabel='never'>
            <input matInput placeholder="{{ 'password'|translate }}" [type]="hide ? 'password' : 'text'" formControlName='password'>
            <mat-icon matSuffix (click)='hide = !hide'>{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>
            <mat-error *ngIf="form.controls['password'].hasError('required')">{{ 'required'|translate }}</mat-error>
            <mat-error *ngIf="form.controls['password'].hasError('minLength')">{{ 'min_length'|translate }} 6</mat-error>
          </mat-form-field>
          <div class='d-flex justify-content-center'>
            <button mat-raised-button color='primary' [class.spinner]='loader' [disabled]='form.invalid || loader' (click)='login()'>
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

  form: FormGroup;
  hide: boolean = true;
  loader: boolean;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public trans: TranslateService,
    private auth: AuthService,
    public alert: AlertService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(45)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(45)])]
    });
  }

  login(): void {
    this.loader = true;
    this.auth.login(this.form.value).pipe(first())
      .subscribe(
        () => {
          this.loader = false;
          const redirect = this.activatedRoute.snapshot.params?.return;
          if(redirect) this.router.navigate([`/${redirect}`]);
          else this.router.navigate(['/client']);
        },
        err => { this.alert.error(err); this.loader = false; }
      );
  }

}
