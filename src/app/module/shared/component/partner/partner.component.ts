import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { GENDER } from 'src/app/constant';

@Component({
    selector: 'app-partner',
    templateUrl: './partner.component.html'
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
            name: ['', Validators.compose([Validators.required])],
            age: ['', Validators.compose([Validators.required])]
        });
    }

}
