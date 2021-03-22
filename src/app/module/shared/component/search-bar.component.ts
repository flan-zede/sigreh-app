import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  template: `
    <mat-form-field floatLabel="never" appearance='outline'>
      <mat-icon matPrefix *ngIf='text.value.length > 0' (click)='text.value =""; return.emit()' >keyboard_backspace</mat-icon>
      <mat-icon matPrefix *ngIf='text.value.length == 0' (click)='text.value =""; return.emit()'>menu</mat-icon>
      <input #text placeholder="{{ 'search'|translate }} ..." class='pl-2' matInput (keyup.enter)='search(text.value)'>
      <mat-icon matSuffix *ngIf='text.value.length > 0' (click)='text.value=""' class='mr-2'>clear</mat-icon>
      <mat-icon matSuffix (click)='search(text.value)'>search</mat-icon>
    </mat-form-field>
  `
})
export class SearchBarComponent {

  @Output() query = new EventEmitter<string>();
  @Output() return = new EventEmitter();

  search(text: string): void {
    const formatedText = text.toLowerCase().trim();
    if (formatedText.length > 2) { this.query.emit(formatedText); }
  }

}
