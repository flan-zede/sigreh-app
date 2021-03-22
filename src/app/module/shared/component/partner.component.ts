import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { GENDER } from 'src/app/constant';

@Component({
    selector: 'app-partner',
    template: `
    <form [formGroup]='form'>
        <div class='row'>
            <div class='col-sm-4'>
                <mat-form-field appearance='outline'>
                    <mat-label>{{ 'gender'|translate }}</mat-label>
                    <mat-select formControlName='gender'>
                    <mat-option *ngFor='let p of gender' [value]='p.id'>{{ p.name }}</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
            <div class='col-sm-4'>
                <mat-form-field appearance='outline'>
                    <mat-label>{{ 'name'|translate }}</mat-label>
                    <input matInput formControlName='name'>
                </mat-form-field>
            </div>
            <div class='col-sm-4'>
                <mat-form-field appearance='outline'>
                    <mat-label>{{ 'age'|translate }}</mat-label>
                    <input matInput type='number' formControlName='age'>
                </mat-form-field>
            </div>
        </div>
        <div class='d-flex justify-content-end'>
            <button mat-button id='no' color='primary' [mat-dialog-close]='null' >{{ 'cancel'|translate }}</button>
            <button [disabled]='!form.valid' mat-button id='yes' color='primary' [mat-dialog-close]='form.value' >{{ 'add'|translate }}</button>
        </div>
    </form>
  `
})
export class PartnerComponent {

    form: FormGroup;
    readonly gender = GENDER;

    constructor(
        public dialogRef: MatDialogRef<PartnerComponent>,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            gender: ['', Validators.compose([Validators.required])],
            name: [''],
            age: ['', Validators.compose([Validators.required])]
        });
    }

}
