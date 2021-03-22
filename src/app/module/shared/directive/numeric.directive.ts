import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumeric]'
})
export class NumericDirective {

  @Input() text: number;

  constructor(private el: ElementRef) { }

  private check(value: string): any {
    if (this.text <= 0) { return String(value).match(new RegExp(/^\d+$/)); }
    else {
      return String(value).match(
        new RegExp('^\\s*((\\d+(\\.\\d{0,' + this.text + '})?)|((\\d*(\\.\\d{1,' + this.text + '}))))\\s*$')
      );
    }
  }

  private run(oldValue: string): void {
    setTimeout(() => {
      const currentValue = this.el.nativeElement.value;
      this.el.nativeElement.value = (currentValue !== '' && !this.check(currentValue)) ? oldValue : currentValue;
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.run(this.el.nativeElement.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    this.run(this.el.nativeElement.value);
  }

}
