import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-confirm',
  template: `
    <div class='d-flex justify-content-center'>
      <p>{{ data.message }}</p>
    </div>
    <div class='d-flex justify-content-end'>
      <button mat-button id='no' color='primary' [mat-dialog-close]='false' >{{ 'cancel'|translate }}</button>
      <button mat-button id='yes' color='primary' [mat-dialog-close]='true' >{{ 'confirm'|translate }}</button>
    </div>
  `
})
export class AlertConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

}