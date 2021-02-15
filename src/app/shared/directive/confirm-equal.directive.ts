import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validator } from "@angular/forms";

@Directive({
  selector: '[appConfirmEqual]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ConfirmEqualDirective,
    multi: true
  }]
})
export class ConfirmEqualDirective implements Validator {

  @Input() appConfirmEqual: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    const controlToCompare = control.parent.get(this.appConfirmEqual);
    if (controlToCompare && controlToCompare.value != control.value) {
      return { 'notEqual': true };
    }
    return null;
  }

}
