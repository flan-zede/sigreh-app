import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Ability } from '@casl/ability';
import { RouteInterface } from 'src/app/shared/interface';

@Component({
  selector: 'app-view-option',
  template: `
    <div *ngIf='count == -1' class='d-flex justify-content-start position-fixed fixed-top'>
      <button (click)='router.navigate([route.path])' mat-mini-fab color='primary'><mat-icon>keyboard_backspace</mat-icon></button>
    </div>

    <div *ngIf='load' class='d-flex justify-content-center'><mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner></div>

    <div *ngIf='!load && count == 0' class='d-flex justify-content-center align-items-center'>{{ 'no_data'|translate }}</div>

    <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4 mb-2'>
      <div class='d-flex flex-column'>
        <button *ngIf='ability.can("create", route.path)' (click)='router.navigate([route.path + "/create"])' mat-mini-fab color='primary' class='mb-1'><mat-icon>add</mat-icon></button>
        <button *ngIf='ability.can("update", route.path) && route.id' (click)='router.navigate([route.path + "/update/" + route.id])' mat-mini-fab color='accent' class='mb-1'><mat-icon>edit</mat-icon></button>
        <button *ngIf='ability.can("delete", route.path) && route.id' (click)='delete.emit()' mat-mini-fab color='warn' class='mb-1'><mat-icon>delete_outline</mat-icon></button>
      </div>
    </div>
  `
})
export class ViewOptionComponent {

  @Input() ability: Ability;
  @Input() load: Boolean;
  @Input() route: RouteInterface;
  @Input() count: number;
  @Output() delete = new EventEmitter();

  constructor(public router: Router) {}

}