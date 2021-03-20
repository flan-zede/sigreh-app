import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-select',
  template: `
    <div class='d-flex justify-content-end'>
      <button mat-button [mat-dialog-close]='select'>{{ 'close'|translate }}</button>
    </div>
    <div *ngIf='select.length > 0'>
      <mat-chip-list><mat-chip *ngFor='let p of select'>{{ p.name }}</mat-chip></mat-chip-list>
    </div>
    <mat-dialog-content>
      <div *ngIf='list.length > 0'>
        <mat-selection-list [(ngModel)]='select' [multiple]='multiple'>
          <mat-list-option *ngFor='let p of list' [value]='p' class='border-bottom'>{{ p.name }}</mat-list-option>
        </mat-selection-list>
      </div>
    </mat-dialog-content>
  `
})
export class ModalSelectComponent {

  list = [];
  select = [];
  multiple: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.list = this.data.list;
    this.select = this.data.select;
    this.multiple = this.data.multiple;
  }

}
