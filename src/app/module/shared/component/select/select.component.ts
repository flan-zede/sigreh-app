import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent {

  list = [];
  select = [];
  multiple = false;

  constructor(
    public dialogRef: MatDialogRef<SelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.list = this.data.list;
    this.select = this.data.select;
    this.multiple = this.data.multiple;
  }

}
