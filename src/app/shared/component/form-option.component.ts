import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Ability } from '@casl/ability';
import { RouteInterface } from 'src/app/shared/interface';

@Component({
  selector: 'app-form-option',
  template: `
    <div class='d-flex justify-content-start position-fixed fixed-top'>
      <button (click)='router.navigate([route.path])' mat-mini-fab color='primary'><mat-icon>keyboard_backspace</mat-icon></button>
    </div>

    <div *ngIf='load' class='d-flex justify-content-center'><mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner></div>
    
    <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4'>
      <div class='d-flex flex-column'>
        <button *ngIf='ability.can("create", route.path) && !load && !route.id && form.valid' (click)='create.emit()' mat-mini-fab color='primary' class='mb-1'><mat-icon>save</mat-icon></button>
        <button *ngIf='ability.can("update", route.path) && !load && route.id && form.valid' (click)='update.emit()' mat-mini-fab color='accent' class='mb-1'><mat-icon>edit</mat-icon></button>
        <button *ngIf='ability.can("delete", route.path) && !load && route.id' (click)='delete.emit();' mat-mini-fab color='warn' class='mb-1'><mat-icon>delete_outline</mat-icon></button>
      </div>
    </div>
  `
})
export class FormOptionComponent {

  @Input() ability: Ability;
  @Input() route: RouteInterface;
  @Input() form: FormGroup;
  @Input() load: Boolean;
  @Output() create = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(public router: Router) {}

}